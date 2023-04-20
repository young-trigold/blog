import styled from 'styled-components';

import { useAppSelector } from '@/app/store';
import { HeadingExtension } from '../editor/extensions';
import { CatalogItem } from './CatalogItem';

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
  overflow: auto;
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

export const Catalog: React.FC = (props) => {
  // =============================== heading ===============================
  const { visible, headings, currentHeadingId, state } = useAppSelector((appState) => {
    const { catalog, editor } = appState.contentPage;
    const { visible, currentHeadingId } = catalog;
    const { state } = editor;
    const headings: HeadingInfo[] = [];
    state?.doc.content.forEach((node) => {
      if (node.type.name === HeadingExtension.extensionName) {
        const { headingId, level } = node.attrs;
        headings.push({ level, headingId, content: node.textContent });
      }
    });
    return { visible, headings, currentHeadingId, state };
  });

  return (
    <StyledCatalog catalogVisible={visible}>
      {headings
        .filter((heading) => Boolean(heading.content))
        .map((heading) => {
          const { headingId, level, content } = heading;
          return (
            <CatalogItem
              key={headingId}
              headingId={headingId}
              level={level}
              content={content}
              isCurrent={currentHeadingId === headingId}
            />
          );
        })}
    </StyledCatalog>
  );
};
