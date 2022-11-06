import { PlainExtension } from '../extension';

class CommandExtension extends PlainExtension {
	get name() {
		return 'command' as const;
	}
}

export default CommandExtension;
