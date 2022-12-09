import styled from 'styled-components';

const StyledCommentHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em;
`;

const CommentHeader = () => {
  return (
    <StyledCommentHeader>
      <div>评论</div>
    </StyledCommentHeader>
  );
};

export default CommentHeader;
