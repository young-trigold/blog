import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCurrentHeadingId } from '@/app/store/pages/contentPage';
import { memo, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeadingExtension } from '../editor/extensions';
import findHeadingElementById from '../editor/utils/findHeadingElementById';
import CatalogItem from './CatalogItem';

export interface HeadingInfo {
  level: number;
  content: string;
  headingId: string;
}

interface StyledCatalogProps {
  catalogVisible: boolean;
}

const StyledCatalog = styled.div<StyledCatalogProps>`
  flex: 0 0 300px;
  max-height: 550px;
  background-color: ${(props) => props.theme.foregroundColor};
  border-radius: 6.4px;
  padding: 1em;
  user-select: none;
  position: sticky;
  transition: ${(props) => props.theme.transition};
  overflow-y: auto;
  margin: 0 1em;
  top: 2em;
  overscroll-behavior: contain;

  @media (max-width: 1014px) {
    z-index: 4;
    position: fixed;
    width: 300px;
    margin: unset;
    top: unset;
    bottom: 160px;
    right: 50%;
    max-height: 450px;
    transform: translate(50%, 0) ${(props) => (props.catalogVisible ? '' : 'scaleY(0)')};
    opacity: ${(props) => (props.catalogVisible ? 1 : 0)};
    background-color: ${(props) => props.theme.foregroundColor};
    box-shadow: ${(props) => `0 0 6px ${props.theme.shadowColor}`};
  }
`;

interface CatalogProps {}

export const Catalog: React.FC<CatalogProps> = (props) => {
  // =============================== heading ===============================
  const { visible, headings } = useAppSelector((appState) => {
    const { catalog, editor } = appState.contentPage;
    const { visible } = catalog;
    const { state } = editor;
    const headings: HeadingInfo[] = [];
    state?.doc.content.forEach((node) => {
      if (node.type.name === HeadingExtension.extensionName) {
        const { headingId, level } = node.attrs;
        headings.push({ level, headingId, content: node.textContent });
      }
    });
    return { visible, headings };
  });

  // const [first, setFirst] = useState(true);
	// useEffect(() => {
	// 	if (!new window.URL(window.location.href).searchParams.get('currentHeadingId') && first) {
	// 		if (headings.length) {
	// 			dispatch(setCurrentHeadingId(headings[0].headingId));
	// 			setFirst(false);
	// 		}
	// 	}
	// }, [headings]);

  // const dispatch = useAppDispatch();

  // const [currentHeadingIdSearchParam, setCurrentHeadingIdSearchParam] = useSearchParams();
  // const isFirstRef = useRef(true);

  // useEffect(() => {
  //   if (!isFirstRef.current) return;
  //   const initialHeadingIdFromURL = currentHeadingIdSearchParam.get('currentHeadingId');
  //   const currentHeadingElement = findHeadingElementById(initialHeadingIdFromURL ?? '');
  //   if (currentHeadingElement) {
  //     currentHeadingElement.scrollIntoView();
  //     isFirstRef.current = false;
  //     dispatch(setCurrentHeadingId(initialHeadingIdFromURL!));
  //   }
  // });

  useEffect(() => {

  }, []);

  return (
    <StyledCatalog catalogVisible={visible}>
      {headings
        .filter((heading) => heading.content)
        .map((heading) => (
          <CatalogItem heading={heading} key={heading.headingId} />
        ))}
    </StyledCatalog>
  );
};
