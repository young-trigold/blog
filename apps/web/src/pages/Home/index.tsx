import { useState } from 'react';
import styled from 'styled-components';

import useDocumentTitle from '@/hooks/useDocumentTitle';
import useLoadResource from '@/hooks/useLoadResource';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingIndicator from '@/components/LoadingIndicator';
import { CommentInfo } from '../Content/components/comment/CommentList';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const { resource: articlesByTag } = useLoadResource<ArticlesByTag[]>('/api/articles');

  useDocumentTitle('欢迎来到前端小站');

  return (
    <StyledHomePage>
      <Header />
      <TagContainer
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        tags={articlesByTag?.map((articleTag) => articleTag._id)}
      />
      <StyledMainContainer>
        {articlesByTag ? (
          <ArticleShow articlesByTag={articlesByTag} currentIndex={currentIndex} />
        ) : (
          <LoadingIndicator />
        )}
        <Footer />
      </StyledMainContainer>
    </StyledHomePage>
  );
};

export default HomePage;
