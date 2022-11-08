import { MarkSpec, NodeSpec } from 'prosemirror-model';
import EditorStore from '../store/EditorStore';

export abstract class Extension {
	abstract get name(): string;
	editorStore: EditorStore | null = null;

	onEditorStoreCreate?(): void;
	onEditorViewCreate?(): void;

	createSpecCommonAttrs?(): Record<string, string>[];
	createTags?(): string[];
	tags: string[] = [];
}

export abstract class MarkExtension extends Extension {
	abstract createMarkSpec(): MarkSpec;
}

export abstract class NodeExtension extends Extension {
	abstract createNodeSpec(): NodeSpec;
}

export abstract class PlainExtension extends Extension {}
