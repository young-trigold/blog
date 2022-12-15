import { useAppSelector } from '@/app/store';
import { memo, useCallback, useState } from 'react';
import styled from 'styled-components';

const StyledHeadingDecoration = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 30px;
	font-size: 20px;
	border-radius: 6.4px;
	transition: ${(props) => props.theme.transition};
	font-family: 'Times New Roman';
`;

interface StyledHeadingOptionContainerProps {
	styledHeadingOptionContainerVisible: boolean;
}

const StyledHeadingOptionContainer = styled.div<StyledHeadingOptionContainerProps>`
	position: absolute;
	top: 100%;
	left: -50%;
	white-space: nowrap;
	background-color: ${(props) => props.theme.foregroundColor};
	border-radius: 6.4px;
	transition: ${(props) => props.theme.transition};
	user-select: none;
	font-size: 16px;
	border: 1px solid ${(props) => props.theme.borderColor};
	padding: 1px;
	transform-origin: 0 0;
	opacity: ${(props) => (props.styledHeadingOptionContainerVisible ? 1 : 0)};
	transform: ${(props) => (props.styledHeadingOptionContainerVisible ? 'unset' : 'scaleY(0)')};
`;

const StyledHeadingOption = styled.div`
	padding: 2px 4px;
	transition: ${(props) => props.theme.transition};
	border-radius: 6.4px;
	cursor: pointer;

	:hover {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.hoverColor};
	}

	:active {
		color: ${(props) => props.theme.foregroundColor};
		background-color: ${(props) => props.theme.activeColor};
	}
`;

const StyledSpan = styled.span`
	:hover {
		background-color: ${(props) => props.theme.surfaceColor};
	}
`;

const HeadingDecoration = () => {
	const { editorStore } = useAppSelector((state) => state.contentPage.editor);
	const [styledHeadingOptionContainerVisible, setStyledHeadingOptionContainerVisible] =
		useState(false);

	const toggleHeadingLevel1 = useCallback(() => {
		if (!editorStore?.view) return;
		const { commands } = editorStore;
		commands.heading.toggle(1);
	}, [editorStore]);

	const toggleHeadingLevel2 = useCallback(() => {
		if (!editorStore?.view) return;
		const { commands } = editorStore;
		commands.heading.toggle(3);
	}, [editorStore]);

	const toggleHeadingLevel3 = useCallback(() => {
		if (!editorStore?.view) return;
		const { commands } = editorStore;
		commands.heading.toggle(3);
	}, [editorStore]);

	const preventDefault: React.MouseEventHandler<HTMLElement> = (event) => event.preventDefault();

	return (
		<StyledHeadingDecoration
			onMouseDown={preventDefault}
			onMouseLeave={() => setStyledHeadingOptionContainerVisible(false)}
		>
			<StyledSpan onMouseEnter={() => setStyledHeadingOptionContainerVisible(true)}>
				H <span style={{ fontSize: '1px', position: 'relative', verticalAlign: 'middle' }}>˅</span>
			</StyledSpan>
			<StyledHeadingOptionContainer
				styledHeadingOptionContainerVisible={styledHeadingOptionContainerVisible}
			>
				<StyledHeadingOption onMouseDown={preventDefault} onClick={toggleHeadingLevel1}>
					<span>1 级标题</span>
				</StyledHeadingOption>
				<StyledHeadingOption onMouseDown={preventDefault} onClick={toggleHeadingLevel2}>
					<span>2 级标题</span>
				</StyledHeadingOption>
				<StyledHeadingOption onMouseDown={preventDefault} onClick={toggleHeadingLevel3}>
					<span>3 级标题</span>
				</StyledHeadingOption>
			</StyledHeadingOptionContainer>
		</StyledHeadingDecoration>
	);
};

export default memo(HeadingDecoration);
