import axios from 'axios';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Button, ButtonBar } from '@/components/Button';
import { message } from '@/components/Message';
import getUserToken from '@/utils/getUserToken';
import { useNavigate } from 'react-router-dom';
import { ChapterInfo } from '../../chpaters';
import { AddChapterButton } from './AddChapter';
import { NoteOption } from './AdminPage';
import { StyledRow, StyledTable } from './StyledTable';

const StyledChapterBody = styled.main`
	flex: 8;
	overflow: auto;
	background-color: ${(props) => props.theme.backgroundColor};
`;

export interface OptionInfo {
	_id: string;
	title: string;
}

export interface ChapterBodyProps {
	currentIndex: number;
	chapters: ChapterInfo[][];
	noteOptions: NoteOption[];
}

const ChapterBody: React.FC<ChapterBodyProps> = (props) => {
	const { currentIndex, chapters, noteOptions } = props;
	const navigate = useNavigate();

	const deleteItem = useCallback(
		(chapterId: string) => {
			const userToken = getUserToken();

			if (!userToken) return message.warn('请先登录!');

			const deleteChapter = async () => {
				try {
					await axios.delete(`/api/notes/${noteOptions[currentIndex]._id}/${chapterId}`, {
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

			deleteChapter();
		},
		[noteOptions, currentIndex],
	);

	const updateItem = useCallback(
		(articleId: string) => {
			navigate(`/edit/chapters/${articleId}`);
		},
		[navigate],
	);

	return (
		<StyledChapterBody>
			<StyledTable>
				<thead>
					<tr>
						<th>项目</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					{chapters[currentIndex]?.map((chapter) => (
						<StyledRow key={chapter._id}>
							<td>{chapter.title}</td>
							<td>
								<ButtonBar>
									<Button
										onClick={() => deleteItem(chapter._id)}
										state="dange"
										size={window.matchMedia('(max-width: 400px)').matches ? 'small' : 'middle'}
									>
										删除
									</Button>
									<Button
										onClick={() => updateItem(chapter._id)}
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
			<AddChapterButton currentOption={noteOptions[currentIndex]} />
		</StyledChapterBody>
	);
};

export default ChapterBody;
