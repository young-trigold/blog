import { DirectEditorProps } from 'prosemirror-view';
import { EditorProps } from '..';

const transformEditorProps = (originProps: EditorProps): DirectEditorProps => {
	const { editable, ...restProps } = originProps;

	return {
		editable() {
			return editable;
		},
		...restProps,
	};
};

export default transformEditorProps;
