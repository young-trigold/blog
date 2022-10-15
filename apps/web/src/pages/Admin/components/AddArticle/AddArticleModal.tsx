/* eslint-disable jsx-a11y/tabindex-no-positive */
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';

export interface AddArticleModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentOption: string;
}

const AddArticleModal: React.FC<AddArticleModalProps> = (props) => {
  const { isModalVisible, currentOption, setIsModalVisible } = props;

  const [title, setTitle] = useState('');

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setTitle(value);
    },
    [setTitle],
  );

  const postArticle = async () => {
    try {
      await axios.post(
        '/api/articles/',
        {
          title,
          tag: currentOption,
          date: new Date().toLocaleDateString(),
        },
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

  const handleSubmit = useCallback(
    debounce(
      () => {
        postArticle();
      },
      200,
      { leading: true },
    ),
    [title, currentOption, setIsModalVisible],
  );

  const handleCancel = useCallback(
    debounce(
      () => {
        setTitle('');
        setIsModalVisible(false);
      },
      200,
      { leading: true },
    ),
    [setIsModalVisible, setTitle],
  );

  const disabled = useMemo(() => title.replace(/\s+/g, '') === '', [title]);

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Enter') {
        if (disabled) return message.warn('所填字段不满足要求');
        postArticle();
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
    <Modal title="新增文章" visible={isModalVisible} setVisible={setIsModalVisible}>
      <form>
        <Input
          ref={titleInputRef}
          tabIndex={1}
          value={title}
          placeholder="文章标题"
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
};

export default AddArticleModal;
