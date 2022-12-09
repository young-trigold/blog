import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';
import InsertLinkForm from './InsertLinkForm';

const InsertLinkModal = () => {
	const { currentModal } = useAppSelector((state) => state.modal);
	const visible = currentModal === CurrentModal.InsertLink;
	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.InsertLink));
		} else {
			dispatch(closeModal());
		}
	}, []);

	return (
		<Modal visible={visible} setVisible={setVisible} title="插入链接">
			<InsertLinkForm></InsertLinkForm>
		</Modal>
	);
};

export default memo(InsertLinkModal);
