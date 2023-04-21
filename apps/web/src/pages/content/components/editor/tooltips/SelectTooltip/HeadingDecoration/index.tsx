import { useAppSelector } from '@/app/store';
import styled from 'styled-components';

const StyledHeadingOptionContainer = styled.div`
  position: absolute;
  top: 100%;
  left: -50%;
  white-space: nowrap;
  background-color: ${(props) => props.theme.foregroundColor};
  border-radius: 6.4px;
  transition: ${(props) => props.theme.transition};
  user-select: none;
  font-size: 16px;
  border: 1px solid ${(props) => props.theme.borderColor};
  padding: 1px;
  transform-origin: 0 0;
  opacity: 0;
  pointer-events: none;
  transform: scale(1, 0);
`;

const StyledHeadingOption = styled.div`
  padding: 2px 4px;
  transition: ${(props) => props.theme.transition};
  border-radius: 6.4px;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.hoverColor};
  }

  :active {
    color: ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.activeColor};
  }
`;

const StyledHeadingDecoration = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  font-size: 20px;
  border-radius: 6.4px;
  transition: ${(props) => props.theme.transition};
  font-family: 'Times New Roman';

  &:hover {
    & ${StyledHeadingOptionContainer} {
      opacity: unset;
      pointer-events: unset;
      transform: unset;
    }
  }
`;

export const HeadingDecoration = () => {
  const commands = useAppSelector((appState) => appState.contentPage.editor.editorStore?.commands);

  const toggleHeadingLevel1 = () => {
    if (!commands) return;
    commands.heading.toggle(1);
  };

  const toggleHeadingLevel2 = () => {
    if (!commands) return;
    commands.heading.toggle(2);
  };

  const toggleHeadingLevel3 = () => {
    if (!commands) return;
    commands.heading.toggle(3);
  };

  return (
    <StyledHeadingDecoration>
      <span>H</span>
      <StyledHeadingOptionContainer>
        <StyledHeadingOption onClick={toggleHeadingLevel1}>
          <span>1 级标题</span>
        </StyledHeadingOption>
        <StyledHeadingOption onClick={toggleHeadingLevel2}>
          <span>2 级标题</span>
        </StyledHeadingOption>
        <StyledHeadingOption onClick={toggleHeadingLevel3}>
          <span>3 级标题</span>
        </StyledHeadingOption>
      </StyledHeadingOptionContainer>
    </StyledHeadingDecoration>
  );
};
