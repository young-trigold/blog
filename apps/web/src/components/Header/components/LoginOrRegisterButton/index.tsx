import { memo, useCallback, useState } from 'react';
import { Button } from '../../../Button';

import LoginOrRegisterModal from './LoginOrRegisterModal';

const LoginOrRegisterButton: React.FC = () => {
  const [isLoginOrRegisterModalVisible, setIsLoginOrRegisterModalVisible] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoginOrRegisterModalVisible(true);
  }, [setIsLoginOrRegisterModalVisible]);

  return (
    <>
      <Button buttonType="outlined" onClick={handleClick}>
        登录/注册
      </Button>

      <LoginOrRegisterModal
        isLoginOrRegisterModalVisible={isLoginOrRegisterModalVisible}
        setIsLoginOrRegisterModalVisible={setIsLoginOrRegisterModalVisible}
      />
    </>
  );
};

export default memo(LoginOrRegisterButton);
