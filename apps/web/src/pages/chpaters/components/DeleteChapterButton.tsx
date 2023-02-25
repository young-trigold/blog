import { Button } from '@/components/Button';
import axios from 'axios';
import { memo, useMemo } from 'react';

import { message } from '@/components/Message';
import getUserToken from '@/utils/getUserToken';

interface DeleteChapterButtonProps {
	chapterId: string;
	noteId: string;
}

const DeleteChapterButton: React.FC<DeleteChapterButtonProps> = (props) => {
	const { chapterId, noteId } = props;

	const onClick = () => {
		const deleteItem = (chapterId: string) => {
			const userToken = getUserToken();
			if (!userToken) return message.warn('请先登录!');

			const deleteChapter = async () => {
				try {
					await axios.delete(`/api/notes/${noteId}/${chapterId}`, {
						headers: {
							Authorization: `Bearer ${userToken}`,
						},
					});

					message.success('删除成功!');
					// window.location.reload();
				} catch (error) {
					if (axios.isAxiosError(error))
						return message.error((error.response?.data as { message: string })?.message);
					if (error instanceof Error) return message.error(error.message);
					return message.error(JSON.stringify(error));
				}
			};

			deleteChapter();
		};

		deleteItem(chapterId);
	};

	const size = useMemo(
		() => (window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'),
		[],
	);

	return (
		<Button onClick={onClick} state="dange" size={size}>
			删除
		</Button>
	);
};

export default memo(DeleteChapterButton);
