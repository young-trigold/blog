// @TODO
import styled from 'styled-components';

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  table-layout: fixed;

  & td,
  & th {
    padding: 8px;
  }

  & th {
    font-size: 18px;
    border-right: 1px solid ${(props) => props.theme.borderColor};
  }

  & th:last-of-type {
    border-right: 0;
  }

  & tr:nth-of-type(even) {
    background-color: ${(props) => props.theme.foregroundColor};
  }

  & tr {
    &:hover {
      background-color: ${(props) => props.theme.surfaceColor};
    }
  }

  & thead {
    position: sticky;
    top: 0;
    background-color: ${(props) => props.theme.foregroundColor};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
  }
`;

const StyledRow = styled.tr`
  margin: 0em 1em;
`;

export { StyledTable, StyledRow };

