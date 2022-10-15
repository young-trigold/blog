/* eslint-disable jsx-a11y/tabindex-no-positive */
import axios from 'axios';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import { NoteOption } from '../AdminPage';

export interface AddChapterModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentOption: NoteOption;
}

function AddChapterModal(props: AddChapterModalProps) {
  const { isModalVisible, currentOption, setIsModalVisible } = props;

  const [title, setTitle] = useState('');

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setTitle(value);
    },
    [setTitle],
  );

  const postChapter = async () => {
    try {
      await axios.post(
        `/api/notes/${currentOption._id}`,
        { title },
        {
          headers: {
            'Content-Type': 'application/json',
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

  const handleSubmit = useCallback(() => {
    postChapter();
  }, [title]);

  const handleCancel = useCallback(() => {
    setTitle('');
    setIsModalVisible(false);
  }, [setIsModalVisible, setTitle]);

  const disabled = useMemo(() => title.replace(/\s+/g, '') === '', [title]);

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Enter') {
        if (disabled) return message.warn('所填字段不满足要求');
        postChapter();
      }
    };

    window.addEventListener('keypress', onKeyPress);

    return () => {
      window.removeEventListener('keypress', onKeyPress);
    };
  }, [title]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef.current]);

  return (
    <Modal title="新增章节" visible={isModalVisible} setVisible={setIsModalVisible}>
      <form>
        <Input
          ref={titleInputRef}
          tabIndex={1}
          value={title}
          placeholder="章节标题"
          onChange={handleTitleChange}
          style={{ marginBottom: '1em' }}
        />
        <ButtonBar>
          <Button tabIndex={3} onClick={handleCancel} state="dange">
            取消
          </Button>
          <Button tabIndex={2} onClick={handleSubmit} disabled={disabled} buttonType="elevated">
            提交
          </Button>
        </ButtonBar>
      </form>
    </Modal>
  );
}

export default memo(AddChapterModal);
