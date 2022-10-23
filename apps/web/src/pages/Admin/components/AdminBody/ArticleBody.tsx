import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';

import AddArticleModal from '@/components/Modals/AddArticleModal';
import { StyledRow, StyledTable } from '@/components/Table';
import { ArticleInfo } from '../../../home';
import AddArticleButton from '../buttons/AddArticleButton';
import DeleteArticleButton from '../buttons/DeleteArticleButton';

const StyledArticleBody = styled.main`
	flex: 8;
	overflow: auto;
	background-color: ${(props) => props.theme.backgroundColor};
`;

export interface ArticleBodyProps {
	currentIndex: number;
	articles: ArticleInfo[][];
	tagOptions: string[];
}

function ArticleBody(props: ArticleBodyProps) {
	const { currentIndex, articles, tagOptions } = props;
	const navigate = useNavigate();

	const updateItem = useCallback((articleId: string) => {
		navigate(`/edit/articles/${articleId}`);
	}, []);

	return (
		<StyledArticleBody>
			<StyledTable>
				<thead>
					<tr>
						<th>项目</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					{articles[currentIndex]?.map((article) => (
						<StyledRow key={article._id}>
							<td>{article.title}</td>
							<td>
								<ButtonBar>
									<DeleteArticleButton articleId={article._id} />
									<Button
										onClick={() => updateItem(article._id)}
										size={window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'}
									>
										修改
									</Button>
								</ButtonBar>
							</td>
						</StyledRow>
					))}
				</tbody>
			</StyledTable>
			<AddArticleButton />
			<AddArticleModal currentOption={tagOptions[currentIndex]} />
		</StyledArticleBody>
	);
}

export default React.memo(ArticleBody);
