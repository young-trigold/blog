import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import UserInfoPanel from './components/UserInfoPanel/indext';

const StyledUserPage = styled.div`
	height: 100vh;
	background-color: ${(props) => props.theme.backgroundColor};
	transition: ${(props) => props.theme.transition};
	position: relative;
`;

const UserPage = () => {
	const { userId } = useParams<'userId'>();

	return (
		<StyledUserPage>
			<Header></Header>
			<main style={{ height: '2000px' }}>
				<UserInfoPanel />
			</main>
			<Footer></Footer>
		</StyledUserPage>
	);
};

export default UserPage;
