import { NodeSpec } from 'prosemirror-model';
import { NodeExtension } from '../..';

class ParagraphExtension extends NodeExtension {
	get name() {
		return 'paragraph' as const;
	}

	createNodeSpec(): NodeSpec {
		throw new Error('Method not implemented.');
	}
}

export default ParagraphExtension;
