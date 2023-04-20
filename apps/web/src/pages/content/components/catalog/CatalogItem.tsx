import styled from 'styled-components';

import findHeadingElementById from '../editor/utils/findHeadingElementById';

interface StyledCatalogItemProps {
  level: number;
  isCurrent: boolean;
}

const StyledCatalogItem = styled.div<StyledCatalogItemProps>`
  position: relative;
  margin: 3px ${(props) => `${(props.level - 1) * 1.5}em`};
  padding-left: 1em;
  margin-right: 0;
  color: ${(props) => (props.isCurrent ? props.theme.primaryColor : 'inherit')};
  transition: ${(props) => props.theme.transition};
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::before {
    display: block;
    position: absolute;
    transform-origin: 0 0;
    transform: translateX(-1em) ${(props) => (props.isCurrent ? '' : 'scaleY(0)')};
    content: '';
    width: 5px;
    height: 1.2em;
    border-radius: 4px;
    background-color: ${(props) => props.theme.primaryColor};
    transition: ${(props) => props.theme.transition};
  }

  &:active {
    color: ${(props) => props.theme.activeColor};
  }

  &:hover {
    color: ${(props) => props.theme.hoverColor};
  }
`;

interface CatalogItemProps {
  content: string;
  level: number;
  isCurrent: boolean;
  headingId: string;
}

export const CatalogItem: React.FC<CatalogItemProps> = (props) => {
  const { isCurrent, content, level, headingId  } = props;

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    const currentHeadingElement = findHeadingElementById(headingId);
    currentHeadingElement?.scrollIntoView();
  };

  return (
    <StyledCatalogItem isCurrent={isCurrent} level={level} onClick={onClick}>
      {content}
    </StyledCatalogItem>
  );
};
