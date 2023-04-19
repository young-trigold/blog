import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ToggleThemeButton from '../ToggleThemeButton';

const Option = styled.div`
  padding: 5px 1em;
  margin: 4px 0;
`;

interface StyledMenuProps {
  visible: boolean;
}

const StyledMenu = styled.menu<StyledMenuProps>`
  margin: 0;
  padding: 0;
  border-radius: 6.4px;
  left: 0;
  top: 30px;
  white-space: nowrap;
  position: absolute;
  z-index: 3;
  background-color: ${(props) => props.theme.foregroundColor};
  box-shadow: 0 0 6px ${(props) => props.theme.shadowColor};
  overflow: hidden;
  transition: ${(props) => props.theme.transition};
  transform-origin: 0 0;
  transform: ${(props) => (props.visible ? 'unset' : 'scaleY(0)')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

export interface MenuProps extends StyledMenuProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menu: React.FC<MenuProps> = (props) => {
  const { visible, setVisible } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const onWindowClick = (event: MouseEvent) => {
      if (!ref.current) return;
      if (!(event.target instanceof HTMLElement)) return;
      if (!ref.current.contains(event.target)) setVisible(false);
    };
    window.addEventListener('click', onWindowClick);

    return () => {
      window.addEventListener('click', onWindowClick);
    };
  }, [visible]);

  return (
    <StyledMenu ref={ref} visible={visible}>
      <Option>
        <Link to="/">首页</Link>
      </Option>
      <Option>
        <Link to="/notes">前端笔记</Link>
      </Option>
      {/* <Option>
        <Link to="/utils/calculator">计算器</Link>
      </Option> */}
      <Option>
        <ToggleThemeButton />
      </Option>
    </StyledMenu>
  );
};

export default Menu;
