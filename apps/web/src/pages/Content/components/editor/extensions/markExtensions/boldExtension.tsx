import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store';
import markInputRule from '../../utils/markInputRule';

class BoldExtension extends MarkExtension {
	static extensionName = 'bold';

  get name() {
    return BoldExtension.extensionName;
  }

	editorStore: EditorStore | null = null;

	createTags() {
		return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
	}

	createMarkSpec(): MarkSpec {
		const boldMarkSpec: MarkSpec = {
			parseDOM: [
				{
					tag: 'strong',
				},
				{
					tag: 'b',
				},
			],
			toDOM() {
				return ['strong', 0];
			},
		};

		return boldMarkSpec;
	}

	createInputRules(): InputRule[] {
		return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type)];
	}
}

export default BoldExtension;
