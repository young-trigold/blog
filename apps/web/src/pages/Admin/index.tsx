import { Navigate } from 'react-router-dom';

import { AppState } from '@/app/store';
import { UserInfo } from '@/app/store/user';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useSelector } from 'react-redux';
import AdminPage from './components/AdminPage';

const ProtectPage: React.FC = () => {
	useDocumentTitle('博客后台');
	const user = useSelector((state: AppState) => state.user);
	const { hasLogin, info } = user;

	if (hasLogin) {
		if ((info as UserInfo).role === 'admin') return <AdminPage />;
		message.warn('权限不足');
	} else {
		message.warn('请先登录');
	}

	return <Navigate to="/" replace />;
};

export default ProtectPage;
