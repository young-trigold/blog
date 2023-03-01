import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Nav: React.FC = () => {
  return (
    <NavContainer>
      <Link to="/articles">首页</Link>
      <div style={{ width: '1em', height: '0.5em' }} />
      <Link to="/notes">前端笔记</Link>
      <div style={{ width: '1em', height: '0.5em' }} />
      <Link to="/utils/calculator">计算器</Link>
    </NavContainer>
  );
};

export default memo(Nav);
