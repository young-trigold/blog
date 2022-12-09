import { useAppDispatch } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
import { memo, useCallback } from 'react';
import { Button } from '../../../Button';

const LoginButton: React.FC = () => {
	const dispatch = useAppDispatch();
	const onClick = useCallback(() => {
		dispatch(setLoginModalVisible(true));
	}, []);

	return (
		<>
			<Button buttonType="elevated" onClick={onClick}>
				登录/注册
			</Button>
		</>
	);
};

export default memo(LoginButton);
