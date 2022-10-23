import { Navigate } from 'react-router-dom';

import { AppDispatch, AppState } from '@/app/store';
import { UserInfo } from '@/app/store/user';
import { message } from '@/components/Message';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useSelector } from 'react-redux';
import AdminPage from './components/AdminPage';
import { useDispatch } from 'react-redux';
import { setLoginModalVisible } from '@/app/store/modals';

const ProtectPage: React.FC = () => {
	useDocumentTitle('博客后台');
	const user = useSelector((state: AppState) => state.user);
	const { hasLogin, info } = user;

  const dispatch = useDispatch<AppDispatch>();

	if (hasLogin) {
		if ((info as UserInfo).role === 'admin') return <AdminPage />;
		else {
      dispatch(setLoginModalVisible(true));
			message.warn('权限不足，请重新登录!');
			return <Navigate to="/" />;
		}
	} else {
    dispatch(setLoginModalVisible(true));
		message.warn('请先登录');
		return <Navigate to="/" />;
	}
};

export default ProtectPage;
