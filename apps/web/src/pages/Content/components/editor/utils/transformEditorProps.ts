import { DirectEditorProps } from 'prosemirror-view';
import { EditorProps } from '..';

const transformEditorProps = (originProps: EditorProps): DirectEditorProps => {
	const { editable, onChange, ...restProps } = originProps;

	return {
		editable() {
			return editable;
		},
		dispatchTransaction(tr) {
			onChange?.(tr, originProps.state);
		},
		...restProps,
	};
};

export default transformEditorProps;
