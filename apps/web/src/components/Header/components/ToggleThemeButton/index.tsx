import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppState } from '@/app/store';
import { toggleThemeMode } from '@/app/store/themeMode';
import ToggleSoundSrc from '@/static/audio/toggle.mp3';
import MoonIconSrc from '@/static/icon/moon.png';
import SunIconSrc from '@/static/icon/sun.png';
import addMediaEffect from '@/utils/addMediaEffect';

const StyledToggleThemeButton = styled.button`
  cursor: pointer;
  width: 70px;
  height: 30px;
  border-radius: 15px;
  position: relative;
  display: flex;
  padding: 3px 6px;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.primaryColor};
  border: none;
  box-shadow: 1px 1px 3px ${(props) => props.theme.shadowColor};
`;

interface MakerProps {
  themeMode: string;
}

const Marker = styled.div<MakerProps>`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: ${(props) => props.theme.surfaceColor};
  position: absolute;
  left: ${(props) => (props.themeMode === 'dark' ? '4px' : '40px')};
  transition: ${(props) => props.theme.transition};
`;

const ToggleThemeButton = () => {
  const themeMode = useSelector((state: AppState) => state.themeMode.themeMode);

  const dispatch = useDispatch();

  const onClick = useCallback(
    addMediaEffect(
      (event) => {
        event.stopPropagation();
        dispatch(toggleThemeMode());
      },
      ToggleSoundSrc,
      20,
    ),
    [dispatch],
  );
  return (
    <StyledToggleThemeButton type="button" onClick={onClick}>
      <img src={SunIconSrc} width="24" alt="太阳" />
      <img src={MoonIconSrc} width="24" alt="月亮" />
      <Marker themeMode={themeMode} />
    </StyledToggleThemeButton>
  );
};

export default memo(ToggleThemeButton);
