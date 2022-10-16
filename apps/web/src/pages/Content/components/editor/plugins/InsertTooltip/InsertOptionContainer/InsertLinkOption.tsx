/* eslint-disable jsx-a11y/tabindex-no-positive */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@/app/store';
import { Button, ButtonBar } from '@/components/Button';
import Input from '@/components/Input';
import { message } from '@/components/Message';
import Modal from '@/components/Modal';
import LinkIconSrc from '@/static/icon/link.png';
import { StyledOption } from '.';

const InsertLinkOption = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleOptionClick = () => {
		setIsModalVisible(true);
	};

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

	const handleCancel = () => {
		setTitle('');
		setLink('');
		setIsModalVisible(false);
	};

	const { editorView } = useSelector((state: AppState) => state.contentPage.editor);

	const handleOK = () => {
		if (!editorView) return;
		const attrs = { title, href: link };
		const { schema } = editorView.state;
		const node = schema.text(attrs.title, [schema.marks.link.create(attrs)]);
		editorView.dispatch(editorView.state.tr.replaceSelectionWith(node, false));
		setIsModalVisible(false);
	};

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
				if (!editorView) return;
				const attrs = { title, href: link };
				const { schema } = editorView.state;
				const node = schema.text(attrs.title, [schema.marks.link.create(attrs)]);
				editorView.dispatch(editorView.state.tr.replaceSelectionWith(node, false));
				setIsModalVisible(false);
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
		<>
			<StyledOption onClick={handleOptionClick}>
				<img src={LinkIconSrc} alt="链接" width={24} />
				<span>插入链接</span>
			</StyledOption>
			<Modal visible={isModalVisible} setVisible={setIsModalVisible} title="插入链接">
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
			</Modal>
		</>
	);
};

export default InsertLinkOption;
