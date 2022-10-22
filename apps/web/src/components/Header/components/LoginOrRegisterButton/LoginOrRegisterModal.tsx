import { AppDispatch, AppState } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import Modal from '../../../Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
interface LoginOrRegisterModalProps {}

const LoginOrRegisterModal: React.FC<LoginOrRegisterModalProps> = (props) => {
	const { visible } = useSelector((state: AppState) => state.modal.modals.loginModal);
	const [logging, setLogging] = useState(true);

	const modalTitle = logging ? '登录' : '注册';

	const dispatch = useDispatch<AppDispatch>();
	const setIsLoginOrRegisterModalVisible = (visible: boolean) => {
		dispatch(setLoginModalVisible(visible));
	};

	return (
		<Modal
			title={modalTitle}
			visible={visible}
			setVisible={setIsLoginOrRegisterModalVisible}
		>
			{logging ? (
				<LoginForm
					setLogging={setLogging}
					setIsLoginOrRegisterModalVisible={setIsLoginOrRegisterModalVisible}
				/>
			) : (
				<RegisterForm setLogging={setLogging} />
			)}
		</Modal>
	);
};

export default memo(LoginOrRegisterModal);
