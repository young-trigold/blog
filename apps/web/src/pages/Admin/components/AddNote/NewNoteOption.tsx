import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import AddIcon from '@/static/icon/plus.png';

const AddNoteButton = styled.button`
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

function NewNoteOption() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalVisible(true);
  }, [setIsModalVisible]);

  const [title, setTitle] = useState('');

  const handleCancel = useCallback(() => {
    setTitle('');
    setIsModalVisible(false);
  }, [setIsModalVisible, setTitle]);

  const handleSubmit = useCallback(async () => {
    if (!title) return message.warn('笔记标题不能为空!');

    try {
      await axios.post(
        '/api/notes',
        { title },
        {
          headers: {
            contentType: 'application/json',
          },
        },
      );
      message.success('创建成功!');
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error))
        return message.error((error.response?.data as { message: string })?.message);
      if (error instanceof Error) return message.error(error.message);
      return message.error(JSON.stringify(error));
    }
  }, [title]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      if (value) setTitle(value);
    },
    [setTitle],
  );

  const disabled = useMemo(() => title.replace(/\s+/g, '') === '', [title]);

  return (
    <>
      <AddNoteButton type="button" onClick={handleClick}>
        <img src={AddIcon} alt="添加" width={20} />
      </AddNoteButton>
      <Modal visible={isModalVisible} setVisible={setIsModalVisible} title="新增笔记">
        <form>
          <Input
            value={title}
            onChange={handleInputChange}
            placeholder="笔记标题"
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
}

export default React.memo(NewNoteOption);
