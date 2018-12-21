import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Button } from "./Button";
import { PopupInput } from "./PopupInput";
import { Portfolio } from "./Portfolio";

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const PortfolioWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPopupOpen: false,
      portfolios: JSON.parse(localStorage.getItem("portfolios")) || [],
      exchangeIsLoaded: false,
      exchangeRate: -1,
    };

    this.newPortfolio = this.newPortfolio.bind(this);
    this.removePortfolio = this.removePortfolio.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.updateStocks = this.updateStocks.bind(this);
    this.fetchExchange = this.fetchExchange.bind(this);
  }

  componentDidMount() {
    this.fetchExchange();
  }

  render() {
    return (
      <AppWrapper>
        <ToastContainer position="top-center" />
        <Button label="Add new portfolio" onClick={() => this.togglePopup()} disabled={this.state.portfolios.length >= 10} />
        <PortfolioWrapper>
          {Object.keys(this.state.portfolios).map(key => (
            <Portfolio
              key={key}
              index={key}
              portfolio={this.state.portfolios[key]}
              onDelete={this.removePortfolio}
              onUpdateStocks={this.updateStocks}
              onReloadExchange={this.fetchExchange}
              exchangeIsLoaded={this.state.exchangeIsLoaded}
              exchangeRate={parseFloat(this.state.exchangeRate)}
            />
          ))}
        </PortfolioWrapper>

        {this.state.isPopupOpen &&
        <PopupInput
          labelText="Enter a name for your portfolio:"
          submitText="Add Portfolio"
          maxLength="16"
          onSubmit={this.newPortfolio}
          onClose={this.togglePopup}
        />}
      </AppWrapper>
    );
  }

  togglePopup() {
    this.setState({isPopupOpen: !this.state.isPopupOpen})
  }

  newPortfolio(name) {
    if (this.state.portfolios.length < 10) {
      const newPortfolios = this.state.portfolios.concat([{name: name || "", currency: "EUR", stocks: []}]);
      this.setState({portfolios: newPortfolios});
      localStorage.setItem("portfolios", JSON.stringify(newPortfolios));
    }
  }

  removePortfolio(index) {
    if (parseInt(index) >= 0) {
      let newPortfolios = this.state.portfolios;
      newPortfolios.splice(index, 1);
      this.setState({portfolios: newPortfolios});
      localStorage.setItem("portfolios", JSON.stringify(newPortfolios));
    }
  }

  updateStocks(index, newStocks) {
    if (parseInt(index) >= 0) {
      const newPortfolios = this.state.portfolios;
      newPortfolios[index].stocks = newStocks;
      this.setState({portfolios: newPortfolios});
      localStorage.setItem("portfolios", JSON.stringify(newPortfolios));
    }
  }

  fetchExchange() {
      this.setState({exchangeIsLoaded: false});
      fetch("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey="+process.env.REACT_APP_ALPHA_VANTAGE_API_KEY)
          .then(response => response.json())
          .then(
              result => {
                  if ("Error Message" in result) {
                      this.setState({exchangeIsLoaded: true});
                      toast.error("Invalid symbol!");
                  } else if ("Note" in result) {
                      this.setState({exchangeIsLoaded: true});
                      toast.error("API limit reached. Please wait a minute and try again.");
                  } else {
                      this.setState({exchangeIsLoaded: true, exchangeRate: result["Realtime Currency Exchange Rate"]["5. Exchange Rate"]});
                  }
              },
              error => {
                  this.setState({exchangeIsLoaded: true});
                  toast.error(error);
              }
          );
  }
}
