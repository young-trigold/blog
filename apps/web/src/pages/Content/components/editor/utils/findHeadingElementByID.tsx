import { MaxHeadingLevel } from '../schema/nodes';

const findHeadingElementByID = (headingID: string) => {
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
    (headingElement) => headingElement.getAttribute('heading-id') === headingID,
  );

  return currentHeadingElement;
};

export default findHeadingElementByID;
