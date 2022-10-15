import { AppState } from '@/app/appStore';
import { IconButton } from '@/components/Button';
import DefaultAvatarSrc from '@/static/icon/default-avatar.png';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AvatarPanel from './AvatarPanel';

const Avatar: React.FC = () => {
  const [avatarPanelVisible, setAvatarPanelVisible] = useState(false);

  const hasHoverMediaFeature = useMemo(() => window.matchMedia('(hover: hover)').matches, []);

  const onMouseEnter = () => {
    setAvatarPanelVisible(true);
  };

  const onMouseLeave = () => {
    setAvatarPanelVisible(false);
  };

  const onClick: React.MouseEventHandler = (event) => {
    setAvatarPanelVisible(!avatarPanelVisible);
    event.stopPropagation();
  };

  const { info } = useSelector((state: AppState) => state.user);

  return (
    <div
      onMouseLeave={hasHoverMediaFeature ? onMouseLeave : undefined}
      style={{ position: 'relative' }}
    >
      <IconButton
        icon={info?.avatar ? info.avatar : DefaultAvatarSrc}
        description="用户图像"
        onClick={onClick}
        onMouseEnter={hasHoverMediaFeature ? onMouseEnter : undefined}
      />
      <AvatarPanel visible={avatarPanelVisible} setVisible={setAvatarPanelVisible} />
    </div>
  );
};

export default Avatar;
