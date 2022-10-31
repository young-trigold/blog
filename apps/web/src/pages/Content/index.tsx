import { Node as ProseMirrorNode } from 'prosemirror-model';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import {
	ContentPageContext,
	fetchContentPageDataByID,
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
import { EditorView } from 'prosemirror-view';
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
	const editorViewRef = useRef<EditorView | null>(null);
	const contentPageContext = useMemo(
		() => ({ editable, isChapter, editorViewRef }),
		[editable, isChapter, editorViewRef],
	);
	if (error) message.error(error.message ?? '');
	useDocumentTitle(`${isChapter ? '章节' : '文章'} - ${title}`, [title]);

	useEffect(() => {
		dispatch(fetchContentPageDataByID({ itemID, isChapter }));
	}, [itemID, isChapter, fetchContentPageDataByID]);

	const [currentHeadingIDSearchParam, setCurrentHeadingIDSearchParam] = useSearchParams();
	const isFirstRef = useRef(true);
	useEffect(() => {
		if (!isFirstRef.current) return;
		const initialHeadingIDFromURL = currentHeadingIDSearchParam.get('currentHeadingID');
		const currentHeadingElement = findHeadingElementByID(initialHeadingIDFromURL ?? '');
		if (currentHeadingElement) {
			currentHeadingElement.scrollIntoView();
			isFirstRef.current = false;
			dispatch(setCurrentHeadingID(initialHeadingIDFromURL!));
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
			dispatch(resetContentPage());
		};
	}, []);

	const { editorState } = editor;
	const dispatchTransaction = useCallback(
		(tr: Transaction) => {
			window.requestAnimationFrame(() => {
				const { current: editorView } = editorViewRef;
				if (!editorView || !editorState) return;
				const newState = addHeadingID(editorState.apply(tr));
				// 更新 insert tooltip
				const { selection } = newState;
				const { $head, empty } = selection;
				const { nodeAfter, nodeBefore } = $head;
				const canInsertBlock = nodeAfter === null || nodeBefore === null;
				const cursorPositionToViewPort = editorView.coordsAtPos($head.pos);
				const editorContainerPositionToViewPort =
					editorView.dom.parentElement!.getBoundingClientRect();
				dispatch(
					setInsertTooltip({
						visible: empty,
						canInsertBlock,
						position: {
							left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
							top: cursorPositionToViewPort.bottom - editorContainerPositionToViewPort.top,
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
			});
		},
		[editorState, editorViewRef, addHeadingID],
	);

	useEffect(() => {
		if (!editor.editorContent) return;
		const doc = ProseMirrorNode.fromJSON(schema, JSON.parse(editor.editorContent));
		const initialEditorState = EditorState.create({
			schema,
			doc,
			plugins,
		});
		dispatch(setEditorState(initialEditorState));
	}, [editor.editorContent]);

	useEffect(() => {
		console.debug(editorState);
	}, [editorState]);

	if (loading) return <LoadingIndicator />;
	return (
		<ContentPageContext.Provider value={contentPageContext}>
			<StyledContentPage>
				<Header />
				<ContentContainer>
					<MainContainer>
						<Catalog />
						{editorState && (
							<Editor
								state={editorState}
								nodeViews={nodeViews}
								editable={editable}
								dispatchTransaction={dispatchTransaction}
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
