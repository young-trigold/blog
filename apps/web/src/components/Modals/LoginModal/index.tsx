import { useAppDispatch, useAppSelector } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import { memo, useCallback, useState } from 'react';

import Modal from '../../Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface LoginModalProps {}

const LoginModal: React.FC<LoginModalProps> = (props) => {
	const [logging, setLogging] = useState(true);

	const modalTitle = logging ? '登录' : '注册';

	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.Login));
		} else {
			dispatch(closeModal());
		}
	}, []);

	const { currentModal } = useAppSelector((state) => state.modal);
	const visible = currentModal === CurrentModal.Login;

	return (
		<Modal title={modalTitle} visible={visible} setVisible={setVisible}>
			{logging ? (
				<LoginForm setLogging={setLogging} setIsLoginModalVisible={setVisible} />
			) : (
				<RegisterForm setLogging={setLogging} />
			)}
		</Modal>
	);
};

export default memo(LoginModal);
