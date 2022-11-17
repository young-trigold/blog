import { Node as ProseMirrorNode } from 'prosemirror-model';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppState, useAppDispatch } from '@/app/store';
import {
	ContentPageContext,
	fetchContentPageDataByID,
	resetContentPage,
	setCurrentHeadingID,
	setEditorState,
	setInsertTooltip,
	setInsertTooltipVisible,
	setSelectionTooltip,
	setSelectionTooltipVisible,
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

export type EditorDOMEventHandlers = {
	[Event in keyof HTMLElementEventMap]?: (
		view: EditorView,
		event: HTMLElementEventMap[Event],
	) => void | boolean;
};

const ContentPage: React.FC<ContentPageProps> = (props) => {
	const { isChapter, editable } = props;

	const { itemID } = useParams();
	const dispatch = useAppDispatch();

	const { loading, editor, error, catalog, title } = useSelector(
		(state: AppState) => state.contentPage,
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

	const ref = useRef<{ view: EditorView | null }>({ view: null });

	const onChange = useCallback(
		(tr: Transaction, state: EditorState) => {
			window.requestAnimationFrame(() => {
				const { view } = ref.current;
				if (!view || !state) return;
				const newState = addHeadingID(state.apply(tr));
				// 更新 insert tooltip
				const { selection } = newState;
				const { $head, empty } = selection;
				const { nodeAfter, nodeBefore } = $head;
				const canInsertBlock = nodeAfter === null || nodeBefore === null;
				const cursorPositionToViewPort = view.coordsAtPos($head.pos);
				const editorContainerPositionToViewPort = view.dom.parentElement!.getBoundingClientRect();
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
		[ref.current?.view, addHeadingID],
	);

	useEffect(() => {
		const doc = editor.editorContent
			? ProseMirrorNode.fromJSON(schema, JSON.parse(editor.editorContent))
			: undefined;

		const initialEditorState = EditorState.create({
			schema,
			doc,
			plugins,
		});

		dispatch(setEditorState(initialEditorState));
	}, [editor.editorContent]);

	const contentPageContext = useMemo(
		() => ({ editable, isChapter, editorView: ref.current?.view }),
		[editable, isChapter, ref.current?.view],
	);

	const editorDOMEventHandlers: EditorDOMEventHandlers = useMemo(
		() => ({
			blur() {
				dispatch(setInsertTooltipVisible(false));
				dispatch(setSelectionTooltipVisible(false));
			},
		}),
		[],
	);

	const { editorState } = editor;

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
								autoFocus
								ref={ref}
								state={editorState}
								nodeViews={nodeViews}
								editable={editable}
								onChange={onChange}
								handleDOMEvents={editorDOMEventHandlers}
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
