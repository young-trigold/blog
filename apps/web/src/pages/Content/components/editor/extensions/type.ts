import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec, NodeSpec } from 'prosemirror-model';
import { PasteRule } from 'prosemirror-paste-rules';
import { Command, Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import { NodeViewConstructor } from 'prosemirror-view';
import EditorStore from '../store';

export const extensionName = (name: string) => {
	const decorator = <
		F extends {
			new (...args: any[]): Extension;
		},
	>(
		constructor: F,
	) => {
		const classWithName = class extends constructor {
			static extensionName = name;
			get name() {
				return name;
			}
		};

		return classWithName;
	};

	return decorator;
};

export abstract class Extension {
	editorStore: EditorStore | null = null;
	static extensionName: string;
	get name() {
		return Extension.extensionName;
	}

	onEditorStoreCreate?(): void;
	onEditorViewCreate?(): void;
	createPlugin?(): ProseMirrorPlugin | void;
	createKeyMap?(): KeyMap;
}

export abstract class MarkExtension extends Extension {
	get type() {
		return this.editorStore?.schema?.marks[this.name]!;
	}

	abstract createMarkSpec(): MarkSpec;
	tags: ExtensionTag[] = [];
	createTags?(): ExtensionTag[];
	createInputRules?(): InputRule[];
	createPasteRules?(): PasteRule[];
}

export abstract class NodeExtension extends Extension {
	get type() {
		return this.editorStore?.schema?.nodes[this.name]!;
	}
	abstract createNodeSpec(): NodeSpec;

	tags: ExtensionTag[] = [];
	createTags?(): ExtensionTag[];
	createInputRules?(): InputRule[];
	createPasteRules?(): PasteRule[];
	createNodeView?(): NodeViewConstructor;
}

export abstract class PlainExtension extends Extension {
	/**
	 * 创建 MarkSpec 或 NodeSpec 中的一个属性相关的 attr，toDOM, parseDOM
	 * 这些是在多个 Spec 之间公用的，因此单独需要一个方法提供这个机制
	 * @example 缩进 行高 文字居中等
	 */
	createSpecCommonPart?(): Record<string, string>[];
}

export enum FunctionKeys {
	Mod = 'Mod',
	Ctrl = 'Ctrl',
	Shift = 'Shift',
	Alt = 'Alt',
	Backspace = 'Backspace',
	Tab = 'Tab',
}
export enum LetterKeys {
	z = 'z',
	y = 'y',
	b = 'b',
	i = 'i',
	u = 'u',
	m = 'm',
	// =========== 大写 ============
	Z = 'Z',
	Y = 'Y',
	B = 'B',
	I = 'I',
	U = 'U',
	M = 'M',
}
export enum SymbolKeys {
	'`' = '`',
}

export type KeyMap = { [key: string]: Command };

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
