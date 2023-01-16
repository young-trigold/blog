import styled from 'styled-components';

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
  return (
    <StyledAdminPage>
      <NavBar />
      <AdminBody />
    </StyledAdminPage>
  );
};

export default AdminPage;
