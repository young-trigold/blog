import React, { useCallback, useState } from 'react';

import { FloatingActionButton } from '@/components/Button';

import CancelIcon from '@/static/icon/cancel.png';
import AddIcon from '@/static/icon/plus.png';
import { NoteOption } from './AdminPage';

export interface AddButtonProps {
	currentOption: NoteOption;
}

const AddChapterButton = React.memo((props: AddButtonProps) => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleClick = useCallback(() => {
		setIsModalVisible(!isModalVisible);
	}, [setIsModalVisible, isModalVisible]);

	return (
		<>
			<FloatingActionButton
				rect={{ bottom: 64, right: 32 }}
				icon={isModalVisible ? CancelIcon : AddIcon}
				description="添加"
				onClick={handleClick}
			/>
		</>
	);
});

export default AddChapterButton;
