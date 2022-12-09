import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import EyeOpen from '@/static/icon/eye-open.png';
import LikeIcon from '@/static/icon/like.png';
import { ChapterInfo } from '..';

const StyledChapter = styled.article`
  position: relative;
  padding: 1em;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  border-radius: 10px;
  background-color: ${(props) => props.theme.foregroundColor};
  box-shadow: 5px 0px 15px ${(props) => props.theme.shadowColor};
  transition: ${(props) => props.theme.transition};
  user-select: none;
  transition: all 0.2s ease-out;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.hoverColor};
    background-color: ${(props) => props.theme.surfaceColor};
  }

  &:active {
    box-shadow: 3px 0px 5px ${(props) => props.theme.shadowColor};
    transform: scale(0.9);
  }
`;

const StyledInfoBar = styled.div`
  position: absolute;
  bottom: 1em;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

function Chapter(props: { chapter: ChapterInfo }) {
  const { chapter } = props;

  const navigate = useNavigate();

  const handleClick = useCallback(
    debounce(
      () => {
        navigate(`/chapters/${chapter._id}`);
      },
      200,
      { leading: true },
    ),
    [navigate, chapter, debounce],
  );

  return (
    <StyledChapter onClick={handleClick}>
      <div>{chapter.title}</div>
      <StyledInfoBar>
        <div>
          <img src={LikeIcon} alt="点赞" width="14" style={{ marginRight: '4px' }} />
          <span>{chapter.likes}</span>
        </div>
        <div>
          <img src={EyeOpen} alt="浏览" width="14" style={{ marginRight: '4px' }} />
          <span>{chapter.views}</span>
        </div>
      </StyledInfoBar>
    </StyledChapter>
  );
}

export default Chapter;
