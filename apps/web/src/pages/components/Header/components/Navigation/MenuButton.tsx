import { IconButton } from '@/components/Button';
import MenuIcon from '@/static/icon/menu.png';
import { useCallback, useMemo, useState } from 'react';
import Menu from './Menu';

const MenuButton = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleClick: React.MouseEventHandler = useCallback(
    (event) => {
      setMenuVisible(!menuVisible);
      event.stopPropagation();
    },
    [setMenuVisible, menuVisible],
  );

  const hasHoverMediaFeature = useMemo(() => window.matchMedia('(hover: hover)').matches, []);

  const onMouseEnter = () => {
    setMenuVisible(true);
  };

  const onMouseLeave = () => {
    setMenuVisible(false);
  };

  return (
    <div
      onMouseLeave={hasHoverMediaFeature ? onMouseLeave : undefined}
      style={{ position: 'relative' }}
    >
      <IconButton
        icon={MenuIcon}
        description="菜单"
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
      />

      <Menu visible={menuVisible} setVisible={setMenuVisible} />
    </div>
  );
};

export default MenuButton;
