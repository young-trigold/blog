import styled from 'styled-components';

import { useEffect, useState } from 'react';

interface StyledLoadingIndicatorProps {
  curI: number;
}

export interface LoadingIndicatorProps {
  text?: string;
}

const StyledLoadingIndicator = styled.div<StyledLoadingIndicatorProps>`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1em;

  & > span {
    transition: ${(props) => props.theme.transition};
  }

  & > span:nth-of-type(${(props) => props.curI + 1}) {
    transform: translateY(-1em);
  }
`;

const LoadingIndicator: React.FC<LoadingIndicatorProps> = (props) => {
  const { text } = props;

  const [curI, setCurI] = useState(0);

  useEffect(() => {
    let timer: number;

    if (curI < (text ? text.length : 3)) {
      timer = window.setTimeout(() => setCurI(curI + 1), 300);
    } else {
      timer = window.setTimeout(() => setCurI(0), 300);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [curI, setCurI]);

  return (
    <StyledLoadingIndicator curI={curI}>
      {(text || '加载中').split('').map((char) => (
        <span key={char}>{char}</span>
      ))}
      ...
    </StyledLoadingIndicator>
  );
};

export default LoadingIndicator;
