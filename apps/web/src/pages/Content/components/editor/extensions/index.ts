import DocExtension from './presetExtensions/nodeExtensions/docExtension';
import ParagraphExtension from './presetExtensions/nodeExtensions/paragraphExtension';
import TextExtension from './presetExtensions/nodeExtensions/textExtension';
import CommandExtension from './presetExtensions/plainExtensions/commandExtension';
import DecorationExtension from './presetExtensions/plainExtensions/decorationExtension';
import HistoryExtension from './presetExtensions/plainExtensions/historyExtension';
import InputRuleExtension from './presetExtensions/plainExtensions/inputRuleExtension';
import KeyMapExtension from './presetExtensions/plainExtensions/keyMapExtension';
import NodeViewExtension from './presetExtensions/plainExtensions/nodeViewExtension';
import PasteRuleExtension from './presetExtensions/plainExtensions/pasteRuleExtension';
import PluginExtension from './presetExtensions/plainExtensions/pluginExtension';
import SchemaExtension from './presetExtensions/plainExtensions/schemaExtension';
import { TrailingNodeExtension } from './presetExtensions/plainExtensions/trailingNodeExtension';

// 预置插件的顺序不可变动
export const presetNodeExtensions = [DocExtension, TextExtension, ParagraphExtension];

export const presetPlainExtensions = [
	SchemaExtension,
	PluginExtension,
	InputRuleExtension,
	PasteRuleExtension,
	NodeViewExtension,
	CommandExtension,
	KeyMapExtension,
	DecorationExtension,
	HistoryExtension,
	TrailingNodeExtension,
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
