import axios from 'axios';
import { memo, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { setLoginModalVisible } from '@/app/store/modals';
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
	const { editorState } = useAppSelector((state) => state.contentPage.editor);
	const { hasLogin, info } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	const handlePublish = () => {
		if (!hasLogin) {
			dispatch(setLoginModalVisible(true));
			message.warn('请先登录!');
			return;
		}
		if (info?.role !== 'admin') {
			dispatch(setLoginModalVisible(true));
			message.warn('权限不足, 请重新登录!');
			return;
		}
		if (!editorState) return;
		const user = watchedLocalStorage.getItem<{ token: string }>('user');
		const updateItem = async () => {
			try {
				await axios.put(
					`/api/${isChapter ? 'notes' : 'articles'}/${itemID}`,
					{
						content: JSON.stringify(editorState.doc.toJSON()),
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
