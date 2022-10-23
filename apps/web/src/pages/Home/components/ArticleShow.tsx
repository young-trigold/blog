import { memo } from 'react';
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

interface ArticleShowProps {
	articlesByTag: ArticlesByTag[];
	tagIndex: number;
}

const ArticleShow: React.FC<ArticleShowProps> = (props: ArticleShowProps) => {
	const { articlesByTag, tagIndex } = props;

	return (
		<StyledArticleShow>
			{articlesByTag.length &&
				articlesByTag[tagIndex]?.articles?.map((article) => (
					<StyledArticleContainer key={article._id}>
						<Article article={article} />
					</StyledArticleContainer>
				))}
		</StyledArticleShow>
	);
};

export default memo(ArticleShow);
