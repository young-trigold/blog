import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useAppSelector } from '@/app/store';
import Footer from '@/components/Footer';
import Header, { HeaderHeight } from '@/components/Header';
import LoadingIndicator from '@/components/LodingIndicator';
import AddChapterModal from '@/components/Modals/AddChapterModal';
import { useGetNotes } from '@/hooks/notes/useGetNotes';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { CommentInfo } from '../content/components/comment/CommentList';
import { AddChapterButton } from './components/AddChapterButton';
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
  useDocumentTitle(`笔记 - ${noteTitle}`, [noteTitle]);

  const { isLoading, isError, error, data: notes } = useGetNotes();
  const chapters = notes?.find((note) => note.title === noteTitle)?.chapters;
  const { info } = useAppSelector((state) => state.user);
  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledChapterListPage>
      <Header />
      <StyledContentContainer>
        <main>
          <StyledChapterTitle>{noteTitle}</StyledChapterTitle>
          {chapters ? (
            <ChaptersContainer>
              {chapters.map((chapter) => (
                <Chapter
                  key={chapter._id}
                  noteId={notes?.find((note) => note.title === noteTitle)!._id}
                  chapter={chapter as ChapterInfo}
                />
              ))}
            </ChaptersContainer>
          ) : (
            <LoadingIndicator />
          )}
        </main>
        <Footer />
      </StyledContentContainer>
      {info?.role === 'admin' && (
        <>
          <AddChapterButton />
          <AddChapterModal currentOption={notes?.find((note) => note.title === noteTitle)!} />
        </>
      )}
    </StyledChapterListPage>
  );
};

export default ChapterListPage;
