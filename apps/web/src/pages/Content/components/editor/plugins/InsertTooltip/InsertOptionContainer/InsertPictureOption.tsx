import axios from 'axios';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { StyledOption } from '.';
import { AppState } from '@/app/appStore';
import { message } from '@/components/Message';
import PictureIconSrc from '@/static/icon/picture.png';

const InsertPictureOption = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOptionClick = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  };

  const { editorView } = useSelector((state: AppState) => state.contentPage.editor);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (!files || files.length === 0) return;
    if (!editorView) return;

    const uploadImages = async () => {
      try {
        const formData = new FormData();
        formData.append('files', files[0]);
        await axios.post('/api/upload', formData);
      } catch (error) {
        if (axios.isAxiosError(error))
          return message.error((error.response?.data as { message: string })?.message);
        if (error instanceof Error) return message.error(error.message);
        return message.error(JSON.stringify(error));
      } finally {
        const attrs = { src: `http://${window.location.hostname}:80/upload/${files[0].name}` };
        const node = editorView.state.schema.nodes.image.create(attrs);
        let transaction = editorView.state.tr;
        transaction = transaction.replaceSelectionWith(node, false);
        editorView.dispatch(transaction);
      }
    };

    uploadImages();
  };

  return (
    <StyledOption onClick={handleOptionClick}>
      <img src={PictureIconSrc} alt="图片" width={24} />
      <span>插入图片</span>
      <input
        ref={inputFileRef}
        onChange={onChange}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
    </StyledOption>
  );
};

export default InsertPictureOption;
