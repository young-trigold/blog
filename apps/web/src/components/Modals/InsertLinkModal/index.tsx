import { useAppDispatch, useAppSelector } from '@/app/store';
import { setInsertLinkModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';
import InsertLinkForm from './InsertLinkForm';

const InsertLinkModal = () => {
	const { visible } = useAppSelector((state) => state.modal.modals.insertLinkModal);

	const dispatch = useAppDispatch();
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
