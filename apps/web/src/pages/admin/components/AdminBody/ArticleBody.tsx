import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';
import LoadingIndicator from '@/components/LodingIndicator';
import AddArticleModal from '@/components/Modals/AddArticleModal';
import { useGetArticles } from '@/hooks/articles/useGetArticles';
import AddArticleButton from '../buttons/AddArticleButton';
import DeleteArticleButton from '../buttons/DeleteArticleButton';

const StyledArticleBody = styled.main`
  flex: 8;
  overflow: auto;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export interface ArticleBodyProps {
  currentIndex: number;
}

const ArticleBody: React.FC<ArticleBodyProps> = (props) => {
  const { currentIndex } = props;
  const navigate = useNavigate();

  const updateItem = (articleId: string) => {
    navigate(`/edit/articles/${articleId}`);
  };

  const { isLoading, isError, error, data: articlesByTag } = useGetArticles();
  const tagOptions = articlesByTag?.map((tag) => tag._id);
  const articles = articlesByTag?.map((tag) => tag.articles);

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <span>{(error as Error).message}</span>;

  return (
    <StyledArticleBody>
      <table>
        <thead>
          <tr>
            <th>项目</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {articles?.[currentIndex]?.map((article) => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td>
                <ButtonBar>
                  <DeleteArticleButton articleId={article._id} />
                  <Button
                    onClick={() => updateItem(article._id)}
                    size={window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'}
                  >
                    修改
                  </Button>
                </ButtonBar>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddArticleButton />
      <AddArticleModal currentOption={tagOptions![currentIndex]} />
    </StyledArticleBody>
  );
};

export default ArticleBody;
