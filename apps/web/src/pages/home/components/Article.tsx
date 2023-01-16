import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import EyeOpen from '@/static/icon/eye-open.png';
import LikeIcon from '@/static/icon/like.png';
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

  &:hover {
    box-shadow: 0 0 15px ${(props) => props.theme.shadowColor};
    transform: translateY(-1em);
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

interface ArticleProps {
  article: ArticleInfo;
}

const Article = (props: ArticleProps) => {
  const { article } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/articles/${article._id}`);
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
    </StyledArticle>
  );
};

export default Article;
