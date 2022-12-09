import { useEffect } from 'react';
import styled from 'styled-components';

import useDocumentTitle from '@/hooks/useDocumentTitle';

import { AppState } from '@/app/store';
import LoadingIndicator from '@/components/LodingIndicator';
import { message } from '@/components/Message';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { CommentInfo } from '../content/components/comment/CommentList';
import ArticleShow from './components/ArticleShow';
import TagContainer from './components/TagContainer';

const StyledHomePage = styled.div`
	height: 100vh;
	background-color: ${(props) => props.theme.backgroundColor};
	transition: ${(props) => props.theme.transition};
	position: relative;
`;

const StyledMainContainer = styled.main`
	overflow-y: overlay;
	height: calc(100vh - 86.5px);
`;

export interface ArticleInfo {
	_id: string;
	title: string;
	likes: number;
	views: number;
	createdAt: string;
	content: string;
	comments: CommentInfo[];
}

export interface ArticlesByTag {
	_id: string;
	articles: ArticleInfo[];
}

const HomePage = () => {
	const { loading, error, articlesByTag, tagIndex } = useSelector(
		(state: AppState) => state.homePage,
	);

	useDocumentTitle('欢迎来到前端小站');

	useEffect(() => {
		if (error) message.error(error?.message ?? '请求错误!');
	}, [error]);

	return (
		<StyledHomePage>
			<Header />
			<TagContainer tagIndex={tagIndex} tags={articlesByTag.map((tag) => tag._id)} />
			<StyledMainContainer>
				{loading ? (
					<LoadingIndicator />
				) : (
					<ArticleShow articlesByTag={articlesByTag} tagIndex={tagIndex} />
				)}
				<Footer />
			</StyledMainContainer>
		</StyledHomePage>
	);
};

export default HomePage;
