import { AppDispatch, AppState } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../../../components/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
interface LoginModalProps {}

const LoginModal: React.FC<LoginModalProps> = (props) => {
	const { visible } = useSelector((state: AppState) => state.modal.modals.loginModal);
	const [logging, setLogging] = useState(true);

	const modalTitle = logging ? '登录' : '注册';

	const dispatch = useDispatch<AppDispatch>();
	const setIsLoginModalVisible = (visible: boolean) => {
		dispatch(setLoginModalVisible(visible));
	};

	return (
		<Modal title={modalTitle} visible={visible} setVisible={setIsLoginModalVisible}>
			{logging ? (
				<LoginForm setLogging={setLogging} setIsLoginModalVisible={setIsLoginModalVisible} />
			) : (
				<RegisterForm setLogging={setLogging} />
			)}
		</Modal>
	);
};

export default memo(LoginModal);
