import { Selection } from 'prosemirror-state';
import { useMemo, useRef, useState } from 'react';
import SchemaExtension from '../extensions/preset/schemaExtension';
import TagExtension from '../extensions/preset/groupExtension';
import EditorStore from './EditorStore';

interface EditorStoreConfig {
	extensions?: any[];
	doc?: string;
	selection?: Selection;
}

const presetExtensions = [new TagExtension(), new SchemaExtension()];

const useEditorStore = (editorStoreConfig: EditorStoreConfig) => {
	const { extensions = [], doc = '', selection } = editorStoreConfig;

	const editorStoreRef = useRef<EditorStore>(new EditorStore([...extensions, ...presetExtensions]));
	const { current: editorStore } = editorStoreRef;

	const [editorState, setEditorState] = useState(() =>
		editorStoreRef.current.createEditorState(doc, selection),
	);

	return useMemo(
		() => ({ editorState, setEditorState, editorStore: editorStoreRef.current }),
		[editorState, editorStoreRef.current],
	);
};

export default useEditorStore;
