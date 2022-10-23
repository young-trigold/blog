import { Navigate } from 'react-router-dom';

import { AppDispatch, AppState } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminPage from './components/AdminPage';

const ProtectPage: React.FC = () => {
	useDocumentTitle('博客后台');
	const { hasLogin, info } = useSelector((state: AppState) => state.user);

	const dispatch = useDispatch<AppDispatch>();
  
	useEffect(() => {
		if (hasLogin) {
			if (info?.role !== 'admin') {
				dispatch(setLoginModalVisible(true));
				message.warn('权限不足，请重新登录!');
			}
		} else {
			dispatch(setLoginModalVisible(true));
			message.warn('请先登录');
		}
	}, []);

	if (hasLogin && info?.role === 'admin') return <AdminPage />;
	return <Navigate to="/articles" />;
};

export default ProtectPage;
