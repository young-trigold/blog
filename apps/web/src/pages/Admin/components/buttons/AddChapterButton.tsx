import React, { memo, useCallback } from 'react';

import { FloatingActionButton } from '@/components/Button';

import { AppDispatch } from '@/app/store';
import { setAddChapterModalVisible } from '@/app/store/modals';
import AddIcon from '@/static/icon/plus.png';
import { useDispatch } from 'react-redux';
import { NoteOption } from '../AdminPage';

interface AddButtonProps {
	currentOption: NoteOption;
}

const AddChapterButton: React.FC<AddButtonProps> = (props) => {
	const dispatch = useDispatch<AppDispatch>();
	const handleClick = useCallback(() => {
		dispatch(setAddChapterModalVisible(true));
	}, []);

	return (
		<>
			<FloatingActionButton
				rect={{ bottom: 64, right: 32 }}
				icon={AddIcon}
				description="添加"
				onClick={handleClick}
			/>
		</>
	);
};

export default memo(
	AddChapterButton,
	(pre, cur) => pre.currentOption._id === cur.currentOption._id,
);
