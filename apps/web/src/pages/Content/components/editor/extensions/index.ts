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

export enum ExtensionTag {
	LastNodeCompatible = 'lastNodeCompatible',
	FormattingMark = 'formattingMark',
	FormattingNode = 'formattingNode',
	NodeCursor = 'nodeCursor',
	FontStyle = 'fontStyle',
	Link = 'link',
	Color = 'color',
	Alignment = 'alignment',
	Indentation = 'indentation',
	Behavior = 'behavior',
	Code = 'code',
	Inline = 'inline',
	Block = 'block',
	ListContainerNode = 'listContainer',
	ListItemNode = 'listItemNode',
	TextBlock = 'textBlock',
	ExcludeInputRules = 'excludeFromInputRules',
	PreventExits = 'preventsExits',
	Media = 'media',
}
