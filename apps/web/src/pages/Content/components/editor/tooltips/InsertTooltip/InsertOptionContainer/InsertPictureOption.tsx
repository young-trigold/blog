import axios from 'axios';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@/app/store';
import { message } from '@/components/Message';
import PictureIconSrc from '@/static/icon/picture.png';
import { StyledOption } from '.';

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
				formData.append('file', files[0]);
				const res = await axios.post<{ fileURL: string }>('/api/singleUpload', formData);
				const { fileURL } = res.data;
				const attrs = { src: fileURL };
				const node = editorView.state.schema.nodes.image.create(attrs);
				let transaction = editorView.state.tr;
				transaction = transaction.replaceSelectionWith(node, false);
				editorView.dispatch(transaction);
        message.success('图片插入成功!');
			} catch (error) {
				if (axios.isAxiosError(error))
					return message.error((error.response?.data as { message: string })?.message);
				if (error instanceof Error) return message.error(error.message);
				return message.error(JSON.stringify(error));
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
