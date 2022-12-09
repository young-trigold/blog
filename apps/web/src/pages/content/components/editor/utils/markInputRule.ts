import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

const markInputRule = (
	regexp: RegExp,
	markType: MarkType,
	getAttrs?: { [key: string]: any } | ((p: string[]) => { [key: string]: any } | null | undefined),
) => {
	return new InputRule(regexp, (state, match, start, end) => {
		const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
		const { tr } = state;
		if (match[1]) {
			const textStart = start + match[0].indexOf(match[1]);
			const textEnd = textStart + match[1].length;
			if (textEnd < end) {
				tr.delete(textEnd, end);
			}
			if (textStart > start) {
				tr.delete(start, textStart);
			}
			end = start + match[1].length;
		}
		return tr.addMark(start, end, markType.create(attrs || {}));
	});
};

// export function markInputRule(props: MarkInputRuleProps): SkippableInputRule {
//   const {
//     regexp,
//     type,
//     getAttributes,
//     ignoreWhitespace = false,
//     beforeDispatch,
//     updateCaptured,
//     shouldSkip,
//     invalidMarks,
//   } = props;

//   let markType: MarkType | undefined;

//   const rule: SkippableInputRule = new InputRule(regexp, (state, match, start, end) => {
//     const { tr, schema } = state;

//     if (!markType) {
//       markType = isString(type) ? schema.marks[type] : type;

//       invariant(markType, {
//         code: ErrorConstant.SCHEMA,
//         message: `Mark type: ${type} does not exist on the current schema.`,
//       });
//     }

//     let captureGroup: string | undefined = match[1];
//     let fullMatch = match[0];

//     // These are the attributes which are added to the mark and they can be
//     // obtained from the match if a function is provided.
//     const details = gatherDetails({
//       captureGroup,
//       fullMatch,
//       end,
//       start,
//       rule,
//       state,
//       ignoreWhitespace,
//       invalidMarks,
//       shouldSkip,
//       updateCaptured,
//     });

//     if (!details) {
//       return null;
//     }

//     ({ start, end, captureGroup, fullMatch } = details);

//     const attributes = isFunction(getAttributes) ? getAttributes(match) : getAttributes;
//     let markEnd = end;
//     let initialStoredMarks: readonly Mark[] = [];

//     if (captureGroup) {
//       const startSpaces = fullMatch.search(/\S/);
//       const textStart = start + fullMatch.indexOf(captureGroup);
//       const textEnd = textStart + captureGroup.length;

//       initialStoredMarks = tr.storedMarks ?? [];

//       if (textEnd < end) {
//         tr.delete(textEnd, end);
//       }

//       if (textStart > start) {
//         tr.delete(start + startSpaces, textStart);
//       }

//       markEnd = start + startSpaces + captureGroup.length;
//     }

//     tr.addMark(start, markEnd, markType.create(attributes));

//     // Make sure not to reactivate any marks which had previously been
//     // deactivated. By keeping track of the initial stored marks we are able to
//     // discard any unintended consequences of deleting text and adding it again.
//     tr.setStoredMarks(initialStoredMarks);

//     // Allow the caller of this method to update the transaction before it is
//     // returned and dispatched by ProseMirror.
//     beforeDispatch?.({ tr, match, start, end });

//     return tr;
//   });

//   return rule;
// }

export default markInputRule;
