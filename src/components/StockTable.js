import * as React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  width: 100%;
  height: 200px;
  padding: 5px;
  overflow-y: auto;
  border-radius: 15px;
  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.4);
  position: relative;
  table-layout: fixed;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const StyledTableRow = styled.tr`
  height: 30px;
  position: relative;
  font-size: 10px;
  display: table-row;
  
  :hover {
    background-color: aliceblue;
  }
  
  :only-child {
    :hover {
      background-color: transparent;
    }
  }
`;

const StyledTableHeading = styled.th`
  text-align: left;
  border: 1px solid black;
  border-top: 0;
  
  :first-child {
    border-left: 0;
  }
  
  :last-child {
    border-right: 0;
  }
`;

const StyledTableBody = styled.tbody`
  width: 100%;
  max-height: 100px;
  overflow-y: scroll;
`;

export const StyledTableData = styled.td`
  text-align: left;
  border: 1px solid black;
  border-top: 0;
  border-bottom: 0;
  min-width: 56px;
  overflow: auto;
  word-wrap: break-word;
  
  :first-child {
    border-left: 0;
  }
  
  :last-child {
    border-right: 0;
  }
`;

export class StockTable extends React.Component {
    render() {
        // TODO: Replace table with divs, min-width: 56, flex: 1, overflow: hidden
        return (
            <TableWrapper>
                <StyledTable>
                    <thead>
                        <StyledTableRow>
                           <StyledTableHeading>Name</StyledTableHeading>
                           <StyledTableHeading>Unit value</StyledTableHeading>
                           <StyledTableHeading>Quantity</StyledTableHeading>
                           <StyledTableHeading>Total value</StyledTableHeading>
                           <StyledTableHeading>Select</StyledTableHeading>
                        </StyledTableRow>
                    </thead>
                    <StyledTableBody>
                        {this.props.children}
                    </StyledTableBody>
                </StyledTable>
            </TableWrapper>
        );
    }
}