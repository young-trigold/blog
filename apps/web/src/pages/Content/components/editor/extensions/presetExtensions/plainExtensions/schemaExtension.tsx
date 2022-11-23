import { MarkSpec, NodeSpec } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { PlainExtension } from '../..';
import EditorStore from '../../../store/EditorStore';

class SchemaExtension extends PlainExtension {
	get name() {
		return 'schema' as const;
	}

	editorStore: EditorStore | null = null;

	onEditorStoreCreate(): void {
		if (!this.editorStore) return;
		const marks: Record<string, MarkSpec> = {};
		this.editorStore.markExtensions.forEach((markExtension) => {
			marks[markExtension.name] = markExtension.createMarkSpec();
			marks[markExtension.name].group = markExtension.tags.join(' ');
		});

		const nodes: Record<string, NodeSpec> = {};
		this.editorStore.nodeExtensions.forEach((nodeExtension) => {
			nodes[nodeExtension.name] = nodeExtension.createNodeSpec();
			nodes[nodeExtension.name].group = nodeExtension.tags.join(' ');
		});

		this.editorStore.schema = schema;
	}

	onEditorViewCreate?(): void {}
}

export default SchemaExtension;
