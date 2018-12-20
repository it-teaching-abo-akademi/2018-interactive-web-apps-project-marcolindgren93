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

export class Portfolio extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isGraphOpen: false,
            isInputOpen: false,
            stocks: this.props.portfolio.stocks,
            selectedStocks: [],
            currency: "USD",
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
            this.resetState();
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
                    <Button label="Show in €" onClick={this.setEUR} disabled={this.state.currency === "EUR" || !this.props.exchangeIsLoaded || !!this.props.exchangeError} />
                    {!this.props.exchangeIsLoaded && <LoadingSpinner size="33px" />}
                    {!!this.props.exchangeError && this.props.exchangeError.message}
                    <Button label="Show in $" onClick={this.setUSD} disabled={this.state.currency === "USD" || !this.props.exchangeIsLoaded || !!this.props.exchangeError} />
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
                    <Button label="Add Stock" onClick={this.toggleInputPopup} disabled={this.state.stocks.length >= 50} />
                    <Button label="Remove selected" onClick={this.removeStocks} disabled={this.state.selectedStocks.length === 0} />
                </ButtonWrapper>

                {this.state.isGraphOpen &&
                <PopupGraph
                    name={name}
                    onClose={this.toggleGraphPopup}
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

    toggleGraphPopup() {
        this.setState({isGraphOpen: !this.state.isGraphOpen})
    }

    toggleInputPopup() {
        this.setState({isInputOpen: !this.state.isInputOpen})
    }

    newStock(symbol) {
        if (this.state.stocks.length < 50 && symbol) {
            const newStocks = this.state.stocks.concat([{symbol: symbol.toUpperCase(), quantity: 1, value: 0}]);
            this.setState({stocks: newStocks});
            this.props.onUpdateStocks(this.props.index, newStocks);
        }
    }

    updateStockQuantity(index, newQuantity) {
        if (parseInt(index) >= 0) {
            const newStocks = this.state.stocks;
            newStocks[index].quantity = newQuantity;
            this.setState({stocks: newStocks});
            this.props.onUpdateStocks(this.props.index, newStocks);
        }
    }

    updateStockValue(index, newValue) {
        if (parseInt(index) >= 0) {
            const newStocks = this.state.stocks;
            newStocks[index].value = newValue;
            this.setState({stocks: newStocks});
            this.props.onUpdateStocks(this.props.index, newStocks);
        }
    }

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

    removeStocks() {
        const selected = this.state.selectedStocks;
        const newStocks = this.state.stocks;
        console.log(newStocks);
        let i = 0;
        let lastIndex = 50;
        for (const stockNum of selected) {
            const index = parseInt(stockNum);
            console.log(lastIndex >= index ? index : index-i);
            newStocks.splice(lastIndex >= index ? index : index-i, 1);
            i++;
            lastIndex = index;
        }
        console.log(newStocks);
        this.setState({stocks: newStocks, selectedStocks: []});
        this.props.onUpdateStocks(this.props.index, newStocks);
    }

    resetState() {
        this.setState({stocks: this.props.portfolio.stocks, selectedStocks: [],});
    }

    setEUR() {
        this.setState({currency: "EUR"});
    }

    setUSD() {
        this.setState({currency: "USD"})
    }
}