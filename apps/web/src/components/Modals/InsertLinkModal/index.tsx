import { AppDispatch, AppState } from '@/app/store';
import { setInsertLinkModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InsertLinkForm from './InsertLinkForm';

const InsertLinkModal = () => {
	const { visible } = useSelector((state: AppState) => state.modal.modals.insertLinkModal);

	const dispatch = useDispatch<AppDispatch>();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setInsertLinkModalVisible(visible));
	}, []);

	return (
		<Modal visible={visible} setVisible={setVisible} title="插入链接">
			<InsertLinkForm></InsertLinkForm>
		</Modal>
	);
};

export default memo(InsertLinkModal);
