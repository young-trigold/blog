import { useAppDispatch, useAppSelector } from '@/app/store';
import { CurrentModal, closeModal, openModal } from '@/app/store/modals';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import { useGetArticles } from '@/hooks/articles/useGetArticles';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const AddArticleTagForm = () => {
  const { tagIndex } = useAppSelector((state) => state.homePage);
  const { isLoading, isError, error, data: articlesByTag } = useGetArticles();
  const tags = articlesByTag?.map((tag) => tag._id) ?? [];
  const currentTag = tags[tagIndex] ?? '';

  const dispatch = useAppDispatch();
  const setVisible = useCallback((visible: boolean) => {
    if (visible) {
      dispatch(openModal(CurrentModal.AddArticleTag));
    } else {
      dispatch(closeModal());
    }
  }, []);

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState(currentTag);

  const handleCancel = useCallback(() => {
    setTag('');
    setTitle('');
    setVisible(false);
  }, [setVisible]);

  const handleTagInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.target;
    setTag(value);
  }, []);

  const handleTitleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setTitle(value);
    },
    [],
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
    setVisible(false);
  }, [tag, title]);

  const disabled = useMemo(
    () => title.replace(/\s+/g, '') === '' || tag.replace(/\s+/g, '') === '',
    [title, tag],
  );

  const tagInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    tagInputRef.current?.focus();
  }, []);

  return (
    <form>
      <Input
        ref={tagInputRef}
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
  );
};

export default AddArticleTagForm;
