import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
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
        };

        this.toggleGraphPopup = this.toggleGraphPopup.bind(this);
        this.toggleInputPopup = this.toggleInputPopup.bind(this);
        this.newStock = this.newStock.bind(this);
        this.updateStockQuantity = this.updateStockQuantity.bind(this);
        this.toggleSelect = this.toggleSelect.bind(this);
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
                <StockTable>
                    {Object.keys(this.state.stocks).map(key => (
                        <Stock
                            key={key}
                            index={key}
                            name={this.state.stocks[key].symbol}
                            value={3}
                            quantity={this.state.stocks[key].quantity}
                            selected={this.state.selectedStocks.includes(key)}
                            onSelect={this.toggleSelect}
                            onUpdateQuantity={this.updateStockQuantity}
                        />
                    ))}
                </StockTable>
                <ButtonWrapper>
                    <Button label="Add Stock" onClick={this.toggleInputPopup} disabled={this.state.stocks.length >= 50} />
                    <Button label="Remove selected" onClick={() => undefined} disabled={this.state.selectedStocks.length === 0} />
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
                    maxLength="4"
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
            const newStocks = this.state.stocks.concat([{symbol: symbol.toUpperCase(), quantity: 1}]);
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

    resetState() {
        this.setState({stocks: this.props.portfolio.stocks, selectedStocks: [],});
    }
}