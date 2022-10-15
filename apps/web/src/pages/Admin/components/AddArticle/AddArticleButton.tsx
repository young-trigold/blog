import { FloatingActionButton } from '@/components/Button';
import AddIcon from '@/static/icon/plus.png';
import { memo, useCallback, useState } from 'react';
import AddArticleModal from './AddArticleModal';

const AddArticleButton = memo((props: { currentOption: string }) => {
  const { currentOption } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [setIsModalVisible, isModalVisible]);

  return (
    <>
      <FloatingActionButton
        rect={{ bottom: 64, right: 32 }}
        description="添加"
        icon={AddIcon}
        onClick={handleClick}
      />
      <AddArticleModal
        isModalVisible={isModalVisible}
        currentOption={currentOption}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
});

export default AddArticleButton;
