import axios from 'axios';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';
import { message } from '@/components/Message';
import { StyledRow, StyledTable } from './StyledTable';

import getUserToken from '@/utils/getUserToken';
import { ArticleInfo } from '../../Home';
import { AddArticleButton } from './AddArticle';

const StyledArticleBody = styled.main`
  flex: 8;
  overflow: auto;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export interface ArticleBodyProps {
  currentIndex: number;
  articles: ArticleInfo[][];
  tagOptions: string[];
}

function ArticleBody(props: ArticleBodyProps) {
  const { currentIndex, articles, tagOptions } = props;
  const navigate = useNavigate();

  const deleteItem = useCallback((articleId: string) => {
    const userToken = getUserToken();

    if (!userToken) return message.warn('请先登录!');

    const deleteArticle = async () => {
      try {
        await axios.delete(`/api/articles/${articleId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        message.success('删除成功!');
        window.location.reload();
      } catch (error) {
        if (axios.isAxiosError(error))
          return message.error((error.response?.data as { message: string })?.message);
        if (error instanceof Error) return message.error(error.message);
        return message.error(JSON.stringify(error));
      }
    };

    deleteArticle();
  }, []);

  const updateItem = useCallback(
    (articleId: string) => {
      navigate(`/edit/articles/${articleId}`);
    },
    [navigate],
  );

  return (
    <StyledArticleBody>
      <StyledTable>
        <thead>
          <tr>
            <th>项目</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {articles[currentIndex]?.map((article) => (
            <StyledRow key={article._id}>
              <td>{article.title}</td>
              <td>
                <ButtonBar>
                  <Button
                    onClick={() => deleteItem(article._id)}
                    state="dange"
                    size={window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'}
                  >
                    删除
                  </Button>
                  <Button
                    onClick={() => updateItem(article._id)}
                    size={window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'}
                  >
                    修改
                  </Button>
                </ButtonBar>
              </td>
            </StyledRow>
          ))}
        </tbody>
      </StyledTable>
      <AddArticleButton currentOption={tagOptions[currentIndex]} />
    </StyledArticleBody>
  );
}

export default React.memo(ArticleBody);
