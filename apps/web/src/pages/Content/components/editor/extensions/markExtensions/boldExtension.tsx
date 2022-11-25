import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { ExtensionTag, MarkExtension } from '..';
import EditorStore from '../../store/EditorStore';
import markInputRule from '../../utils/markInputRule';

class BoldExtension extends MarkExtension {
	editorStore: EditorStore | null = null;

	get name() {
		return 'bold' as const;
	}

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
