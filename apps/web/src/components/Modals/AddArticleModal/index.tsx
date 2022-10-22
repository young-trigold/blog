import axios from 'axios';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AppDispatch, AppState } from '@/app/store';
import { setAddArticleModalVisible } from '@/app/store/modals';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import AddArticleForm from './AddArticleForm';

interface AddArticleModalProps {
	currentOption: string;
}

const AddArticleModal: React.FC<AddArticleModalProps> = (props) => {
	const { currentOption } = props;
	const dispatch = useDispatch<AppDispatch>();
	const setVisible = useCallback(
		(visible: boolean) => {
			dispatch(setAddArticleModalVisible(visible));
		},
		[setAddArticleModalVisible],
	);
	const { visible } = useSelector((state: AppState) => state.modal.modals.addArticleModal);

	return <Modal title="新增文章" visible={visible} setVisible={setVisible}>
		<AddArticleForm currentOption={currentOption} />
	</Modal>;
};

export default memo(AddArticleModal);
