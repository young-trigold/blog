import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppState } from '@/app/store';
import Footer from '@/components/Footer';
import Header, { HeaderHeight } from '@/components/Header';
import LoadingIndicator from '@/components/LodingIndicator';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CommentInfo } from '../content/components/comment/CommentList';
import Chapter from './components/Chapter';

const StyledChapterListPage = styled.div`
	position: relative;
	height: 100vh;
	background-color: ${(props) => props.theme.backgroundColor};
	transition: ${(props) => props.theme.transition};
`;

const ChaptersContainer = styled.div`
	padding: 1em;
	padding-bottom: 2em;
	display: grid;
	grid-template-columns: repeat(auto-fill, 140px);
	grid-gap: 2em;
	justify-content: space-evenly;
`;

const StyledChapterTitle = styled.h2`
	text-align: center;
`;

const StyledContentContainer = styled.div`
	overflow-y: overlay;
	max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
`;

export interface ChapterInfo {
	_id: string;
	likes: number;
	views: number;
	title: string;
	content: string;
	comments: CommentInfo[];
}

const ChapterListPage: React.FC = () => {
	const { noteTitle } = useParams();
	const { notes } = useSelector((state: AppState) => state.notePage);
	const chapters = useMemo(() => notes.find((note) => note.title === noteTitle)?.chapters, [notes]);

	useDocumentTitle(`笔记 - ${noteTitle}`, [noteTitle]);

	return (
		<StyledChapterListPage>
			<Header />
			<StyledContentContainer>
				<main>
					<StyledChapterTitle>{noteTitle}</StyledChapterTitle>
					{chapters ? (
						<ChaptersContainer>
							{chapters.map((chapter) => (
								<Chapter key={chapter._id} chapter={chapter as ChapterInfo} />
							))}
						</ChaptersContainer>
					) : (
						<LoadingIndicator />
					)}
				</main>
				<Footer />
			</StyledContentContainer>
		</StyledChapterListPage>
	);
};

export default ChapterListPage;
