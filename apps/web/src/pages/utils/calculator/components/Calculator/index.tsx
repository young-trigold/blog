import Divider from '@/components/Divider';
import addMediaEffect from '@/utils/addMediaEffect';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { calculate } from './calculate';

const StyledMain = styled.main`
  color: #eeeeee;
  width: 350px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 10px ${({ theme }) => theme.shadowColor};
  border-radius: 10px;
  background-color: transparent;
  backdrop-filter: blur(10px);
`;

const StyledInput = styled.input`
  height: 50px;
  font-size: 32px;
  background-color: transparent;
  border: none;
  caret-color: ${({ theme }) => theme.warnColor};
  color: ${({ theme }) => theme.textColor};
`;

const StyledOutput = styled.input`
  font-size: 22px;
  height: 22px;
  margin: 12px 0px;
  text-align: right;
  background-color: transparent;
  border: none;
  caret-color: ${({ theme }) => theme.warnColor};
  color: ${({ theme }) => theme.textColor};
`;

const StyledKeyboard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 84px);
  grid-template-rows: repeat(5, 84px);
`;

const StyledItem = styled.div`
  border-radius: 50%;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: ${({ theme }) => theme.transition};

  &:active {
    filter: ${({ theme }) => `drop-shadow(16px 16px 20px ${theme.primaryColor}) invert(75%)`};
    transform: scale(0.9);
  }
`;

const StyledOperator = styled(StyledItem)`
  color: ${({ theme }) => theme.primaryColor};
`;

const keyboardItems: {
  type: 'operator' | 'normal';
  value: string;
  handler?: (input: string) => string;
}[] = [
  { type: 'operator', value: 'AC', handler: () => '' },
  { type: 'operator', value: '⌫', handler: (input) => input.slice(0, -1) },
  {
    type: 'operator',
    value: '±',
  },
  { type: 'operator', value: '÷' },
  { type: 'normal', value: '7' },
  { type: 'normal', value: '8' },
  { type: 'normal', value: '9' },
  { type: 'operator', value: '×' },
  { type: 'normal', value: '4' },
  { type: 'normal', value: '5' },
  { type: 'normal', value: '6' },
  { type: 'operator', value: '-' },
  { type: 'normal', value: '1' },
  { type: 'normal', value: '2' },
  { type: 'normal', value: '3' },
  { type: 'operator', value: '+' },
  { type: 'normal', value: '%' },
  { type: 'normal', value: '0' },
  { type: 'normal', value: '.' },
  { type: 'operator', value: '=' },
];

export const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const output = useMemo(() => calculate(input), [input]);

  return (
    <StyledMain>
      <StyledInput
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
      <StyledOutput
        value={output}
        onChange={(event) => {
          event.preventDefault();
        }}
      />
      <Divider />
      <StyledKeyboard id="keyboard">
        {keyboardItems.map((item) => {
          const { type, handler, value } = item;
          const clickHandler: React.MouseEventHandler = addMediaEffect((event) => {
            const { target } = event;
            if (handler) {
              setInput((preInput) => handler(preInput));
            } else {
              setInput((preInput) => preInput + (target as HTMLDivElement).textContent);
            }
          });
          if (type === 'normal') {
            return (
              <StyledItem key={value} onClick={clickHandler}>
                {value}
              </StyledItem>
            );
          } else if (item.type === 'operator')
            return (
              <StyledOperator key={value} onClick={clickHandler}>
                {value}
              </StyledOperator>
            );
        })}
      </StyledKeyboard>
    </StyledMain>
  );
};
