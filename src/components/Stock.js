import * as React from "react";
import { toast } from "react-toastify";
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

/* A component for displaying the stock data in a table */
/*  Props:
 *  index - The current index of a stock in a Portfolio
 *  name - The symbol of the stock
 *  value - The value of the stock from the object data
 *  quantity - The number of shares in the stock
 *  currency - The currency of the Portfolio
 *  exchangeRate - The exchange rate from App
 *  selected - Whether the stock has been selected or not
 *  onSelect - What happens when the stock has been selected
 *  onUpdateQuantity - What happens in Portfolio when the share quantity is updated
 *  onUpdateValue - What happens in Portfolio when the value of the stock is updated
 */
export class Stock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputNum: this.props.quantity, // The quantity input number
            valueIsLoaded: false, // True if the API fetch is completed, false while it isn't
        };

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        if (this.props.value === 0) {
            this.fetchData(); // Only fetch the data if it hasn't been fetched.
        }
        else {
            this.setState({valueIsLoaded: true});
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quantity !== this.props.quantity) {
            this.resetState(); // Reset state if the stock quantity doesn't match (When a Portfolio is removed)
        }
    }

    render() {
        let exchange = 1;
        if (this.props.currency === "EUR" && !!this.props.exchangeRate) {
            exchange = this.props.exchangeRate; // If the exchange rate exists and is set to EUR, use that
        }
        return (
            <StyledTableRow>
                <StyledTableData>{this.props.name}</StyledTableData>
                <StyledTableData>
                    {!this.state.valueIsLoaded ? <LoadingSpinner size="10px"/> :
                        <span>{this.props.currency === "USD" && "$"}{Math.round(this.props.value*exchange*100)/100}{this.props.currency === "EUR" && "€"}</span>
                    }&nbsp;
                    <Button label="&nbsp;&#8635;&nbsp;" color="springgreen" onClick={() => this.fetchData()} tiny={true} />
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

    // Called when the quantity input is updated
    handleInput(event) {
        this.setState({inputNum: event.target.value});
        this.props.onUpdateQuantity(this.props.index, event.target.value)
    }

    // Resets the quantity from the props
    resetState() {
        this.setState({inputNum: this.props.quantity});
    }

    // Fetches the current value of the stock using the Alpha Vantage API. Called when the Stock mounts (if necessary) or when the refresh button is pressed
    fetchData() {
        this.setState({valueIsLoaded: false});
        fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + this.props.name + "&apikey=" + process.env.REACT_APP_ALPHA_VANTAGE_API_KEY)
            .then(response => response.json())
            .then(
                result => {
                    if (!result["Global Quote"]) { // This key doesn't appear in the result JSON when an invalid symbol is given
                        this.setState({valueIsLoaded: true});
                        toast.error("Invalid symbol!"); // Fire an error toast (uses the external library react-toastify)
                    } else if ("Note" in result) { // This key only appears in the result JSON when the API limit has been reached. The limit is five requests per minute and 500 per day.
                        this.setState({valueIsLoaded: true});
                        toast.error("API call limit reached. Please wait a minute and try again.");
                    } else {
                        this.setState({valueIsLoaded: true});
                        this.props.onUpdateValue(this.props.index, result["Global Quote"]["05. price"]);
                    }
                },
                error => {
                    this.setState({valueIsLoaded: true});
                    toast.error(error);
                }
            );
    }
}