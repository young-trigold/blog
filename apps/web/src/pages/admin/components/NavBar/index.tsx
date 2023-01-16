import styled from 'styled-components';

import { NoteOption } from './NoteOption';
import { TagOption } from './TagOption';

export const NavigationBar = styled.nav`
  padding: 1em;
  min-width: 180px;
  flex: 2;
  border-right: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 500px) {
    min-width: 120px;
  }
`;

export const NavigationBarTitle = styled.h2`
  margin: 0.5em 0;
  display: flex;
  justify-content: space-between;
  padding: 6px;
  transition: ${(props) => props.theme.transition};
  user-select: none;
  font-size: 18px;
`;

export const OptionContainer = styled.ol<{ currentIndex: number }>`
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

export const Option = styled.li`
  margin-top: 0.5em;
  padding: 6px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};

  &:hover {
    color: ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.hoverColor};
  }

  &:active {
    color: ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.activeColor};
  }
`;

const NavBar: React.FC = () => {
  return (
    <NavigationBar>
      <NoteOption />
      <TagOption />
    </NavigationBar>
  );
};

export default NavBar;
