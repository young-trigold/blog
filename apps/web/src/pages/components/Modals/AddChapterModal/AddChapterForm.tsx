import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AppDispatch } from '@/app/store';
import { setAddChapterModalVisible } from '@/app/store/modals';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import { useDispatch } from 'react-redux';
import { NoteOption } from 'src/pages/admin/components/AdminPage';

interface AddChapterFormProps {
	currentOption: NoteOption;
}

const AddChapterForm: React.FC<AddChapterFormProps> = (props) => {
	const { currentOption } = props;
	const dispatch = useDispatch<AppDispatch>();
	const setVisible = useCallback((visible: boolean) => {
		dispatch(setAddChapterModalVisible(visible));
	}, []);
	const [title, setTitle] = useState('');

	const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setTitle(value);
	}, []);

	const postChapter = useCallback(async () => {
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
	}, [currentOption, title]);

	const handleSubmit = useCallback(() => {
		postChapter();
	}, []);

	const handleCancel = useCallback(() => {
		setTitle('');
		setVisible(false);
	}, [setVisible]);

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
	}, []);

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
	);
};

export default AddChapterForm;
