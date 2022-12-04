import { gapCursor } from 'prosemirror-gapcursor';
import { Plugin } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('gap_cursor')
class GapCursorExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		return gapCursor();
	}
}

export default GapCursorExtension;
