import * as React from "react";
import styled from "styled-components";
import { StyledTableRow } from "./StockTable";

const StyledTableData = styled.td`
  text-align: left;
  border: 1px solid black;
  border-top: 0;
  border-bottom: 0;
  
  :first-child {
    border-left: 0;
  }
  
  :last-child {
    border-right: 0;
  }
`;

export class Stock extends React.Component {
    render() {
        return (
            <StyledTableRow>
                <StyledTableData>{this.props.name}</StyledTableData>
                <StyledTableData>{this.props.value}</StyledTableData>
                <StyledTableData>{this.props.quantity}</StyledTableData>
                <StyledTableData>{this.props.value*this.props.quantity}</StyledTableData>
                <StyledTableData>Select</StyledTableData>
            </StyledTableRow>
        );
    }
}