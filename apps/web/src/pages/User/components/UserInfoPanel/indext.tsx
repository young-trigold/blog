import { AppState } from '@/app/appStore';
import { Button } from '@/components/Button';
import DefaultAvatarSrc from '@/static/icon/default-avatar.png';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const StyledUserInfoPanel = styled.div`
  padding: 1em;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  word-break: keep-all;
`;

const StyledAvatar = styled.figure`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledUserIntro = styled.div`
  margin: 1em;
`;

const UserInfoPanel = () => {
  const { info } = useSelector((state: AppState) => state.user);

  return (
    <StyledUserInfoPanel>
      <StyledAvatar>
        <img src={info?.avatar ?? DefaultAvatarSrc} alt="用户图像" style={{ width: '100%' }} />
      </StyledAvatar>
      <StyledUserIntro>
        <h3>{info?.name}</h3>
        <p>用户描述</p>
      </StyledUserIntro>
      <Button>编辑个人资料</Button>
    </StyledUserInfoPanel>
  );
};

export default UserInfoPanel;
