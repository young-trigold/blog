import { debounce } from 'lodash';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

import { Size } from '@/app/theme/styled';
import addMediaEffect from '@/utils/addMediaEffect';
import IconPressSoundSrc from '../../static/audio/icon-press.mp3';

interface StyledIconButtonProps {
  size?: Size;
  disabled?: boolean;
}

export const StyledIconButton = styled.button<StyledIconButtonProps>`
  position: relative;
  background-color: ${(props) => props.theme.foregroundColor};
  border: none;
  border-radius: 6px;
  padding: 3px;
  width: ${(props) =>
    (() => {
      switch (props.size) {
        case 'large':
          return '36px';
        case 'small':
          return '20px';
        default:
          return '30px';
      }
    })()};
  height: ${(props) =>
    (() => {
      switch (props.size) {
        case 'large':
          return '36px';
        case 'small':
          return '20px';
        default:
          return '30px';
      }
    })()};
  transition: ${(props) => props.theme.transition};
  user-select: none;
  filter: ${(props) => (props.disabled ? 'grayscale(50%)' : 'unset')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => props.theme.surfaceColor};
  }

  &:active {
    filter: brightness(1.2);
    transform: scale(0.9, 0.9);
  }
`;

export interface IconButtonProps extends StyledIconButtonProps {
  icon: string;
  description: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}

const IconButton: React.FC<IconButtonProps> = memo((props) => {
  const {
    icon,
    description,
    style,
    onMouseEnter,
    onMouseLeave,
    onClick,
    disabled,
    size = 'middle',
  } = props;

  const handleClick = useCallback(
    debounce(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !disabled) addMediaEffect(onClick, IconPressSoundSrc, 20)(event);
      },
      300,
      { leading: true },
    ),
    [onClick],
  );

  return (
    <StyledIconButton
      type="button"
      size={size}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      <img alt={description} src={icon} draggable={false} style={{ width: '100%' }} />
    </StyledIconButton>
  );
});

export default IconButton;
