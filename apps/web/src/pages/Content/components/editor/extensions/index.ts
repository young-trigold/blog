import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec, NodeSpec } from 'prosemirror-model';
import EditorStore from '../store';

export abstract class Extension {
	abstract get name(): string;
	editorStore: EditorStore | null = null;

	onEditorStoreCreate?(): void;
	onEditorViewCreate?(): void;
}

export abstract class MarkExtension extends Extension {
	get type() {
		return this.editorStore?.schema?.marks[this.name]!;
	}

	abstract createMarkSpec(): MarkSpec;
	tags: ExtensionTag[] = [];
	createTags?(): ExtensionTag[];
	createInputRules?(): InputRule[];
}

export abstract class NodeExtension extends Extension {
	get type() {
		return this.editorStore?.schema?.nodes[this.name]!;
	}
	abstract createNodeSpec(): NodeSpec;

	tags: ExtensionTag[] = [];
	createTags?(): ExtensionTag[];
	createInputRules?(): InputRule[];
}

export abstract class PlainExtension extends Extension {
	/**
	 * 创建 MarkSpec 或 NodeSpec 中的一个属性相关的 attr，toDOM, parseDOM
	 * 这些是在多个 Spec 之间公用的，因此单独需要一个方法提供这个机制
	 * @example 缩进 行高 文字居中等
	 */
	createSpecCommonPart?(): Record<string, string>[];
}

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

// export function markInputRule(props: MarkInputRuleProps): SkippableInputRule {
//   const {
//     regexp,
//     type,
//     getAttributes,
//     ignoreWhitespace = false,
//     beforeDispatch,
//     updateCaptured,
//     shouldSkip,
//     invalidMarks,
//   } = props;

//   let markType: MarkType | undefined;

//   const rule: SkippableInputRule = new InputRule(regexp, (state, match, start, end) => {
//     const { tr, schema } = state;

//     if (!markType) {
//       markType = isString(type) ? schema.marks[type] : type;

//       invariant(markType, {
//         code: ErrorConstant.SCHEMA,
//         message: `Mark type: ${type} does not exist on the current schema.`,
//       });
//     }

//     let captureGroup: string | undefined = match[1];
//     let fullMatch = match[0];

//     // These are the attributes which are added to the mark and they can be
//     // obtained from the match if a function is provided.
//     const details = gatherDetails({
//       captureGroup,
//       fullMatch,
//       end,
//       start,
//       rule,
//       state,
//       ignoreWhitespace,
//       invalidMarks,
//       shouldSkip,
//       updateCaptured,
//     });

//     if (!details) {
//       return null;
//     }

//     ({ start, end, captureGroup, fullMatch } = details);

//     const attributes = isFunction(getAttributes) ? getAttributes(match) : getAttributes;
//     let markEnd = end;
//     let initialStoredMarks: readonly Mark[] = [];

//     if (captureGroup) {
//       const startSpaces = fullMatch.search(/\S/);
//       const textStart = start + fullMatch.indexOf(captureGroup);
//       const textEnd = textStart + captureGroup.length;

//       initialStoredMarks = tr.storedMarks ?? [];

//       if (textEnd < end) {
//         tr.delete(textEnd, end);
//       }

//       if (textStart > start) {
//         tr.delete(start + startSpaces, textStart);
//       }

//       markEnd = start + startSpaces + captureGroup.length;
//     }

//     tr.addMark(start, markEnd, markType.create(attributes));

//     // Make sure not to reactivate any marks which had previously been
//     // deactivated. By keeping track of the initial stored marks we are able to
//     // discard any unintended consequences of deleting text and adding it again.
//     tr.setStoredMarks(initialStoredMarks);

//     // Allow the caller of this method to update the transaction before it is
//     // returned and dispatched by ProseMirror.
//     beforeDispatch?.({ tr, match, start, end });

//     return tr;
//   });

//   return rule;
// }
