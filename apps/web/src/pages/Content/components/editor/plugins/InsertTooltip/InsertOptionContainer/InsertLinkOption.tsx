/* eslint-disable jsx-a11y/tabindex-no-positive */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppDispatch, AppState } from '@/app/store';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import LinkIconSrc from '@/static/icon/link.png';
import { StyledOption } from '.';
import InsertLinkModal from '@/components/Modals/InsertLinkModal';
import { useDispatch } from 'react-redux';
import { setInsertLinkModalVisible } from '@/app/store/modals';

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
