import { Navigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { CurrentModal, openModal } from '@/app/store/modals';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useEffect } from 'react';
import AdminPage from './components/AdminPage';

const ProtectPage: React.FC = () => {
	useDocumentTitle('博客后台');
	const { hasLogin, info } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (hasLogin) {
			if (info?.role !== 'admin') {
				dispatch(openModal(CurrentModal.Login));
				message.warn('权限不足，请重新登录!');
			}
		} else {
			dispatch(openModal(CurrentModal.Login));
			message.warn('请先登录');
		}
	}, []);

	if (hasLogin && info?.role === 'admin') return <AdminPage />;
	return <Navigate to="/articles" />;
};

export default ProtectPage;
