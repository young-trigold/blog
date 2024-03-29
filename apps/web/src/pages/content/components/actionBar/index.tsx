import axios from 'axios';
import { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import { ContentPageContext } from '@/app/store/pages/contentPage';
import watchedLocalStorage from '@/app/store/watchedLocalStorage';
import { FloatingActionButton } from '@/components/Button';
import { message } from '@/components/Message';
import CancelIcon from '@/static/icon/cancel.png';
import PublishIcon from '@/static/icon/publish.png';
import { queryClient } from '../../../../App';

export const ActionBar: React.FC = memo(() => {
  const { itemId } = useParams();
  const { isChapter } = useContext(ContentPageContext);
  const { state } = useAppSelector((state) => state.contentPage.editor);
  const { hasLogin, info } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const handlePublish = async () => {
    if (!hasLogin) {
      dispatch(openModal(CurrentModal.Login));
      message.warn('请先登录!');
      return;
    }
    if (info?.role !== 'admin') {
      dispatch(openModal(CurrentModal.Login));
      message.warn('权限不足, 请重新登录!');
      return;
    }
    if (!state) return;
    const user = watchedLocalStorage.getItem<{ token: string }>('user');

    try {
      await axios.put(
        `/api/${isChapter ? 'notes' : 'articles'}/${itemId}`,
        {
          content: JSON.stringify(state.doc.toJSON()),
        },
        {
          headers: {
            contentType: 'text/plain',
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      await queryClient.refetchQueries({
        queryKey: [itemId, isChapter],
      });
      message.success('发布成功!');
    } catch (error) {
      if (axios.isAxiosError(error))
        return message.error((error.response?.data as { message: string })?.message);
      if (error instanceof Error) return message.error(error.message);
      return message.error(JSON.stringify(error));
    }
  };

  const navigate = useNavigate();
  const handleCancel = useCallback(() => {
    navigate(`/${isChapter ? 'chapters' : 'articles'}/${itemId}`);
  }, [isChapter, itemId]);

  return (
    <aside>
      <FloatingActionButton
        onClick={handleCancel}
        right={32}
        bottom={230}
        icon={CancelIcon}
        description="取消"
      />
      <FloatingActionButton
        onClick={handlePublish}
        right={32}
        bottom={170}
        icon={PublishIcon}
        description="发布"
      />
    </aside>
  );
});
