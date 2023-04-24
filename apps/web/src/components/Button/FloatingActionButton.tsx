import { debounce } from 'lodash';
import React, { forwardRef, memo, PropsWithChildren, useCallback } from 'react';
import styled from 'styled-components';

import { Size } from '@/app/theme/styled';
import addMediaEffect from '@/utils/addMediaEffect';
import IconPressSoundSrc from '../../static/audio/icon-press.mp3';

export interface StyledFloatingActionButtonProps {
  disabled?: boolean;
  left?: number;
  top?: number;
  bottom?: number;
  right?: number;
  size?: Size;
}

export const StyledFloatingActionButton = styled.button<StyledFloatingActionButtonProps>`
  filter: ${(props) => (props.disabled ? 'grayscale(50%)' : 'unset')};
  position: fixed;
  left: ${(props) => (props.left ? `${props.left}px` : 'unset')};
  top: ${(props) => (props.top ? `${props.top}px` : 'unset')};
  bottom: ${(props) => (props?.bottom ? `${props.bottom}px` : 'unset')};
  right: ${(props) => (props?.right ? `${props.right}px` : 'unset')};
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

interface FloatingActionButtonProps extends StyledFloatingActionButtonProps {
  icon: string;
  description: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}

export const FloatingActionButton = memo(forwardRef<
  HTMLButtonElement,
  PropsWithChildren<FloatingActionButtonProps>
>((props, ref) => {
  const {
    icon,
    size = 'middle',
    description,
    onClick,
    left,
    top,
    right,
    bottom,
    disabled = false,
    onMouseEnter,
    onMouseLeave,
  } = props;

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
      ref={ref}
      disabled={disabled}
      size={size}
      left={left}
      top={top}
      right={right}
      bottom={bottom}
      type="button"
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img alt={description} src={icon} draggable={false} style={{ width: '100%' }} />
    </StyledFloatingActionButton>
  );
}));
