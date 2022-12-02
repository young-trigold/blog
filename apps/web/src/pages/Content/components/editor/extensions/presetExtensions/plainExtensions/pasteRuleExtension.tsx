import { PasteRule, pasteRules as createPasteRulesPlugin } from 'prosemirror-paste-rules';
import { PlainExtension } from '../..';
import EditorStore from '../../../store';

class PasteRuleExtension extends PlainExtension {
	editorStore: EditorStore | null = null;
	static extensionName = 'pasteRule';
	get name() {
		return PasteRuleExtension.extensionName;
	}

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
