import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';
import AddNoteForm from './AddNoteForm';

const AddNoteModal = () => {
	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.AddNote));
		} else {
			dispatch(closeModal());
		}
	}, []);

	const { currentModal } = useAppSelector((state) => state.modal);
	const visible = currentModal === CurrentModal.AddNote;

	return (
		<Modal visible={visible} setVisible={setVisible} title="新增笔记">
			<AddNoteForm />
		</Modal>
	);
};

export default memo(AddNoteModal);
