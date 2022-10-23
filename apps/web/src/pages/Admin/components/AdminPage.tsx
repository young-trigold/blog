import { useEffect } from 'react';
import styled from 'styled-components';

import { AppState } from '@/app/store';
import { message } from '@/components/Message';
import { useSelector } from 'react-redux';
import AdminBody from './AdminBody';
import NavBar from './NavBar';

const StyledAdminPage = styled.div`
	height: 100vh;
	position: relative;
	display: flex;
	background-color: ${(props) => props.theme.backgroundColor};
`;

const NavigationBar = styled.nav`
	padding: 1em;
	min-width: 180px;
	flex: 2;
	border-right: 1px solid ${(props) => props.theme.borderColor};

	@media (max-width: 500px) {
		min-width: 120px;
	}
`;

const NavigationBarTitle = styled.h2`
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
	padding: 6px;
	transition: ${(props) => props.theme.transition};
	user-select: none;
	font-size: 18px;
`;

const OptionContainer = styled.ol<{ currentIndex: number }>`
	user-select: none;
	padding-left: 0;
	margin-left: 2em;
	list-style: none;
	overflow-y: hidden;
	color: ${(props) => props.theme.textColor};
	background-color: ${(props) => props.theme.foregroundColor};

	& > li:nth-of-type(${(props) => props.currentIndex + 1}) {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.activeColor};
	}

	@media (max-width: 500px) {
		margin-left: 0;
	}
`;

export interface NoteOption {
	_id: string;
	title: string;
}

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
