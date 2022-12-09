import React, { memo, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import Modal from '@/components/Modal';
import AddArticleForm from './AddArticleForm';

interface AddArticleModalProps {
	currentOption: string;
}

const AddArticleModal: React.FC<AddArticleModalProps> = (props) => {
	const { currentOption } = props;
	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.AddArticle));
		} else {
			dispatch(closeModal());
		}
	}, []);
	const { currentModal } = useAppSelector((state) => state.modal);
	const visible = currentModal === CurrentModal.AddArticle;
	
	return (
		<Modal title="新增文章" visible={visible} setVisible={setVisible}>
			<AddArticleForm currentOption={currentOption} />
		</Modal>
	);
};

export default memo(AddArticleModal);
