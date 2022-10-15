import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledButtonBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const ButtonBar: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return <StyledButtonBar>{children}</StyledButtonBar>;
};

export default ButtonBar;
