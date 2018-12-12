import * as React from "react";
import styled from "styled-components";
import { CheckBox } from "./CheckBox";
import { StyledTableData, StyledTableRow } from "./StockTable";


const QuantityInput = styled.input`
  width: 56px;
  font-size: 10px;
  height: 20px;
`;

export class Stock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputNum: this.props.quantity,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quantity !== this.props.quantity) {
            this.resetState();
        }
    }

    render() {
        return (
            <StyledTableRow>
                <StyledTableData>{this.props.name}</StyledTableData>
                <StyledTableData>{this.props.value}</StyledTableData>
                <StyledTableData>
                    <QuantityInput type="number" value={this.state.inputNum} min={0} onChange={event => this.handleInput(event)} />
                </StyledTableData>
                <StyledTableData>{this.props.value*this.state.inputNum}</StyledTableData>
                <StyledTableData style={{textAlign: 'center'}}>
                    <CheckBox checked={this.props.selected} onClick={() => this.props.onSelect(this.props.index)} />
                </StyledTableData>
            </StyledTableRow>
        );
    }

    handleInput(event) {
        this.setState({inputNum: event.target.value});
        this.props.onUpdateQuantity(this.props.index, event.target.value)
    }

    resetState() {
        this.setState({inputNum: this.props.quantity});
    }
}