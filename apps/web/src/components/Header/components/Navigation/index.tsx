import { memo, useContext } from 'react';
import { HeaderContext } from '../..';
import MenuButton from './MenuButton';
import Nav from './Nav';

const Navigation: React.FC = () => {
  const { notWide } = useContext(HeaderContext);

  if (notWide) return <MenuButton />;
  return <Nav />;
};

export default memo(Navigation);
