import styled from 'styled-components';

interface StyledTextAreaProps {
	disabled?: boolean;
}

const StyledTextArea = styled.textarea`
	width: 100%;
  min-height: 100px;
	font-size: 16px;
	caret-color: ${(props) => props.theme.warnColor};
	border: 1.5px solid ${(props) => props.theme.borderColor};
	background-color: transparent;
	border-radius: 6.4px;
	padding: 0.25em 0.5em;
	color: ${(props) => props.theme.textColor};
	transition: ${(props) => props.theme.transition};
	position: relative;
  resize: vertical;

	&:hover {
		border-color: ${(props) => props.theme.hoverColor};
	}

	&:focus,
	&:active {
		border-color: ${(props) => props.theme.activeColor};
	}
`;

interface TextAreaProps extends StyledTextAreaProps {
	tabIndex?: number;
	minLength?: number;
	maxLength?: number;
	placeholder?: string;
	onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
	value?: string;
	style?: React.CSSProperties;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
	return <StyledTextArea {...props}></StyledTextArea>;
};

export default TextArea;
