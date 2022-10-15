import { memo, useState } from 'react';

import Modal from '../../../Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export interface LoginOrRegisterModalProps {
  isLoginOrRegisterModalVisible: boolean;
  setIsLoginOrRegisterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginOrRegisterModal: React.FC<LoginOrRegisterModalProps> = (props) => {
  const { isLoginOrRegisterModalVisible, setIsLoginOrRegisterModalVisible } = props;
  const [logging, setLogging] = useState(true);

  const modalTitle = logging ? '登录' : '注册';

  return (
    <Modal
      title={modalTitle}
      visible={isLoginOrRegisterModalVisible}
      setVisible={setIsLoginOrRegisterModalVisible}
    >
      {logging ? (
        <LoginForm
          setLogging={setLogging}
          setIsLoginOrRegisterModalVisible={setIsLoginOrRegisterModalVisible}
        />
      ) : (
        <RegisterForm setLogging={setLogging} />
      )}
    </Modal>
  );
};

export default memo(LoginOrRegisterModal);
