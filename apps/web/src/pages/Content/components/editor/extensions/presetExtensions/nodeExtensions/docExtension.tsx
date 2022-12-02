import { NodeSpec } from 'prosemirror-model';
import { extensionName, ExtensionTag, NodeExtension } from '../..';

@extensionName('doc')
class DocExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			content: `${ExtensionTag.Block}+`,
		};
	}
}

export default DocExtension;
