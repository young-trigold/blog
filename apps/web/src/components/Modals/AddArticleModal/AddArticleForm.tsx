import { useAppDispatch } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface AddArticleFormProps {
	currentOption: string;
}

const AddArticleForm: React.FC<AddArticleFormProps> = (props) => {
	const { currentOption } = props;
	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.AddArticle));
		} else {
			dispatch(closeModal());
		}
	}, []);

	const [title, setTitle] = useState('');

	const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
		const { value } = event.target;
		setTitle(value);
	}, []);

	const postArticle = useCallback(async () => {
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
	}, [currentOption, title]);

	const handleSubmit = useCallback(() => {
		postArticle();
		setVisible(false);
	}, [postArticle]);

	const handleCancel = useCallback(() => {
		setTitle('');
		setVisible(false);
	}, []);

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
	);
};

export default AddArticleForm;
