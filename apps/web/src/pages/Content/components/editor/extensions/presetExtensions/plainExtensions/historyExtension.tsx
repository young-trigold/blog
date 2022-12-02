import { history } from "prosemirror-history";
import { Plugin } from "prosemirror-state";
import { extensionName, PlainExtension } from "../..";

@extensionName('history')
class HistoryExtension extends PlainExtension {
	createPlugin(): void | Plugin<any> {
		return history();
	}
}

export default HistoryExtension;
