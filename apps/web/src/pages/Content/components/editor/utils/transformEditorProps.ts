import { DirectEditorProps } from "prosemirror-view";
import { EditorProps } from "..";

const transformEditorProps = (originProps: EditorProps): DirectEditorProps => {
	const { state, editable, nodeViews, onChange } = originProps;

	return {
		editable() {
			return editable;
		},
		dispatchTransaction(tr) {
			onChange?.(tr);
		},
		state,
		nodeViews,
	};
};

export default transformEditorProps;
