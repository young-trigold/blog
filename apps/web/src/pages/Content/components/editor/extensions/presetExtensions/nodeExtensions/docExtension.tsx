import { NodeSpec } from 'prosemirror-model';
import { NodeExtension } from '../..';

class DocExtension extends NodeExtension {
	get name() {
		return 'doc' as const;
	}

	createNodeSpec(): NodeSpec {
		throw new Error('Method not implemented.');
	}
}

export default DocExtension;
