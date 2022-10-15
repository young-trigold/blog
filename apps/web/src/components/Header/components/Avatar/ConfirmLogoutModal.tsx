import { Button, ButtonBar } from '@/components/Button';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import watchedLocalStorage from '@/utils/watchedLocalStorage';

interface ConfirmLogoutModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = (props) => {
  const { visible, setVisible } = props;

  const onConfirm = () => {
    watchedLocalStorage.removeItem('user');
    message.success('您已退出登录');
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal title="退出登录" visible={visible} setVisible={setVisible}>
      <p style={{ textAlign: 'center' }}>您确定要退出登录吗？</p>
      <ButtonBar>
        <Button buttonType="elevated" onClick={onConfirm}>
          确定
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </ButtonBar>
    </Modal>
  );
};

export default ConfirmLogoutModal;
