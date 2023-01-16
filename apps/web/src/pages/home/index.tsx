import styled from 'styled-components';

import useDocumentTitle from '@/hooks/useDocumentTitle';

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
  useDocumentTitle('欢迎来到前端小站');

  return (
    <StyledHomePage>
      <Header />
      <TagContainer />
      <StyledMainContainer>
        <ArticleShow />
        <Footer />
      </StyledMainContainer>
    </StyledHomePage>
  );
};

export default HomePage;
