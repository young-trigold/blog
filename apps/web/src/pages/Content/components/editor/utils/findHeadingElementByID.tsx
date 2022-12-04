import { MaxHeadingLevel } from '../schema/nodes';

const findHeadingElementById = (headingId: string) => {
  const allHeadingElements = Array.from<HTMLHeadingElement>({ length: MaxHeadingLevel }).reduce(
    (result, _, i) => {
      const headingElements = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(`h${i + 1}`),
      );
      return result.concat(headingElements);
    },
    [] as HTMLHeadingElement[],
  );

  const currentHeadingElement = allHeadingElements.find(
    (headingElement) => headingElement.getAttribute('data-heading-id') === headingId,
  );

  return currentHeadingElement;
};

export default findHeadingElementById;
