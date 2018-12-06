import React from 'react';
import styled from 'styled-components';
import { Button } from "./Button";
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
      portfolios: JSON.parse(localStorage.getItem("portfolios")) || []
    };

    this.togglePopup = this.togglePopup.bind(this);
    this.removePortfolio = this.removePortfolio.bind(this);
  }

  render() {
    return (
      <AppWrapper>
        <Button label="Add new portfolio" onClick={() => this.newPortfolio()} />
          <PortfolioWrapper>
            {Object.keys(this.state.portfolios).map(key => (
              <Portfolio key={key} index={key} portfolio={this.state.portfolios[key]} onDelete={this.removePortfolio} />
            ))}
          </PortfolioWrapper>
      </AppWrapper>
    );
  }

  togglePopup() {
    this.setState({isPopupOpen: !this.state.isPopupOpen})
  }

  newPortfolio() {
    if (this.state.portfolios.length < 10) {
      const newPortfolios = this.state.portfolios.concat([{}]);
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
}
