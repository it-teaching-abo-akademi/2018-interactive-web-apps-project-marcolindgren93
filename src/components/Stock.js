import * as React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { CheckBox } from "./CheckBox";
import { LoadingSpinner } from "./LoadingSpinner";
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
            valueError: null,
            valueIsLoaded: false,
        };

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        if (this.props.value === 0) {
            this.fetchData();
        }
        else {
            this.setState({valueIsLoaded: true});
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quantity !== this.props.quantity) {
            this.resetState();
        }
    }

    render() {
        let exchange = 1;
        if (this.props.currency === "EUR" && !!this.props.exchangeRate) {
            exchange = this.props.exchangeRate;
        }
        return (
            <StyledTableRow>
                <StyledTableData>{this.props.name}</StyledTableData>
                <StyledTableData>
                    {!this.state.valueIsLoaded ? <LoadingSpinner size="10px"/> :
                        <span>{this.props.currency === "USD" && "$"}{Math.round(this.props.value*exchange*100)/100}{this.props.currency === "EUR" && "€"}</span>
                    }&nbsp;
                    <Button label="&#8635;" color="springgreen" onClick={this.fetchData} tiny={true} />&nbsp;
                    {!!this.state.valueError && this.state.valueError.message}
                </StyledTableData>
                <StyledTableData>
                    <QuantityInput type="number" value={this.state.inputNum} min={0} onChange={event => this.handleInput(event)} />
                </StyledTableData>
                <StyledTableData>
                    {!this.state.valueIsLoaded ? <LoadingSpinner size="10px"/> :
                        <span>{this.props.currency === "USD" && "$"}{Math.round(this.props.value*this.state.inputNum*exchange*100)/100}{this.props.currency === "EUR" && "€"}</span>
                    }
                </StyledTableData>
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

    fetchData() {
        this.setState({valueError: null, valueIsLoaded: false})
        fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + this.props.name + "&apikey=" + process.env.REACT_APP_ALPHA_VANTAGE_API_KEY)
            .then(response => response.json())
            .then(
                result => {
                    if ("Error Message" in result) {
                        this.setState({valueIsLoaded: true, valueError: {message: "Invalid symbol"}});
                    } else if ("Note" in result) {
                        this.setState({valueIsLoaded: true, valueError: {message: "API call limit reached"}});
                    } else {
                        this.setState({valueIsLoaded: true});
                        this.props.onUpdateValue(this.props.index, result["Global Quote"]["05. price"]);
                    }
                },
                error => {
                    this.setState({valueIsLoaded: true, valueError: error});
                }
            );
    }
}