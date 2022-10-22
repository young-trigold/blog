import { AppDispatch, AppState } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from '../../../Button';

import LoginOrRegisterModal from './LoginOrRegisterModal';

const LoginOrRegisterButton: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const onClick = useCallback(() => {
		dispatch(setLoginModalVisible(true))
	}, []);

	return (
		<>
			<Button buttonType="outlined" onClick={onClick}>
				登录/注册
			</Button>
			<LoginOrRegisterModal />
		</>
	);
};

export default memo(LoginOrRegisterButton);
