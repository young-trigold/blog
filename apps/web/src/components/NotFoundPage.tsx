import styled from 'styled-components';

import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const StyledNotFoundPage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NotFoundPage = () => {
  useDocumentTitle('404');

  return (
    <StyledNotFoundPage>
      <h1>找不到该页面</h1>
      <Link to="/" replace>
        回到主页
      </Link>
    </StyledNotFoundPage>
  );
};

export default NotFoundPage;
