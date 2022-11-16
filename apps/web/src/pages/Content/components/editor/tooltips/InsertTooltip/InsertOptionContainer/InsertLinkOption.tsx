import { memo, useCallback } from 'react';

import { useAppDispatch } from '@/app/store';
import { setInsertLinkModalVisible } from '@/app/store/modals';
import LinkIconSrc from '@/static/icon/link.png';
import { StyledOption } from '.';

const InsertLinkOption = () => {
	const dispatch = useAppDispatch();
	const handleOptionClick = useCallback(() => {
		dispatch(setInsertLinkModalVisible(true));
	}, []);

	return (
		<StyledOption onClick={handleOptionClick}>
			<img src={LinkIconSrc} alt="链接" width={24} />
			<span>插入链接</span>
		</StyledOption>
	);
};

export default memo(InsertLinkOption);
