import axios from 'axios';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { AppState } from '@/app/appStore';
import { ContentPageContext } from '@/app/slices/contentPage';
import { FloatingActionButton } from '@/components/Button';
import { message } from '@/components/Message';
import CancelIcon from '@/static/icon/cancel.png';
import PublishIcon from '@/static/icon/publish.png';
import dataURLtoFile from '@/utils/dataURLToFile';
import watchedLocalStorage from '@/utils/watchedLocalStorage';
import schema from '../editor/schema';

const StyledActionBar = styled.div`
  /* @media (max-width: 530px) {
    padding: 0 1em;
    justify-content: space-between;
    width: 100%;
    left: unset;
    bottom: 0;
    top: unset;
    flex-direction: row;
    position: fixed !important;
    background-color: ${(props) => props.theme.foregroundColor};
    flex-direction: row;
    box-shadow: 0px 0px 3px rgb(0 0 0 / 0.5);

    & > * {
      margin: 0 1em;
    }
  } */
`;

export interface ActionBarProps {}

const ActionBar: React.FC<ActionBarProps> = (props) => {
  const { itemID } = useParams();
  const { isChapter } = useContext(ContentPageContext);
  const { editorView } = useSelector((state: AppState) => state.contentPage.editor);
  const { hasLogin, info } = useSelector((state: AppState) => state.user);

  const handlePublish = () => {
    if (!hasLogin) return message.warn('请先登录');
    if (info?.role !== 'admin') return message.warn('权限不足');
    if (!editorView) return;
    const user = watchedLocalStorage.getItem<{ token: string }>('user');
    const updateItem = async () => {
      try {
        // 图片
        let transaction = editorView.state.tr;
        const files: File[] = [];

        editorView.state.doc.descendants((node, position) => {
          if (!(node.type === schema.nodes.image)) return;
          const { src } = node.attrs;
          if (!(src as string).includes('base64')) return;
          const filename = `${isChapter ? 0 : 1}_${itemID}_${Number(new Date())}.png`;
          const file = dataURLtoFile(src, filename);
          files.push(file);
          transaction = transaction.setNodeMarkup(position, node.type, {
            ...node.attrs,
            src: `http://${window.location.hostname}:80/upload/${filename}`,
            // src: `http://${window.location.origin}/upload/${filename}`,
          });
        });

        const newState = editorView.state.apply(transaction);
        const newContent = JSON.stringify(newState.doc.toJSON());

        const formData = new FormData();

        files.forEach((file) => {
          formData.append('files', file);
        });

        const uploadImages = axios.post('/api/upload', formData);
        const publishContent = axios.put(
          `/api/${isChapter ? 'notes' : 'articles'}/${itemID}`,
          {
            content: newContent,
          },
          {
            headers: {
              contentType: 'text/plain',
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );

        await Promise.all([uploadImages, publishContent]);
        message.success('发布成功!');
      } catch (error) {
        if (axios.isAxiosError(error))
          return message.error((error.response?.data as { message: string })?.message);
        if (error instanceof Error) return message.error(error.message);
        return message.error(JSON.stringify(error));
      }
    };

    updateItem();
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/${isChapter ? 'chapters' : 'articles'}/${itemID}`);
  };

  return (
    <StyledActionBar>
      <FloatingActionButton
        onClick={handleCancel}
        rect={{ right: 32, bottom: 230 }}
        icon={CancelIcon}
        description="取消"
      />
      <FloatingActionButton
        onClick={handlePublish}
        rect={{ right: 32, bottom: 170 }}
        icon={PublishIcon}
        description="发布"
      />
    </StyledActionBar>
  );
};

export default memo(ActionBar);
