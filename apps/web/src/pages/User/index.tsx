import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StickyTop from '@/components/Sticky';
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
        <StickyTop top={100}>
          <div style={{ width: '300px', height: '300px', backgroundColor: 'green' }}></div>
        </StickyTop>

        <div style={{ width: '300px', height: '300px', backgroundColor: 'blue' }}></div>
      </main>
      <Footer></Footer>
    </StyledUserPage>
  );
};

export default UserPage;
