import React, { useCallback } from 'react';

import { FloatingActionButton } from '@/components/Button';

import { useAppDispatch } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import AddIcon from '@/static/icon/plus.png';

const AddChapterButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(openModal(CurrentModal.AddChapter));
  }, []);

  return (
    <>
      <FloatingActionButton
        rect={{ bottom: 64, right: 32 }}
        icon={AddIcon}
        description="添加"
        onClick={handleClick}
      />
    </>
  );
};

export default AddChapterButton;
