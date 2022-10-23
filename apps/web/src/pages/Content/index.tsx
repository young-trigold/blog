import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppDispatch, AppState } from '@/app/store';
import {
	ContentPageContext,
	fetchContentPageDataByID,
	setCurrentHeadingID,
} from '@/app/store/contentPage';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingIndicator from '@/components/LodingIndicator';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import ActionBar from './components/ActionBar';
import { Catalog, CatalogButton } from './components/catalog';
import CommentList from './components/comment/CommentList';
import ContentContainer from './components/ContentContainer';
import Editor from './components/editor';
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

export interface ContentPageProps {
	isChapter: boolean;
	editable: boolean;
}

const ContentPage: React.FC<ContentPageProps> = (props) => {
	const { isChapter, editable } = props;

	const { itemID } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchContentPageDataByID({ itemID, isChapter }));
	}, [itemID, isChapter]);

	const { loading, editor, error, catalog, title } = useSelector(
		(state: AppState) => state.contentPage,
	);
	useDocumentTitle(`${isChapter ? '章节' : '文章'} - ${title}`, [title]);
	const { content } = editor;
	const { currentHeadingID } = catalog;

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
		if (!currentHeadingID) return;
		setCurrentHeadingIDSearchParam({ currentHeadingID }, { replace: true });
	}, [currentHeadingID]);
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
						<Editor content={content} editable={editable} />
						<CommentList />
						{editable ? <ActionBar /> : null}
						<CatalogButton />
					</MainContainer>
					<Footer />
				</ContentContainer>
			</StyledContentPage>
		</ContentPageContext.Provider>
	);
};

export default ContentPage;
