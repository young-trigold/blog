import { debounce } from 'lodash';
import React, { memo, PropsWithChildren, useCallback } from 'react';
import styled from 'styled-components';

import { Size } from '@/app/theme/styled';
import addMediaEffect from '@/utils/addMediaEffect';
import IconPressSoundSrc from '../../static/audio/icon-press.mp3';

export interface StyledFloatingActionButtonProps {
  disabled?: boolean;
  rect: Partial<DOMRect>;
  size?: Size;
}

export const StyledFloatingActionButton = styled.button<StyledFloatingActionButtonProps>`
  filter: ${(props) => (props.disabled ? 'grayscale(50%)' : 'unset')};
  position: fixed;
  left: ${(props) => (props.rect?.left ? `${props.rect.left}px` : 'unset')};
  top: ${(props) => (props.rect?.top ? `${props.rect.top}px` : 'unset')};
  bottom: ${(props) => (props.rect?.bottom ? `${props.rect.bottom}px` : 'unset')};
  right: ${(props) => (props.rect?.right ? `${props.rect.right}px` : 'unset')};
  z-index: 3;
  background-color: ${(props) => props.theme.primaryColor};
  border: none;
  border-radius: 50%;
  padding: 8px;
  width: ${(props) =>
    (() => {
      switch (props.size) {
        case 'large':
          return '50px';
        case 'small':
          return '30px';
        default:
          return '40px';
      }
    })()};
  height: ${(props) =>
    (() => {
      switch (props.size) {
        case 'large':
          return '50px';
        case 'small':
          return '30px';
        default:
          return '40px';
      }
    })()};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${(props) => props.theme.transition};
  user-select: none;
  box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }

  &:active {
    transform: scale(0.9, 0.9);
    background-color: ${(props) => props.theme.activeColor};
  }
`;

export interface FloatingActionButtonProps extends StyledFloatingActionButtonProps {
  icon: string;
  description: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const FloatingActionButton: React.FC<PropsWithChildren<FloatingActionButtonProps>> = memo(
  (props) => {
    const { icon, size = 'middle', description, onClick, rect, children, disabled = false } = props;

    const handleClick: React.MouseEventHandler = useCallback(
      debounce(
        (event) => {
          if (onClick) addMediaEffect(onClick, IconPressSoundSrc, 20)(event);
        },
        300,
        { leading: true },
      ),
      [onClick],
    );

    return (
      <StyledFloatingActionButton
        disabled={disabled}
        size={size}
        rect={rect}
        type="button"
        onClick={handleClick}
      >
        <img alt={description} src={icon} draggable={false} style={{ width: '100%' }} />
        {children}
      </StyledFloatingActionButton>
    );
  },
);

export default FloatingActionButton;
