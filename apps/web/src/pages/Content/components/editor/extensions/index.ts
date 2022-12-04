import DocExtension from './presetExtensions/nodeExtensions/docExtension';
import ParagraphExtension from './presetExtensions/nodeExtensions/paragraphExtension';
import TextExtension from './presetExtensions/nodeExtensions/textExtension';
import AttributeExtension from './presetExtensions/plainExtensions/attributeExtension';
import CommandExtension from './presetExtensions/plainExtensions/commandExtension';
import DecorationExtension from './presetExtensions/plainExtensions/decorationExtension';
import HistoryExtension from './presetExtensions/plainExtensions/historyExtension';
import InputRuleExtension from './presetExtensions/plainExtensions/inputRuleExtension';
import KeyMapExtension from './presetExtensions/plainExtensions/keyMapExtension';
import NodeViewExtension from './presetExtensions/plainExtensions/nodeViewExtension';
import PasteRuleExtension from './presetExtensions/plainExtensions/pasteRuleExtension';
import PluginExtension from './presetExtensions/plainExtensions/pluginExtension';
import SchemaExtension from './presetExtensions/plainExtensions/schemaExtension';
import TagExtension from './presetExtensions/plainExtensions/tagExtension';
import { TrailingNodeExtension } from './presetExtensions/plainExtensions/TrailingNodeExtension';

// 预置插件的顺序不可变动
export const presetExtensions = [
	new DocExtension(),
	new TextExtension(),
	new ParagraphExtension(),
	new HistoryExtension(),
	// new GapCursorExtension(),
	new TagExtension(),
	new SchemaExtension(),
	new AttributeExtension(),
	new PluginExtension(),
	new InputRuleExtension(),
	new PasteRuleExtension(),
	new NodeViewExtension(),
	new CommandExtension(),
	new KeyMapExtension(),
	new DecorationExtension(),
	new TrailingNodeExtension(),
];

export { BoldExtension } from './markExtensions/boldExtension';
export { CodeExtension } from './markExtensions/codeExtension';
export { ItalicExtension } from './markExtensions/italicExtension';
export { LinkExtension } from './markExtensions/linkExtension';
export { SubExtension } from './markExtensions/subExtension';
export { SupExtension } from './markExtensions/supExtension';
export { UnderlineExtension } from './markExtensions/underlineExtension';
export { CodeBlockExtension } from './nodeExtensions/codeBlockExtension';
export { HeadingExtension, HeadingMaxLevel } from './nodeExtensions/headingExtension';
