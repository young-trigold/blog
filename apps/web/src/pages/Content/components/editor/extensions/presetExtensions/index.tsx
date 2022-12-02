import DocExtension from './nodeExtensions/docExtension';
import ParagraphExtension from './nodeExtensions/paragraphExtension';
import TextExtension from './nodeExtensions/textExtension';
import AttributeExtension from './plainExtensions/attributeExtension';
import CommandExtension from './plainExtensions/commandExtension';
import DecorationExtension from './plainExtensions/decorationExtension';
import GapCursorExtension from './plainExtensions/gapCusorExtension';
import HistoryExtension from './plainExtensions/historyExtension';
import InputRuleExtension from './plainExtensions/inputRuleExtension';
import KeyMapExtension from './plainExtensions/keyMapExtension';
import PasteRuleExtension from './plainExtensions/pasteRuleExtension';
import PluginExtension from './plainExtensions/pluginExtension';
import SchemaExtension from './plainExtensions/schemaExtension';
import TagExtension from './plainExtensions/tagExtension';

// 预置插件的顺序不可变动
const presetExtensions = [
	new HistoryExtension(),
	new DocExtension(),
	new TextExtension(),
	new ParagraphExtension(),
	new GapCursorExtension(),
	new TagExtension(),
	new SchemaExtension(),
	new AttributeExtension(),
	new PluginExtension(),
	new InputRuleExtension(),
	new PasteRuleExtension(),
	new CommandExtension(),
	new KeyMapExtension(),
	new DecorationExtension(),
];

export default presetExtensions;
