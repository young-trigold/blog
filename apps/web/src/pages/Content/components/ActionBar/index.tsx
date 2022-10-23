import axios from 'axios';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { AppState } from '@/app/store';
import { ContentPageContext } from '@/app/store/pages/contentPage';
import watchedLocalStorage from '@/app/store/watchedLocalStorage';
import { FloatingActionButton } from '@/components/Button';
import { message } from '@/components/Message';
import CancelIcon from '@/static/icon/cancel.png';
import PublishIcon from '@/static/icon/publish.png';

interface ActionBarProps {}

const ActionBar: React.FC<ActionBarProps> = (props) => {
	const { itemID } = useParams();
	const { isChapter } = useContext(ContentPageContext);
	const { editorView } = useSelector((state: AppState) => state.contentPage.editor);
	const { hasLogin, info } = useSelector((state: AppState) => state.user);

	const handlePublish = () => {
		if (!hasLogin) return message.warn('请先登录');
		if (info?.role !== 'admin') return message.warn('权限不足');
		if (!editorView) return;
		const user = watchedLocalStorage.getItem<{ token: string }>('user');
		const updateItem = async () => {
			try {
				await axios.put(
					`/api/${isChapter ? 'notes' : 'articles'}/${itemID}`,
					{
						content: JSON.stringify(editorView.state.doc.toJSON()),
					},
					{
						headers: {
							contentType: 'text/plain',
							Authorization: `Bearer ${user?.token}`,
						},
					},
				);
				message.success('发布成功!');
			} catch (error) {
				if (axios.isAxiosError(error))
					return message.error((error.response?.data as { message: string })?.message);
				if (error instanceof Error) return message.error(error.message);
				return message.error(JSON.stringify(error));
			}
		};

		updateItem();
	};

	const navigate = useNavigate();

	const handleCancel = () => {
		navigate(`/${isChapter ? 'chapters' : 'articles'}/${itemID}`);
	};

	return (
		<aside>
			<FloatingActionButton
				onClick={handleCancel}
				rect={{ right: 32, bottom: 230 }}
				icon={CancelIcon}
				description="取消"
			/>
			<FloatingActionButton
				onClick={handlePublish}
				rect={{ right: 32, bottom: 170 }}
				icon={PublishIcon}
				description="发布"
			/>
		</aside>
	);
};

export default memo(ActionBar);
