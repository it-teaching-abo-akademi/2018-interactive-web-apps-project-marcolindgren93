import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Button } from "./Button";
import { PopupInput } from "./PopupInput";
import { Portfolio } from "./Portfolio";

/* These two constants are styled components */
/* They use the library "styled-components" to insert CSS into individual component pieces. */
/* This means we don't need to assign classes or clunky, monolithic CSS files. We can use these similarly to React components instead. */
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

/* This is the main App component of the site. It takes care of the local storage and lays down the basic groundwork. */
export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPopupOpen: false, // Keeps track of the "Add new portfolio" popup.
      portfolios: JSON.parse(localStorage.getItem("portfolios")) || [], // These are all the portfolios of the program. If none are found in the local storage at startup, we have an empty array instead.
      exchangeIsLoaded: false, // False while the api is being called, true when it's not
      exchangeRate: -1, // If this value is negative, the exchange rate api call hasn't returned anything (yet or at all)
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
    // Details of each component and their props are in their respective files.
    return (
      <AppWrapper>
        <ToastContainer position="top-center" /> {/* This component is needed for toasts made with react-toastify */}
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

  // Toggles the isPopupOpen state variable between true and false.
  togglePopup() {
    this.setState({isPopupOpen: !this.state.isPopupOpen})
  }

  // Adds a new portfolio with a specified name to the portfolios.
  newPortfolio(name) {
    if (this.state.portfolios.length < 10) {
      const newPortfolios = this.state.portfolios.concat([{name: name || "", stocks: []}]);
      this.setState({portfolios: newPortfolios});
      localStorage.setItem("portfolios", JSON.stringify(newPortfolios));
    }
  }

  // Removes the portfolio with the given index from the portfolio array. Passed to and called from the Portfolio components
  removePortfolio(index) {
    if (parseInt(index) >= 0) {
      let newPortfolios = this.state.portfolios;
      newPortfolios.splice(index, 1);
      this.setState({portfolios: newPortfolios});
      localStorage.setItem("portfolios", JSON.stringify(newPortfolios));
    }
  }

  // Update the stocks of a portfolio. Passed to and called from the Portfolio components
  updateStocks(index, newStocks) {
    if (parseInt(index) >= 0) {
      const newPortfolios = this.state.portfolios;
      newPortfolios[index].stocks = newStocks;
      this.setState({portfolios: newPortfolios});
      localStorage.setItem("portfolios", JSON.stringify(newPortfolios));
    }
  }

  // Fetches the current USD->EUR exchange rate using the Alpha Vantage API. Called when the App mounts or from a Portfolio if the API fetch failed.
  fetchExchange() {
      this.setState({exchangeIsLoaded: false});
      fetch("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey="+process.env.REACT_APP_ALPHA_VANTAGE_API_KEY)
          .then(response => response.json()) // Get the API response JSON
          .then(
              result => {
                  if ("Error Message" in result) { // This key only appears in the result JSON when an invalid symbol is given
                      this.setState({exchangeIsLoaded: true});
                      toast.error("Invalid symbol!"); // Fire an error toast (uses the external library react-toastify)
                  } else if ("Note" in result) { // This key only appears in the result JSON when the API limit has been reached. The limit is five requests per minute and 500 per day.
                      this.setState({exchangeIsLoaded: true});
                      toast.error("API limit reached. Please wait a minute and try again.");
                  } else {
                      this.setState({exchangeIsLoaded: true, exchangeRate: result["Realtime Currency Exchange Rate"]["5. Exchange Rate"]}); // Set the exchange rate to the one from AV
                  }
              },
              error => {
                  this.setState({exchangeIsLoaded: true});
                  toast.error(error);
              }
          );
  }
}
