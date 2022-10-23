import { AppDispatch } from '@/app/store';
import { setAddArticleModalVisible } from '@/app/store/modals';
import { FloatingActionButton } from '@/components/Button';
import AddIcon from '@/static/icon/plus.png';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const AddArticleButton = () => {
	const dispatch = useDispatch<AppDispatch>();

	const onClick = useCallback(() => {
		dispatch(setAddArticleModalVisible(true));
	}, [setAddArticleModalVisible]);

	return (
		<>
			<FloatingActionButton
				rect={{ bottom: 64, right: 32 }}
				description="添加"
				icon={AddIcon}
				onClick={onClick}
			/>
		</>
	);
};

export default memo(AddArticleButton);
