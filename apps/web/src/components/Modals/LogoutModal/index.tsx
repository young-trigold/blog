import { useAppDispatch, useAppSelector } from '@/app/store';
import { setLogoutModalVisible } from '@/app/store/modals';
import watchedLocalStorage from '@/app/store/watchedLocalStorage';
import { Button, ButtonBar } from '@/components/Button';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import { memo, useCallback } from 'react';

interface ConfirmLogoutModalProps {}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = (props) => {
	const { visible } = useAppSelector((state) => state.modal.modals.logoutModal);
	const dispatch = useAppDispatch();

	const onConfirm = useCallback(() => {
		watchedLocalStorage.removeItem('user');
		message.success('您已退出登录');
		dispatch(setLogoutModalVisible(false));
	}, []);

	const onCancel = useCallback(() => {
		dispatch(setLogoutModalVisible(false));
	}, []);

	const setVisible = useCallback((visible: boolean) => {
		dispatch(setLogoutModalVisible(visible));
	}, []);

	return (
		<Modal title="退出登录" visible={visible} setVisible={setVisible}>
			<p style={{ textAlign: 'center' }}>您确定要退出登录吗？</p>
			<ButtonBar>
				<Button buttonType="elevated" onClick={onConfirm}>
					确定
				</Button>
				<Button onClick={onCancel}>取消</Button>
			</ButtonBar>
		</Modal>
	);
};

export default memo(ConfirmLogoutModal);
