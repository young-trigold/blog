import styled from 'styled-components';

export enum DividerType {
  Vertical,
  Horizontal,
}
interface StyledDividerProps {
  type?: DividerType;
}

const StyledDivider = styled.hr<StyledDividerProps>`
  width: ${(props) => (props.type === DividerType.Horizontal ? '100%' : '1px')};
  height: ${(props) => (props.type === DividerType.Horizontal ? '1px' : '100%')};
  margin: 0;
  background-color: ${(props) => props.theme.borderColor};
  border: none;
`;

interface DividerProps extends StyledDividerProps {
  style?: React.CSSProperties;
}

const Divider: React.FC<DividerProps> = (props) => {
  const { style, type = DividerType.Horizontal } = props;
  return <StyledDivider type={type} style={style} />;
};

export default Divider;
