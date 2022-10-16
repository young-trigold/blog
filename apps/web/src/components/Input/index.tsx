import React, { memo } from 'react';
import styled from 'styled-components';

export type InputShape = 'rect' | 'rounded';

interface StyledInputProps {
  shape?: InputShape;
  disabled?: boolean;
}

interface InputProps extends StyledInputProps {
  tabIndex?: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  type?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  value?: string;
  style?: React.CSSProperties;
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  font-size: 16px;
  caret-color: ${(props) => props.theme.warnColor};
  border: 1.5px solid ${(props) => props.theme.borderColor};
  background-color: transparent;
  border-radius: ${(props) =>
    (() => {
      switch (props.shape) {
        case 'rounded':
          return '1em';
        default:
          return '6.4px';
      }
    })()};
  padding: 0.25em 0.5em;
  color: ${(props) => props.theme.textColor};
  transition: ${(props) => props.theme.transition};
  position: relative;

  &:hover {
    border-color: ${(props) => props.theme.hoverColor};
  }

  &:focus,
  &:active {
    border-color: ${(props) => props.theme.activeColor};
  }
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    type = 'text',
    shape = 'rect',
    minLength = 0,
    maxLength = 100,
    placeholder = '',
    disabled = false,
    onFocus,
    onChange,
    onBlur,
    value,
    style,
    tabIndex,
  } = props;

  return (
    <StyledInput
      tabIndex={tabIndex}
      shape={shape}
      onBlur={onBlur}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      type={type}
      value={value}
      autoComplete="off"
      disabled={disabled}
      style={style}
      minLength={minLength}
      ref={ref}
    />
  );
});

export default memo(Input);
