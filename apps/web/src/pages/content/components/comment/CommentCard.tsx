import styled from 'styled-components';
import { CommentInfo } from './CommentList';

const Container = styled.div`
  padding: 1em;
`;

const StyledUserInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

interface CommentCardProps {
  comment: CommentInfo;
}

const CommentCard: React.FC<CommentCardProps> = (props) => {
  const { comment } = props;

  return (
    <Container key={comment._id}>
      <StyledUserInfo>
        <div>{comment?.user?.name}</div>
        <time dateTime={new Date(comment.updatedAt).toLocaleDateString()}>
          {new Date(comment.updatedAt).toLocaleDateString()}
        </time>
      </StyledUserInfo>
      <div style={{ margin: '1em' }}>{comment?.content}</div>
    </Container>
  );
};

export default CommentCard;
