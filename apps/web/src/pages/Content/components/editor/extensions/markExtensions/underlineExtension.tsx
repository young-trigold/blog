import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';
import markInputRule from '../../utils/markInputRule';

class UnderlineExtension extends MarkExtension {
	static extensionName = 'underline';

  get name() {
    return UnderlineExtension.extensionName;
  }

	editorStore: EditorStore | null = null;

	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const underlineMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'u',
				},
			],
			toDOM() {
				return ['u', 0];
			},
		};

		return underlineMarkSpec;
	}
}

export default UnderlineExtension;
