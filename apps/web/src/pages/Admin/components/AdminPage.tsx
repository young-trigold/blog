import { useEffect } from 'react';
import styled from 'styled-components';

import { AppState } from '@/app/store';
import { message } from '@/components/Message';
import { useSelector } from 'react-redux';
import { NoteInfo } from 'src/pages/notes';
import AdminBody from './AdminBody';
import NavBar from './NavBar';

const StyledAdminPage = styled.div`
	height: 100vh;
	position: relative;
	display: flex;
	background-color: ${(props) => props.theme.backgroundColor};
`;

export type NoteOption = Pick<NoteInfo, '_id' | 'title'>;

const AdminPage = () => {
	const { error } = useSelector((state: AppState) => state.homePage);

	useEffect(() => {
		if (error) message.error(error?.message ?? '请求错误!');
	}, [error]);

	return (
		<StyledAdminPage>
			<NavBar />
			<AdminBody />
		</StyledAdminPage>
	);
};

export default AdminPage;
