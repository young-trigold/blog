import { HeaderHeight } from 'src/pages/components/Header';
import { MaxHeadingLevel } from '../schema/nodes';

const getCurrentHeadingID = (container: HTMLElement) => {
	const allHeadingElements = Array.from<HTMLHeadingElement>({ length: MaxHeadingLevel }).reduce(
		(result, _, i) => {
			const headingElements = Array.from(
				container.querySelectorAll<HTMLHeadingElement>(`h${i + 1}`),
			);
			return result.concat(headingElements);
		},
		[] as HTMLHeadingElement[],
	);

	if (allHeadingElements.length === 0) return;

	const headingElementToTopMap = new Map(
		allHeadingElements.map((headingElement) => [
			headingElement,
			headingElement.getBoundingClientRect().top,
		]),
	);

	const currentHeadingElement = [...headingElementToTopMap].sort(
		(a, b) => Math.abs(a[1] - HeaderHeight) - Math.abs(b[1] - HeaderHeight),
	)[0][0];
	const currentHeadingID = currentHeadingElement.getAttribute('heading-id')!;

	return currentHeadingID;
};

export default getCurrentHeadingID;
