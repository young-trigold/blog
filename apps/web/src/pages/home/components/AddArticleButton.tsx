import { memo, useCallback } from 'react'

import { useAppDispatch } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import { FloatingActionButton } from '@/components/Button';
import AddIcon from '@/static/icon/plus.png';
;

export const AddArticleButton = memo(() => {
  const dispatch = useAppDispatch();

  const onClick = useCallback(() => {
    dispatch(openModal(CurrentModal.AddArticleTag));
  }, []);

  return (
    <FloatingActionButton
      bottom={64}
      right={32}
      description="添加"
      icon={AddIcon}
      onClick={onClick}
    />
  );
});
