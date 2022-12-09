import { useAppDispatch } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import { memo, useCallback } from 'react';
import { Button } from '../../../Button';

const LoginButton: React.FC = () => {
	const dispatch = useAppDispatch();
	const onClick = useCallback(() => {
		dispatch(openModal(CurrentModal.Login));
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
