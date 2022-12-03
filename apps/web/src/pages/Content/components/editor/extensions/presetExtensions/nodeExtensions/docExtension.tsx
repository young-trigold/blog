import { NodeSpec } from 'prosemirror-model';
import { extensionName, ExtensionTag, NodeExtension } from '../../type';

@extensionName('doc')
class DocExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			content: `${ExtensionTag.Block}+`,
		};
	}
}

export default DocExtension;
