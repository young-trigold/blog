import { useAppSelector } from '@/app/store';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { selectionTooltipExtension } from '../../../../';
import { HeadingDecoration } from './HeadingDecoration';

interface StyledSelectTooltipProps {
  visible: boolean;
  position: Pick<DOMRect, 'left' | 'top'>;
}

export const SelectTooltipWidth = 300;
export const SelectTooltipHeight = 34;

const StyledSelectTooltip = styled.div<StyledSelectTooltipProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${() => `${SelectTooltipWidth}px`};
  height: ${() => `${SelectTooltipHeight}px`};
  top: 0;
  left: 0;
  transform: ${(props) =>
    `translate(${props.position.left - SelectTooltipWidth / 2}px, ${
      props.position.top - SelectTooltipHeight - 4
    }px)`};
  visibility: ${(props) => (props.visible ? 'unset' : 'hidden')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  border-radius: 6.4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
  background-color: ${(props) => props.theme.foregroundColor};
  transition: ${(props) => props.theme.transition};
  user-select: none;
  padding: 1px;
  z-index: 1;
`;

const StyledOption = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 20px;
  border-radius: 6.4px;
  transition: ${(props) => props.theme.transition};
  font-family: 'Times New Roman';
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

interface SelectTooltipProps {
  position: Pick<DOMRect, 'left' | 'top'>;
  visible: boolean;
}

export const SelectTooltip: React.FC = (props) => {
  const { editorStore } = useAppSelector((appState) => appState.contentPage.editor);
  const { position, visible } = useMemo(() => {
    const initialState = {
      position: { left: 0, top: 0 },
      visible: false,
    };
    const view = editorStore?.view;
    if (!view) return initialState;
    const { state } = view;
    const { selection, tr } = state;
    const { $head, empty } = selection;
    const cursorPositionToViewPort = view.coordsAtPos($head.pos);
    const editorContainerPositionToViewPort = view.dom.parentElement!.getBoundingClientRect();
    
    return {
      position: {
        left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
        top: cursorPositionToViewPort.top - editorContainerPositionToViewPort.top,
      },
      visible: !empty,
    };
  }, [editorStore?.view?.state]);

  const handleToggleBold: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, schema, commands } = editorStore;
    if (!editorView || !schema) return;
    const { bold } = commands;
    bold.toggle();
  }, [editorStore?.view?.state]);

  const handleToggleEm: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, schema, commands } = editorStore;
    if (!editorView || !schema) return;
    commands.italic.toggle();
  }, [editorStore?.view?.state]);

  const handleToggleUnderline: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, schema, commands } = editorStore;
    if (!editorView || !schema) return;
    commands.underline.toggle();
  }, [editorStore?.view?.state]);

  const handleToggleSup: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, schema, commands } = editorStore;
    if (!editorView || !schema) return;
    commands.sup.toggle();
  }, [editorStore?.view?.state]);

  const handleToggleSub: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, schema, commands } = editorStore;
    if (!editorView || !schema) return;
    commands.sub.toggle();
  }, [editorStore?.view?.state]);

  const handleToggleOrderedList: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, commands } = editorStore;
    if (!editorView) return;
    commands.ordered_list.toggle();
  }, [editorStore?.view?.state]);

  const handleToggleUnorderedList: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!editorStore) return;
    const { view: editorView, commands } = editorStore;
    if (!editorView) return;
    commands.unordered_list.toggle();
  }, [editorStore?.view?.state]);

  const preventDefault: React.MouseEventHandler<HTMLElement> = (event) => event.preventDefault();

  return (
    <StyledSelectTooltip
      onMouseDown={(event) => event.stopPropagation()}
      onMouseUp={preventDefault}
      visible={visible}
      position={position}
    >
      <HeadingDecoration />
      <StyledOption onClick={handleToggleBold} onMouseDown={preventDefault}>
        <span style={{ fontWeight: 'bold' }}>B</span>
      </StyledOption>
      <StyledOption onClick={handleToggleEm} onMouseDown={preventDefault}>
        <span style={{ fontStyle: 'italic' }}>I</span>
      </StyledOption>
      <StyledOption onClick={handleToggleUnderline} onMouseDown={preventDefault}>
        <span style={{ textDecoration: 'underline' }}>U</span>
      </StyledOption>
      <StyledOption onClick={handleToggleSup} onMouseDown={preventDefault}>
        <span>
          X<sup>2</sup>
        </span>
      </StyledOption>
      <StyledOption onClick={handleToggleSub} onMouseDown={preventDefault}>
        <span>
          X<sub>2</sub>
        </span>
      </StyledOption>
      <StyledOption onMouseDown={preventDefault} onClick={handleToggleOrderedList}>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M4.539 4.1H6.75l.047.008a.15.15 0 01.103.142v5.5l-.008.047a.15.15 0 01-.142.103H5.584l-.047-.008a.15.15 0 01-.103-.142V5.917l-.007-.07a.35.35 0 00-.343-.28h-.779L4.26 5.56a.15.15 0 01-.102-.172l.234-1.167.019-.049a.15.15 0 01.128-.072zM3.105 15.96c.079-1.147 1.052-1.86 2.394-1.86 1.33 0 2.399.853 2.399 1.822 0 .6-.232 1.001-1.007 1.71l-.955.791-.226.177H6l1.75.009.048.007a.15.15 0 01.102.143v.991l-.008.047a.15.15 0 01-.142.103H3.251l-.047-.008a.15.15 0 01-.103-.142v-.608l.007-.045a.15.15 0 01.051-.073l2.252-1.739.299-.234.241-.202c.394-.345.524-.556.527-.792.01-.497-.376-.85-.978-.85l-.134.007c-.521.049-.843.311-.889.778a.105.105 0 01-.105.104H3.237a.134.134 0 01-.132-.136zm7.145-6.933a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 9.25a.75.75 0 100 1.5h8.5a.75.75 0 000-1.5H11zM10.25 5a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 9.25a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H11z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </StyledOption>
      <StyledOption onMouseDown={preventDefault} onClick={handleToggleUnorderedList}>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M6.014 5.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3 1.5a3 3 0 116 0 3 3 0 01-6 0zm7.236-2a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zM11 8.277a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5H11zm0 10a.75.75 0 100 1.5h8.5a.75.75 0 000-1.5H11zm0-4.027a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H11zM4.514 17a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5-3a3 3 0 100 6 3 3 0 000-6z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </StyledOption>
    </StyledSelectTooltip>
  );
};
