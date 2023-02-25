import { memo, useCallback } from 'react';

import { useAppDispatch } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import AddIcon from '@/static/icon/plus.png';
import { FloatingActionButton } from '@/components/Button';

const AddNoteButton = () => {
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    dispatch(openModal(CurrentModal.AddNote));
  }, []);

  return (
    <FloatingActionButton
      rect={{ bottom: 64, right: 32 }}
      description="添加"
      icon={AddIcon}
      onClick={onClick}
    />
  );
};

export default memo(AddNoteButton);
