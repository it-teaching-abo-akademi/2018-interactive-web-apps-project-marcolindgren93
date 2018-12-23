import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { PopupGraph } from "./PopupGraph";
import { PopupInput } from "./PopupInput";
import { Stock } from "./Stock";
import { StockTable } from "./StockTable";

const PortfolioBox = styled.div`
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  max-width: 800px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
  background-color: aliceblue;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

export const ExchangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 280px;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
`;

/* The portfolio component */
/*  Props:
 *  index - The current array index in App's portfolio array
 *  portfolio - The portfolio object that this component handles
 *  onDelete - What happens when the portfolio is deleted
 *  onUpdateStocks - The function that executes when stocks are updated
 *  onReloadExchange - The function that reloads the exchange rates in App
 *  exchangeIsLoaded - True if exchange rates are loaded, false if not
 *  exchangeRate - The loaded exchange rate
 */
export class Portfolio extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isGraphOpen: false, // If set to true, the performance graph popup is open, otherwise it isn't
            isInputOpen: false, // If set to true, the stock symbol input popup is open, otherwise not
            stocks: this.props.portfolio.stocks, // The array of stock objects in the portfolio
            selectedStocks: [], // Array of currently selected stocks' indices
            currency: "USD", // The selected currency. Defaults to USD as the API values are loaded in USD
        };

        this.toggleGraphPopup = this.toggleGraphPopup.bind(this);
        this.toggleInputPopup = this.toggleInputPopup.bind(this);
        this.newStock = this.newStock.bind(this);
        this.updateStockQuantity = this.updateStockQuantity.bind(this);
        this.updateStockValue = this.updateStockValue.bind(this);
        this.toggleSelect = this.toggleSelect.bind(this);
        this.removeStocks = this.removeStocks.bind(this);
        this.setEUR = this.setEUR.bind(this);
        this.setUSD = this.setUSD.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.portfolio !== this.props.portfolio) {
            this.resetState(); // If the portfolio object given by App changes, reset the state to display the correct stocks
        }
    }

    render() {
        const name = this.props.portfolio.name || "Portfolio "+(parseInt(this.props.index)+1);
        return (
            <PortfolioBox>
                <HeaderWrapper>
                    {name}
                    <Button label="&nbsp;X&nbsp;" color="crimson" onClick={() => this.props.onDelete(this.props.index)} />
                </HeaderWrapper>
                <ExchangeWrapper>
                    <Button label="Show in €" onClick={this.setEUR} disabled={this.props.exchangeRate === -1} />
                    {!this.props.exchangeIsLoaded && <LoadingSpinner size="33px" />}
                    {this.props.exchangeIsLoaded && this.props.exchangeRate === -1 && <Button label="&nbsp;&#8635;&nbsp;" onClick={this.props.onReloadExchange} color="springgreen" />}
                    <Button label="Show in $" onClick={this.setUSD} disabled={this.props.exchangeRate === -1} />
                </ExchangeWrapper>
                <StockTable>
                    {Object.keys(this.state.stocks).map(key => (
                        <Stock
                            key={key}
                            index={key}
                            name={this.state.stocks[key].symbol}
                            value={this.state.stocks[key].value}
                            quantity={this.state.stocks[key].quantity}
                            currency={this.state.currency}
                            exchangeRate={this.props.exchangeRate}
                            selected={this.state.selectedStocks.includes(key)}
                            onSelect={this.toggleSelect}
                            onUpdateQuantity={this.updateStockQuantity}
                            onUpdateValue={this.updateStockValue}
                        />
                    ))}
                </StockTable>
                <ButtonWrapper>
                    Total value of {this.props.portfolio.name}: {this.state.currency === "USD" && "$"}{this.calculateTotalValue()}{this.state.currency === "EUR" && "€"}
                </ButtonWrapper>
                <ButtonWrapper>
                    <Button label="Add Stock" onClick={this.toggleInputPopup} disabled={this.state.stocks.length >= 50} />
                    {/* Because of the Alpha Vantage API limitations, the performance graph has been set to only be openable when 1-3 stocks are selected. If the API didn't have limits this wouldn't be necessary */}
                    <Button label="Performance graph" onClick={this.toggleGraphPopup} disabled={this.state.selectedStocks.length < 1 || this.state.selectedStocks.length > 3} />
                    <Button label="Remove selected" onClick={this.removeStocks} disabled={this.state.selectedStocks.length === 0} />
                </ButtonWrapper>

                {this.state.isGraphOpen &&
                <PopupGraph
                    name={name}
                    onClose={this.toggleGraphPopup}
                    stocks={this.state.stocks.filter(stock => this.state.selectedStocks.includes(this.state.stocks.indexOf(stock).toString()))}
                />}
                {this.state.isInputOpen &&
                <PopupInput
                    labelText="Enter the symbol for your stock:"
                    submitText="Add Stock"
                    maxLength="5"
                    onSubmit={this.newStock}
                    onClose={this.toggleInputPopup}
                />}
            </PortfolioBox>
        );
    }

    // Toggles the performance graph popup state
    toggleGraphPopup() {
        this.setState({isGraphOpen: !this.state.isGraphOpen})
    }

    // Toggles the stock symbol input popup state
    toggleInputPopup() {
        this.setState({isInputOpen: !this.state.isInputOpen})
    }

    // Adds a stock to the portfolio and updates the stock in App to save it
    newStock(symbol) {
        if (this.state.stocks.length < 50 && symbol) {
            const newStocks = this.state.stocks.concat([{symbol: symbol.toUpperCase(), quantity: 1, value: 0}]);
            this.setState({stocks: newStocks});
            this.props.onUpdateStocks(this.props.index, newStocks);
        }
    }

    // Updates the number of stocks in the portfolio object in App
    updateStockQuantity(index, newQuantity) {
        if (parseInt(index) >= 0) {
            const newStocks = this.state.stocks;
            newStocks[index].quantity = newQuantity;
            this.setState({stocks: newStocks});
            this.props.onUpdateStocks(this.props.index, newStocks);
        }
    }

    // Updates the value of a Stock
    updateStockValue(index, newValue) {
        if (parseInt(index) >= 0) {
            const newStocks = this.state.stocks;
            newStocks[index].value = newValue;
            this.setState({stocks: newStocks});
            this.props.onUpdateStocks(this.props.index, newStocks);
        }
    }

    // Toggles a selected Stock in the selected stock index array
    toggleSelect(index) {
        if (parseInt(index) >= 0) {
            const stocks = this.state.selectedStocks;
            const i = stocks.indexOf(index);
            if (i > -1) {
                stocks.splice(i, 1);
            } else {
                stocks.push(index);
            }
            this.setState({selectedStocks: stocks});
        }
    }

    // Removes all selected stocks. Indices are corrected after every removal since they will change.
    removeStocks() {
        const selected = this.state.selectedStocks;
        const newStocks = this.state.stocks;
        let i = 0;
        let lastIndex = 50;
        for (const stockNum of selected) {
            const index = parseInt(stockNum);
            newStocks.splice(lastIndex >= index ? index : index-i, 1);
            i++;
            lastIndex = index;
        }
        this.setState({stocks: newStocks, selectedStocks: []});
        this.props.onUpdateStocks(this.props.index, newStocks);
    }

    // Reset the stock state
    resetState() {
        this.setState({stocks: this.props.portfolio.stocks, selectedStocks: [],});
    }

    // Set the currently displayed currency to euros
    setEUR() {
        this.setState({currency: "EUR"});
    }

    // Set the currently displayed currency to US dollars
    setUSD() {
        this.setState({currency: "USD"})
    }

    // Calculates the total value of the stocks in the portfolio
    calculateTotalValue() {
        let exchange = 1;
        if (this.state.currency === "EUR" && !!this.props.exchangeRate) {
            exchange = this.props.exchangeRate;
        }

        let totalValue = 0;
        for (const stock of this.state.stocks) {
            totalValue += stock.value*stock.quantity*exchange;
        }
        return Math.round(totalValue*100)/100;
    }
}