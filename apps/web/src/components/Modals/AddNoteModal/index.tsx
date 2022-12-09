import { useAppDispatch, useAppSelector } from '@/app/store';
import { setAddNoteModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';
import AddNoteForm from './AddNoteForm';

const AddNoteModal = () => {
	const { visible } = useAppSelector((state) => state.modal.modals.addNoteModal);

	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setAddNoteModalVisible(visible));
	}, []);

	return (
		<Modal visible={visible} setVisible={setVisible} title="新增笔记">
			<AddNoteForm />
		</Modal>
	);
};

export default memo(AddNoteModal);
