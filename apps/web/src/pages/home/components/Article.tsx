import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppSelector } from '@/app/store';
import { message } from '@/components/Message';
import DeleteIcon from '@/static/icon/cancel.png';
import EyeOpen from '@/static/icon/eye-open.png';
import LikeIcon from '@/static/icon/like.png';
import getUserToken from '@/utils/getUserToken';
import axios from 'axios';
import { ArticleInfo } from '..';

const StyledArticle = styled.article`
  display: flex;
  padding: 1em;
  flex-direction: column;
  align-items: center;
  width: 160px;
  height: 230px;
  background: ${(props) => props.theme.foregroundColor};
  border-radius: 10px;
  transition: ${(props) => props.theme.transition};
  position: relative;
  user-select: none;
  box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 15px ${(props) => props.theme.shadowColor};
    transform: scale(1.05);
  }

  @media (max-width: 400px) {
    width: 140px;
    height: 200px;
  }
`;

const StyledArticleTitle = styled.h3`
  font-size: 1em;
  text-align: center;
  margin: 0;
`;

const StyledArticleBar = styled.div`
  min-height: 3px;
  width: 0;
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.hoverColor},
    ${(props) => props.theme.primaryColor}
  );
  transition: ${(props) => props.theme.transition};

  ${StyledArticle}:hover & {
    width: 100%;
  }
`;

const StyledInfoBar = styled.div`
  position: absolute;
  top: 30%;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledTime = styled.time`
  position: absolute;
  right: 1em;
  bottom: 3em;
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  top: -0;
  right: 0;
  width: 20px;
  height: 20px;
  padding: 2px;
  margin: 0;
  border: none;
  border-radius: 50%;
  background-color: ${(props) => props.theme.dangeColor};
  background-image: ${() => `url(${DeleteIcon})`};
  background-size: cover;
  cursor: pointer;
  transform: translate(50%, -50%);
  z-index: 1;
  transition: ${(props) => props.theme.transition};

  &:active {
    transform: translate(50%, -50%) scale(0.9);
  }
`;

interface ArticleProps {
  article: ArticleInfo;
}

const Article = (props: ArticleProps) => {
  const { article } = props;
  const navigate = useNavigate();

  const handleDelete: React.MouseEventHandler = async (event) => {
    event.stopPropagation();
    const userToken = getUserToken();
    if (!userToken) return message.warn('请先登录!');
    const { _id: articleId } = article;
    try {
      await axios.delete(`/api/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      message.success('删除成功!');
    } catch (error) {
      if (axios.isAxiosError(error))
        return message.error((error.response?.data as { message: string })?.message);
      if (error instanceof Error) return message.error(error.message);
      return message.error(JSON.stringify(error));
    }
  };

  const { info } = useAppSelector((state) => state.user);

  const handleClick = () => {
    navigate(`${info?.role === 'admin' ? '/edit' : ''}/articles/${article._id}`);
  };

  return (
    <StyledArticle onClick={handleClick}>
      <StyledArticleTitle>
        {article.title}
        <StyledArticleBar />
      </StyledArticleTitle>

      <StyledInfoBar>
        <div>
          <img src={LikeIcon} alt="点赞" width="14" style={{ marginRight: '4px' }} />
          <span>{article.likes}</span>
        </div>
        <div>
          <img src={EyeOpen} alt="浏览" width="14" style={{ marginRight: '4px' }} />
          <span>{article.views}</span>
        </div>
      </StyledInfoBar>

      <StyledTime dateTime={new Date(article.createdAt).toLocaleDateString()}>
        {new Date(article.createdAt).toLocaleDateString()}
      </StyledTime>
      {info?.role === 'admin' && <StyledDeleteButton onClick={handleDelete} />}
    </StyledArticle>
  );
};

export default Article;
