import axios from 'axios';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAppDispatch } from '@/app/store';
import { closeModal, CurrentModal, openModal } from '@/app/store/modals';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';

const AddNoteForm = () => {
	const [title, setTitle] = useState('');

	const dispatch = useAppDispatch();
	const setVisible = useCallback((visible: boolean) => {
		if (visible) {
			dispatch(openModal(CurrentModal.AddNote));
		} else {
			dispatch(closeModal());
		}
	}, []);

	const handleCancel = useCallback(() => {
		setTitle('');
		setVisible(false);
	}, [setVisible]);

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

	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		titleInputRef.current?.focus();
	}, []);

	return (
		<form>
			<Input
				ref={titleInputRef}
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
	);
};

export default memo(AddNoteForm);
