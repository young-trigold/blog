import { memo, useCallback } from 'react';

import { AppDispatch } from '@/app/store';
import { setInsertLinkModalVisible } from '@/app/store/modals';
import LinkIconSrc from '@/static/icon/link.png';
import { useDispatch } from 'react-redux';
import InsertLinkModal from 'src/pages/components/Modals/InsertLinkModal';
import { StyledOption } from '.';

const InsertLinkOption = () => {
	const dispatch = useDispatch<AppDispatch>();
	const handleOptionClick = useCallback(() => {
		dispatch(setInsertLinkModalVisible(true));
	}, []);

	return (
		<>
			<StyledOption onClick={handleOptionClick}>
				<img src={LinkIconSrc} alt="链接" width={24} />
				<span>插入链接</span>
			</StyledOption>
			<InsertLinkModal />
		</>
	);
};

export default memo(InsertLinkOption);
