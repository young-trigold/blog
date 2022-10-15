import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import AddIcon from '@/static/icon/plus.png';

const AddTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 100%;
  text-align: center;
  border-radius: 4px;
  padding: 0.5em 0;
  background-color: ${(props) => props.theme.foregroundColor};

  &:hover {
    background-color: ${(props) => props.theme.surfaceColor};
  }

  &:active {
    background-color: ${(props) => props.theme.primaryColor};
  }
`;

const NewTagOption = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalVisible(true);
  }, [setIsModalVisible]);

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');

  const handleCancel = useCallback(() => {
    setTag('');
    setTitle('');
    setIsModalVisible(false);
  }, [setIsModalVisible, setTag, setTitle]);

  const handleTagInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setTag(value);
    },
    [setTag],
  );

  const handleTitleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setTitle(value);
    },
    [setTitle],
  );

  const handleSubmit = useCallback(async () => {
    const postChapter = async () => {
      try {
        await axios.post(
          '/api/articles/',
          { title, tag, data: new Date().toLocaleDateString() },
          {
            headers: {
              'content-Type': 'application/json',
            },
          },
        );

        window.location.reload();
      } catch (error) {
        if (axios.isAxiosError(error))
          return message.error((error.response?.data as { message: string })?.message);
        if (error instanceof Error) return message.error(error.message);
        return message.error(JSON.stringify(error));
      }
    };

    postChapter();
  }, [tag, title, setIsModalVisible]);

  const disabled = useMemo(
    () => title.replace(/\s+/g, '') === '' || tag.replace(/\s+/g, '') === '',
    [title, tag],
  );

  return (
    <>
      <AddTagButton type="button" onClick={handleClick}>
        <img src={AddIcon} alt="添加标签" width="20" />
      </AddTagButton>
      <Modal visible={isModalVisible} setVisible={setIsModalVisible} title="新增标签">
        <form>
          <Input
            value={tag}
            onChange={handleTagInputChange}
            placeholder="标签名称"
            style={{ marginBottom: '1em' }}
          />
          <Input
            value={title}
            onChange={handleTitleInputChange}
            placeholder="文章标题"
            style={{ marginBottom: '1em' }}
          />
          <ButtonBar>
            <Button onClick={handleCancel} state="dange">
              取消
            </Button>
            <Button buttonType="elevated" onClick={handleSubmit} disabled={disabled}>
              提交
            </Button>
          </ButtonBar>
        </form>
      </Modal>
    </>
  );
};

export default React.memo(NewTagOption);
