import { AppDispatch } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../../../Button';

import LoginOrRegisterModal from '../../../Modals/LoginModal';

const LoginButton: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const onClick = useCallback(() => {
		dispatch(setLoginModalVisible(true));
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

export default memo(LoginButton);
