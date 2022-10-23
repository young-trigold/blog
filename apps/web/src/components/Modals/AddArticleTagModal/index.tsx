import { AppDispatch, AppState } from '@/app/store';
import { setAddArticleTagModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddArticleTagForm from './AddArticleTagForm';

const AddArticleTagModal = () => {
	const { visible } = useSelector((state: AppState) => state.modal.modals.addArticleTagModal);

	const dispatch = useDispatch<AppDispatch>();
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
