import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppSelector } from '@/app/store';
import { message } from '@/components/Message';
import DeleteIcon from '@/static/icon/cancel.png';
import EyeOpen from '@/static/icon/eye-open.png';
import LikeIcon from '@/static/icon/like.png';
import getUserToken from '@/utils/getUserToken';
import axios from 'axios';
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
  }
`;

const StyledInfoBar = styled.div`
  position: absolute;
  bottom: 1em;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  top: 0;
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

interface ChapterProps {
  chapter: ChapterInfo;
  noteId: string;
}

const Chapter: React.FC<ChapterProps> = (props) => {
  const { chapter, noteId } = props;
  const navigate = useNavigate();

  const handleClick: React.MouseEventHandler = async (event) => {
    navigate(`/chapters/${chapter._id}`);
  };

  const handleDelete: React.MouseEventHandler = async (event) => {
    event.stopPropagation();
    const userToken = getUserToken();
    if (!userToken) return message.warn('请先登录!');
    try {
      await axios.delete(`/api/notes/${noteId}/${chapter._id}`, {
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

      {info?.role === 'admin' && <StyledDeleteButton onClick={handleDelete} />}
    </StyledChapter>
  );
};

export default Chapter;
