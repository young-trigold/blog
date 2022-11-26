import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCurrentHeadingID, setHeadings } from '@/app/store/pages/contentPage';
import { useEffect } from 'react';
import schema from '../editor/schema';
import CatalogItem from './CatalogItem';

export interface HeadingInfo {
	level: number;
	content: string;
	headingID: string;
}

interface StyledCatalogProps {
	catalogVisible: boolean;
}

const StyledCatalog = styled.div<StyledCatalogProps>`
	flex: 0 0 300px;
	max-height: 550px;
	background-color: ${(props) => props.theme.foregroundColor};
	border-radius: 6.4px;
	padding: 1em;
	user-select: none;
	position: sticky;
	transition: ${(props) => props.theme.transition};
	overflow-y: auto;
	margin: 0 1em;
	top: 2em;
	overscroll-behavior: contain;

	@media (max-width: 1014px) {
		z-index: 4;
		position: fixed;
		width: 300px;
		margin: unset;
		top: unset;
		bottom: 160px;
		right: 50%;
		max-height: 450px;
		transform: translate(50%, 0) ${(props) => (props.catalogVisible ? '' : 'scaleY(0)')};
		opacity: ${(props) => (props.catalogVisible ? 1 : 0)};
		background-color: ${(props) => props.theme.foregroundColor};
		box-shadow: ${(props) => `0 0 6px ${props.theme.shadowColor}`};
	}
`;

interface CatalogProps {}

const Catalog: React.FC<CatalogProps> = (props) => {
	const { visible: catalogVisible } = useAppSelector((state) => state.contentPage.catalog);

	// =============================== heading ===============================
	const { catalog, editor } = useAppSelector((state) => state.contentPage);
	const { headings } = catalog;
	const { editorStore } = editor;

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!editorStore) return;
		const { view: editorView } = editorStore;
		if (!editorView) return;
		const { state: editorState } = editorView;
		const { doc } = editorState;
		const currentHeadings: HeadingInfo[] = [];

		doc.descendants((node) => {
			if (node.type !== schema.nodes.heading) return;
			const { headingID, level } = node.attrs;
			currentHeadings.push({ level, headingID, content: node.firstChild?.text ?? '' });
		});

		dispatch(setHeadings(currentHeadings));
		if (!new window.URL(window.location.href).searchParams.get('currentHeadingID')) {
			dispatch(setCurrentHeadingID(currentHeadings[0]?.headingID));
		}
	}, [editorStore]);

	return (
		<StyledCatalog catalogVisible={catalogVisible}>
			{headings.map((heading) => (
				<CatalogItem heading={heading} key={heading.headingID} />
			))}
		</StyledCatalog>
	);
};

export default Catalog;
