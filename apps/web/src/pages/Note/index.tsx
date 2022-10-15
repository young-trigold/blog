import styled from 'styled-components';

import useDocumentTitle from '@/hooks/useDocumentTitle';

import Footer from '@/components/Footer';
import Header, { HeaderHeight } from '@/components/Header';
import { ChapterInfo } from '../ChapterList';
import NoteShow from './components/NoteShow';

export interface NoteInfo {
  _id: string;
  title: string;
  chapters: ChapterInfo[];
}

const StyledNotePage = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: ${(props) => props.theme.backgroundColor};
  transition: ${(props) => props.theme.transition};
  font-size: 1em;
  height: 100vh;
`;

const StyleMainContainer = styled.main`
  overflow-y: overlay;
  max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
`;

const NotePage = () => {
  useDocumentTitle('我的笔记');

  return (
    <StyledNotePage>
      <Header />
      <StyleMainContainer>
        <NoteShow />
        <Footer />
      </StyleMainContainer>
    </StyledNotePage>
  );
};

export default NotePage;
