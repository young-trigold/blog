import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { useCallback } from 'react';
import AddArticleTagForm from './AddArticleTagForm';

const AddArticleTagModal = () => {
	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.AddArticleTag));
		} else {
			dispatch(closeModal());
		}
	}, []);

	const { currentModal } = useAppSelector((state) => state.modal);
	const visible = currentModal === CurrentModal.AddArticleTag;

	return (
		<Modal visible={visible} setVisible={setVisible} title="新增标签">
			<AddArticleTagForm />
		</Modal>
	);
};

export default AddArticleTagModal;
