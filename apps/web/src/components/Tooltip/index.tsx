import React, { JSXElementConstructor } from 'react';
import styled from 'styled-components';

interface StyledTooltipProps {
  tooltipTitle: string;
}

const TriangleHeight = 8;

const StyledTooltip = styled.div<StyledTooltipProps>`
  position: absolute;
  width: 200px;
  padding: 6px;
  background-color: ${(props) => props.theme.surfaceColor};
  border-radius: 6.4px;
  box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
  /* &:hover::after {
    display: block;
    position: absolute;
    white-space: nowrap;
   // left: 50%;
    top: calc(100% + 4px);
    //transform: translateX(-50%);
    width: 0;
    height: 0;
    content: '';
    border: ${() => `${TriangleHeight}px`} ${(props) => props.theme.surfaceColor} solid;
    border-top: 0;
    border-left-color: transparent;
    border-right-color: transparent;
    z-index: 7;
  }

  &:hover::before {
    display: block;
    position: absolute;
    white-space: nowrap;
    top: ${() => `calc(100% + 4px + ${TriangleHeight}px)`};
    content: ${(props) => `"${props.tooltipTitle}"`};
    background-color: ${(props) => props.theme.surfaceColor};
    border-radius: 6.4px;
    padding: 4px;
    box-shadow: 0 0 4px ${(props) => props.theme.shadowColor};
    z-index: 7;
  } */
`;

interface TooltipProps extends StyledTooltipProps {
  children: React.ReactElement;
}

const Tooltip = (props: TooltipProps) => {
  const { children, tooltipTitle } = props;
  const { debug } = console;
  const { props: childrenProps } = children;
  return React.cloneElement(children, undefined, childrenProps.children);
};

export default Tooltip;
