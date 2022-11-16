import { useAppDispatch, useAppSelector } from '@/app/store';
import { setInsertLinkModalVisible } from '@/app/store/modals';
import { setEditorState } from '@/app/store/pages/contentPage';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const InsertLinkForm = () => {
	const dispatch = useAppDispatch();

	const [title, setTitle] = useState('');

	const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const { value } = event.target;
		setTitle(value);
	};

	const [link, setLink] = useState('');

	const handleLinkChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const { value } = event.target;
		setLink(value);
	};

	const handleCancel = useCallback(() => {
		setTitle('');
		setLink('');
		dispatch(setInsertLinkModalVisible(false));
	}, [setInsertLinkModalVisible]);

	const { editorState } = useAppSelector((state) => state.contentPage.editor);

	const handleOK = useCallback(() => {
		if (!editorState) return;
		const attrs = { title, href: link };
		const { schema } = editorState;
		const node = schema.text(attrs.title, [schema.marks.link.create(attrs)]);
		const newEditorState = editorState.apply(editorState.tr.replaceSelectionWith(node, false));
		dispatch(setEditorState(newEditorState));
		dispatch(setInsertLinkModalVisible(false));
	}, [editorState, setInsertLinkModalVisible, link, title]);

	const disabled = useMemo(() => {
		let pass = true;
		const URLPattern =
			/^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
		if (title.replace(/\s+/g, '') === '' || link.replace(/\s+/g, '') === '') pass = false;
		if (!URLPattern.test(link)) pass = false;
		return !pass;
	}, [title, link]);

	useEffect(() => {
		const onKeyPress = (event: KeyboardEvent) => {
			const { key } = event;
			if (key === 'Enter') {
				if (disabled) return message.warn('所填字段不满足要求');
				handleOK();
			}
		};

		window.addEventListener('keypress', onKeyPress);

		return () => {
			window.removeEventListener('keypress', onKeyPress);
		};
	}, [title, link]);

	const titleInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		titleInputRef.current?.focus();
	}, [titleInputRef.current]);

	return (
		<form>
			<Input
				tabIndex={1}
				value={title}
				onChange={handleTitleChange}
				placeholder="链接名称"
				ref={titleInputRef}
				style={{ marginBottom: '1em' }}
			/>
			<Input
				style={{ marginBottom: '1em' }}
				value={link}
				onChange={handleLinkChange}
				placeholder="链接地址"
				tabIndex={2}
			/>
			<ButtonBar>
				<Button tabIndex={4} onClick={handleCancel}>
					取消
				</Button>
				<Button tabIndex={3} buttonType="elevated" onClick={handleOK} disabled={disabled}>
					确定
				</Button>
			</ButtonBar>
		</form>
	);
};

export default memo(InsertLinkForm);
