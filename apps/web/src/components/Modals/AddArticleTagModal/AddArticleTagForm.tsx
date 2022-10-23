import { AppDispatch } from '@/app/store';
import { setAddArticleTagModalVisible } from '@/app/store/modals';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

const AddArticleTagForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setAddArticleTagModalVisible(visible));
	}, []);

	const [title, setTitle] = useState('');
	const [tag, setTag] = useState('');

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
	}, [tag, title, setVisible]);

	const disabled = useMemo(
		() => title.replace(/\s+/g, '') === '' || tag.replace(/\s+/g, '') === '',
		[title, tag],
	);

	return (
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
	);
};

export default AddArticleTagForm;
