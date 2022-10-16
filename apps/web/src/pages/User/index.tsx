import Footer from '@/components/Footer';
import Header, { HeaderHeight } from '@/components/Header';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import UserInfoPanel from './components/UserInfoPanel/indext';

const StyledUserPage = styled.div`
	max-height: 100vh;
	background-color: ${(props) => props.theme.backgroundColor};
	transition: ${(props) => props.theme.transition};
	position: relative;
	overflow-x: hidden;
`;

const StyledContentContainer = styled.div`
	overflow-y: overlay;
	max-height: ${() => `calc(100vh - ${HeaderHeight}px)`};
`;

const UserPage = () => {
	const { userId } = useParams<'userId'>();

	return (
		<StyledUserPage>
			<Header />
			<StyledContentContainer>
        <UserInfoPanel />
				<Footer />
			</StyledContentContainer>
		</StyledUserPage>
	);
};

export default UserPage;
