import { useAppSelector } from '@/app/store';
import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

import InsertOptionContainer from './InsertOptionContainer';

interface StyledInsertTooltipProps {
  visible: boolean;
  position: Pick<DOMRect, 'left' | 'top'>;
}

export const InsertTooltipWidth = 14;
export const InsertTooltipHeight = 14;

const StyledInsertTooltip = styled.div<StyledInsertTooltipProps>`
  position: absolute;
  width: ${() => `${InsertTooltipWidth}px`};
  height: ${() => `${InsertTooltipHeight}px`};
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? 'unset' : 'hidden')};
  transform: ${(props) =>
    `translate(${props.position.left - InsertTooltipWidth / 2}px, ${props.position.top + 2}px)`};
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: 0 0 2px ${(props) => props.theme.shadowColor};
  color: ${(props) => props.theme.warnColor};
  background-color: ${(props) => props.theme.surfaceColor};
  transition: ${(props) => props.theme.transition};
  user-select: none;
  z-index: 1;
`;

interface InsertTooltipProps {}

const InsertTooltip: React.FC<InsertTooltipProps> = (props) => {
  const { visible, position, canInsertBlock } = useAppSelector((appState) => {
    const initialState = {
      visible: false,
      canInsertBlock: false,
      position: {
        left: 0,
        top: 0,
      },
    };
    const { editorStore } = appState.contentPage.editor;
    const view = editorStore?.view;
    if (!view) return initialState;
    const { state } = view;
    const { selection } = state;
    const { $head, empty } = selection;
    const { nodeAfter, nodeBefore } = $head;
    const canInsertBlock = nodeAfter === null || nodeBefore === null;
    const cursorPositionToViewPort = view.coordsAtPos($head.pos);
    const editorContainerPositionToViewPort = view.dom.parentElement!.getBoundingClientRect();
    return {
      visible: empty,
      canInsertBlock,
      position: {
        left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
        top: cursorPositionToViewPort.bottom - editorContainerPositionToViewPort.top,
      },
    };
  });
  const [insertOptionContainerVisible, setInsertOptionContainerVisible] = useState(false);

  const handleInsertTooltipClicked: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    setInsertOptionContainerVisible(true);
  };

  useEffect(() => {
    const handleClick = () => {
      setInsertOptionContainerVisible(false);
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <StyledInsertTooltip
        visible={visible}
        position={position}
        onClick={handleInsertTooltipClicked}
      >
        <span>✛</span>
      </StyledInsertTooltip>
      {insertOptionContainerVisible && (
        <InsertOptionContainer canInsertBlock={canInsertBlock} position={position} />
      )}
    </>
  );
};

export default memo(InsertTooltip);
