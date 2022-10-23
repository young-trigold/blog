import React, { memo, useCallback } from 'react';

import { AppDispatch, AppState } from '@/app/store';
import { setAddChapterModalVisible } from '@/app/store/modals';
import Modal from '@/components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { NoteOption } from 'src/pages/admin/components/AdminPage';
import AddChapterForm from './AddChapterForm';

export interface AddChapterModalProps {
	currentOption: NoteOption;
}

const AddChapterModal: React.FC<AddChapterModalProps> = (props) => {
	const { currentOption } = props;
	const { visible } = useSelector((state: AppState) => state.modal.modals.addChapterModal);
	const dispatch = useDispatch<AppDispatch>();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setAddChapterModalVisible(visible));
	}, []);

	return (
		<Modal title="新增章节" visible={visible} setVisible={setVisible}>
			<AddChapterForm currentOption={currentOption} />
		</Modal>
	);
};

export default memo(AddChapterModal);
