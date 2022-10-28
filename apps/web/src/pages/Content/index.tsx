import { Node as ProseMirrorNode } from 'prosemirror-model';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import {
	ContentPageContext,
	fetchContentPageDataByID,
	initialState,
	resetContentPage,
	setCurrentHeadingID,
	setEditorState,
	setInsertTooltip,
	setSelectionTooltip,
} from '@/app/store/pages/contentPage';
import LoadingIndicator from '@/components/LodingIndicator';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { EditorState, Transaction } from 'prosemirror-state';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ActionBar from './components/ActionBar';
import { Catalog, CatalogButton } from './components/catalog';
import CommentList from './components/comment/CommentList';
import ContentContainer from './components/ContentContainer';
import Editor from './components/editor';
import nodeViews from './components/editor/nodeViews';
import plugins from './components/editor/plugins';
import schema from './components/editor/schema';
import addHeadingID from './components/editor/utils/addHeadingID';
import findHeadingElementByID from './components/editor/utils/findHeadingElementByID';

const StyledContentPage = styled.div`
	max-height: 100%;
	position: relative;
	white-space: pre-wrap;
	background-color: ${(props) => props.theme.backgroundColor};
	transition: ${(props) => props.theme.transition};
`;

const MainContainer = styled.main`
	position: relative;
	display: flex;
	align-items: flex-start;
`;

interface ContentPageProps {
	isChapter: boolean;
	editable: boolean;
}

const ContentPage: React.FC<ContentPageProps> = (props) => {
	const { isChapter, editable } = props;

	const { itemID } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	const { loading, editor, error, catalog, title } = useSelector(
		(state: AppState) => state.contentPage,
	);
	useDocumentTitle(`${isChapter ? '章节' : '文章'} - ${title}`, [title]);

	useEffect(() => {
		dispatch(fetchContentPageDataByID({ itemID, isChapter }));
	}, [itemID, isChapter, fetchContentPageDataByID]);

	useEffect(() => {
		if (!editor.editorContent) return;
		const doc = ProseMirrorNode.fromJSON(schema, JSON.parse(editor.editorContent));
		const editorState = EditorState.create({
			schema,
			doc,
			plugins,
		});
		dispatch(setEditorState(editorState));
	}, [loading]);
	const [currentHeadingIDSearchParam, setCurrentHeadingIDSearchParam] = useSearchParams();
	const isFirstRef = useRef(true);
	useEffect(() => {
		if (!isFirstRef.current) return;
		const initialHeadingIDFromURL = currentHeadingIDSearchParam.get('currentHeadingID');
		const currentHeadingElement = findHeadingElementByID(initialHeadingIDFromURL ?? '');
		if (currentHeadingElement) {
			currentHeadingElement.scrollIntoView();
			isFirstRef.current = false;
			dispatch(setCurrentHeadingID(initialHeadingIDFromURL));
		}
	});

	useEffect(() => {
		const { currentHeadingID } = catalog;
		if (!currentHeadingID) return;
		setCurrentHeadingIDSearchParam({ currentHeadingID }, { replace: true });
	}, [catalog.currentHeadingID]);

	// unmount
	useEffect(() => {
		return () => {
			dispatch(resetContentPage(initialState));
		};
	}, []);

	const onChange = (tr: Transaction) => {
		const { editorView } = editor;
		if (!editorView) return;
		const newState = addHeadingID(editorView.state.apply(tr));
		// 更新 insert tooltip
		const { selection } = newState;
		const { $head, empty } = selection;
		const { nodeAfter, nodeBefore } = $head;
		const canInsertBlock = nodeAfter === null || nodeBefore === null;
		const cursorPositionToViewPort = editorView.coordsAtPos($head.pos);
		const editorContainerPositionToViewPort = editorView.dom.parentElement!.getBoundingClientRect();
		dispatch(
			setInsertTooltip({
				visible: empty,
				canInsertBlock,
				position: {
					left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
					bottom: cursorPositionToViewPort.bottom - editorContainerPositionToViewPort.top,
				},
			}),
		);

		dispatch(
			setSelectionTooltip({
				visible: !empty,
				position: {
					left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
					top: cursorPositionToViewPort.top - editorContainerPositionToViewPort.top,
				},
			}),
		);
		dispatch(setEditorState(newState));
	};

	const initialContentPageContext = useMemo(() => ({ editable, isChapter }), [editable, isChapter]);
	if (error) message.error(error.message ?? '');
	if (loading) return <LoadingIndicator />;

	return (
		<ContentPageContext.Provider value={initialContentPageContext}>
			<StyledContentPage>
				<Header />
				<ContentContainer>
					<MainContainer>
						<Catalog />
						{editor.editorState && (
							<Editor
								state={editor.editorState}
								nodeViews={nodeViews}
								editable={editable}
								onChange={onChange}
								autoFocus
							/>
						)}
						<CommentList />
						{editable && <ActionBar />}
						<CatalogButton />
					</MainContainer>
					<Footer />
				</ContentContainer>
			</StyledContentPage>
		</ContentPageContext.Provider>
	);
};

export default memo(ContentPage);
