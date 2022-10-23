import { Button } from '@/components/Button';
import { message } from '@/components/Message';
import getUserToken from '@/utils/getUserToken';
import axios from 'axios';
import { memo, useCallback, useMemo } from 'react';

interface DeleteArticleButtonProps {
	articleId: string
}

const DeleteArticleButton: React.FC<DeleteArticleButtonProps> = (props) => {
	const {articleId} = props;
	const onClick = useCallback(() => {
		const userToken = getUserToken();

		if (!userToken) return message.warn('请先登录!');

		const deleteArticle = async () => {
			try {
				await axios.delete(`/api/articles/${articleId}`, {
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				});
				message.success('删除成功!');
				window.location.reload();
			} catch (error) {
				if (axios.isAxiosError(error))
					return message.error((error.response?.data as { message: string })?.message);
				if (error instanceof Error) return message.error(error.message);
				return message.error(JSON.stringify(error));
			}
		};

		deleteArticle();
	}, [articleId]);

	const size = useMemo(() => (window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'), []);

	return (
		<Button
			onClick={onClick}
			state="dange"
			size={size}
		>
			删除
		</Button>
	);
};

export default memo(DeleteArticleButton);
