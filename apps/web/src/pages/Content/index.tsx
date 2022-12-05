import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppState, useAppDispatch } from '@/app/store';
import {
	ContentPageContext,
	fetchContentPageDataById,
	resetContentPage,
	setCurrentHeadingId,
	setInsertTooltip,
	setInsertTooltipVisible,
	setSelectionTooltip,
	setSelectionTooltipVisible,
} from '@/app/store/pages/contentPage';
import LoadingIndicator from '@/components/LodingIndicator';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { EditorView } from 'prosemirror-view';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ActionBar from './components/ActionBar';
import { Catalog, CatalogButton } from './components/catalog';
import CommentList from './components/comment/CommentList';
import ContentContainer from './components/ContentContainer';
import Editor from './components/editor';
import {
	BoldExtension,
	CodeBlockExtension,
	CodeExtension,
	HeadingExtension,
	ItalicExtension,
	LinkExtension,
	SubExtension,
	SupExtension,
	UnderlineExtension,
} from './components/editor/extensions';
import { ListExtensions } from './components/editor/extensions/nodeExtensions/listExtensions';
import { HandleDOMEvents } from './components/editor/store';
import addHeadingId from './components/editor/utils/addHeadingId';
import findHeadingElementById from './components/editor/utils/findHeadingElementById';

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
	const { itemId } = useParams();
	const dispatch = useAppDispatch();

	const contentPageContext: ContentPageContext = useMemo(() => ({ isChapter }), []);

	const { loading, editor, error, catalog, title } = useSelector(
		(state: AppState) => state.contentPage,
	);

	const { editorContent } = editor;

	if (error) message.error(error.message ?? '');
	useDocumentTitle(`${isChapter ? '章节' : '文章'} - ${title}`, [title]);

	useEffect(() => {
		dispatch(fetchContentPageDataById({ itemId, isChapter }));
	}, [itemId, isChapter]);

	const [currentHeadingIdSearchParam, setCurrentHeadingIdSearchParam] = useSearchParams();
	const isFirstRef = useRef(true);
	useEffect(() => {
		if (!isFirstRef.current) return;
		const initialHeadingIdFromURL = currentHeadingIdSearchParam.get('currentHeadingId');
		const currentHeadingElement = findHeadingElementById(initialHeadingIdFromURL ?? '');
		if (currentHeadingElement) {
			currentHeadingElement.scrollIntoView();
			isFirstRef.current = false;
			dispatch(setCurrentHeadingId(initialHeadingIdFromURL!));
		}
	});

	useEffect(() => {
		const { currentHeadingId } = catalog;
		if (!currentHeadingId) return;
		setCurrentHeadingIdSearchParam({ currentHeadingId }, { replace: true });
	}, [catalog.currentHeadingId]);

	// unmount
	useEffect(() => {
		return () => {
			dispatch(resetContentPage());
		};
	}, []);

	const onChange = useCallback((view: EditorView) => {
		const { state } = view;
		const newState = addHeadingId(state);
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
	}, []);

	const handleDOMEvents: HandleDOMEvents = useMemo(
		() => ({
			blur: () => {
				dispatch(setInsertTooltipVisible(false));
				dispatch(setSelectionTooltipVisible(false));
			},
		}),
		[],
	);

	const extensions = useMemo(
		() => [
			new BoldExtension(),
			new ItalicExtension(),
			new UnderlineExtension(),
			new LinkExtension(),
			new SubExtension(),
			new SupExtension(),
			new CodeExtension(),
			new HeadingExtension(),
			new CodeBlockExtension(),
			...ListExtensions.map((Extension) => new Extension()),
		],
		[],
	);

	if (loading) return <LoadingIndicator />;
	return (
		<ContentPageContext.Provider value={contentPageContext}>
			<StyledContentPage>
				<Header />
				<ContentContainer>
					<MainContainer>
						<Catalog />
						<Editor
							extensions={extensions}
							doc={editorContent}
							editable={editable}
							autoFocus={true}
							onChange={onChange}
							handleDOMEvents={handleDOMEvents}
						/>
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
