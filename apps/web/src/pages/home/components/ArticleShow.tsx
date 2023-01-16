import { AppState } from '@/app/store';
import LoadingIndicator from '@/components/LodingIndicator';
import { useGetArticles } from '@/hooks/articles/useGetArticles';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Article from './Article';

const StyledArticleShow = styled.section`
  padding: 2em 1em;
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 2em;
  justify-content: space-evenly;

  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, 140px);
    grid-gap: 2em 1em;
  }
`;

const StyledArticleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArticleShow: React.FC = () => {
  const { tagIndex } = useSelector((state: AppState) => state.homePage);
  const { isLoading, isError, error, data: articlesByTag } = useGetArticles();

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledArticleShow>
      {articlesByTag?.[tagIndex]?.articles?.map((article) => (
        <StyledArticleContainer key={article._id}>
          <Article article={article} />
        </StyledArticleContainer>
      ))}
    </StyledArticleShow>
  );
};

export default ArticleShow;
