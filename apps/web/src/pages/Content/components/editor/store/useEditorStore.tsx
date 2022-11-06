import { Selection } from 'prosemirror-state';
import { useMemo, useRef, useState } from 'react';
import TagExtension from '../extensions/presetExtensions/plainExtensions/groupExtension';
import SchemaExtension from '../extensions/presetExtensions/plainExtensions/schemaExtension';
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
