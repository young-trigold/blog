import { Selection } from 'prosemirror-state';
import { useMemo, useRef, useState } from 'react';
import presetExtensions from '../extensions/presetExtensions';
import EditorStore from './EditorStore';

interface EditorStoreConfig {
	extensions?: any[];
	doc?: string;
	selection?: Selection;
}

const useEditorStore = (editorStoreConfig: EditorStoreConfig) => {
	const { extensions = [], doc = '', selection } = editorStoreConfig;

	const editorStoreRef = useRef<EditorStore>(new EditorStore([...extensions, ...presetExtensions]));

	const [editorState, setEditorState] = useState(() =>
		editorStoreRef.current.createEditorState(doc, selection),
	);

	return useMemo(
		() => ({ editorState, setEditorState, editorStore: editorStoreRef.current }),
		[editorState, editorStoreRef.current],
	);
};

export default useEditorStore;
