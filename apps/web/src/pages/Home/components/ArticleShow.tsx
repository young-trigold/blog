import styled from 'styled-components';

import { ArticlesByTag } from '..';
import Article from './Article';

const StyledArticleShow = styled.section`
	padding: 2em 1em;
	display: grid;
	grid-template-columns: repeat(auto-fill, 160px);
	grid-gap: 2em;
	justify-content: space-evenly;

	@media (max-width: 400px) {
		grid-template-columns: repeat(auto-fill, 140px);
		grid-gap: 2em 1em;
	}
`;

const StyledArticleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export interface ArticleShowProps {
	articlesByTag: ArticlesByTag[] | undefined;
	currentIndex: number;
}

const ArticleShow = (props: ArticleShowProps) => {
	const { articlesByTag, currentIndex } = props;

	return (
		<StyledArticleShow>
			{articlesByTag
				? articlesByTag[currentIndex]?.articles?.map((article) => (
						<StyledArticleContainer key={article._id}>
							<Article article={article} />
						</StyledArticleContainer>
				  ))
				: null}
		</StyledArticleShow>
	);
};

export default ArticleShow;
