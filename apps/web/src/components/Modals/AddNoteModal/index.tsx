import { AppDispatch, AppState } from '@/app/store';
import { setAddNoteModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddNoteForm from './AddNoteForm';

const AddNoteModal = () => {
	const { visible } = useSelector((state: AppState) => state.modal.modals.addNoteModal);

	const dispatch = useDispatch<AppDispatch>();
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
