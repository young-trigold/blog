import { useAppSelector } from '@/app/store';
import { UserInfo } from '@/app/store/user';
import Divider from '@/components/Divider';
import styled from 'styled-components';
import CommentCard from './CommentCard';
import CommentHeader from './CommentHeader';

export interface CommentInfo {
	_id: string;
	user: UserInfo;
	updatedAt: string;
	content: string;
}

const CommentListContainer = styled.div`
	flex: 0 0 300px;
	position: sticky;
	display: flex;
	flex-direction: column;
	top: 2em;
	z-index: 2;
	min-width: 300px;
	border-radius: 10px;
	background-color: ${(props) => props.theme.foregroundColor};
	margin: 0 1em;
	transition: ${(props) => props.theme.transition};

	@media (max-width: 698px) {
		display: none;
	}
`;

const CommentList: React.FC = () => {
	const { comments } = useAppSelector((state) => state.contentPage.comment);

	return (
		<CommentListContainer>
			<CommentHeader />
			<Divider />
			{comments.map((comment) => (
				<CommentCard key={comment._id} comment={comment} />
			))}
		</CommentListContainer>
	);
};

export default CommentList;
