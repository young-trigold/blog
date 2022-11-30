import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { PlainExtension } from '../..';
import schema from '../../../schema';
import EditorStore from '../../../store';

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
		const mySchema = new Schema({
			marks,
			nodes,
      topNode: 'doc',
		});
    console.debug(schema.nodes);
		this.editorStore.schema = schema;
	}

	onEditorViewCreate?(): void {}
}

export default SchemaExtension;
