import { PasteRule, pasteRules as createPasteRulesPlugin } from 'prosemirror-paste-rules';
import { extensionName, PlainExtension } from '../../type';

@extensionName('paste_rule')
class PasteRuleExtension extends PlainExtension {
	createPlugin() {
		if (!this.editorStore) return;
		const markPasteRules = this.editorStore.markExtensions
			.map((extension) => extension.createPasteRules?.())
			.filter(Boolean)
			.flat();
		const nodePasteRules = this.editorStore.markExtensions
			.map((extension) => extension.createPasteRules?.())
			.filter(Boolean)
			.flat();
		const pasteRules = [...markPasteRules, ...nodePasteRules] as PasteRule[];
		const pasteRulesPlugin = createPasteRulesPlugin(pasteRules);
		return pasteRulesPlugin;
	}
}

export default PasteRuleExtension;
