import { AppState } from '@/app/appStore';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import InsertLinkOption from './InsertLinkOption';
import InsertPictureOption from './InsertPictureOption';

interface StyledInsertOptionContainerProps {
  position: Partial<DOMRect>;
}

const StyledInsertOptionContainer = styled.div<StyledInsertOptionContainerProps>`
  position: absolute;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 6.4px;
  box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
  background-color: ${(props) => props.theme.foregroundColor};
  top: ${(props) => `${props.position.bottom}px`};
  left: ${(props) => `${props.position.left}px`};
  width: 150px;
  transition: ${(props) => props.theme.transition};
  user-select: none;
`;

export const StyledOption = styled.div`
  display: flex;
  padding: 0.5em;
  border-radius: 6.4px;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;

  & > * {
    margin-right: 1em;
  }

  &:hover {
    color: ${(props) => props.theme.hoverColor};
    background-color: ${(props) => props.theme.surfaceColor};
  }

  &:active {
    color: ${(props) => props.theme.activeColor};
    background-color: ${(props) => props.theme.surfaceColor};
  }
`;

interface InsertOptionContainerProps {}

const InsertOptionContainer = (props: InsertOptionContainerProps) => {
  const { canInsertBlock, position } = useSelector(
    (state: AppState) => state.contentPage.editor.plugin.insertTooltip,
  );

  const onClick: React.MouseEventHandler = (event) => {
    event.stopPropagation();
  };

  return (
    <StyledInsertOptionContainer
      onClick={onClick}
      position={position}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      <InsertLinkOption />
      {canInsertBlock && <InsertPictureOption />}
    </StyledInsertOptionContainer>
  );
};

export default InsertOptionContainer;
