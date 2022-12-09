import { useAppDispatch, useAppSelector } from '@/app/store';
import { setAddArticleTagModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { useCallback } from 'react';
import AddArticleTagForm from './AddArticleTagForm';

const AddArticleTagModal = () => {
	const { visible } = useAppSelector((state) => state.modal.modals.addArticleTagModal);

	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setAddArticleTagModalVisible(visible));
	}, []);

	return (
		<Modal visible={visible} setVisible={setVisible} title="新增标签">
			<AddArticleTagForm />
		</Modal>
	);
};

export default AddArticleTagModal;
