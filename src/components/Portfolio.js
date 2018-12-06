import React from 'react';
import styled from 'styled-components';
import { Button } from "./Button";
import { PopupGraph } from "./PopupGraph";

const PortfolioBox = styled.div`
  border: 1px solid black;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  max-width: 500px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

export class Portfolio extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPopupOpen: false,
        };

        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup() {
        this.setState({isPopupOpen: !this.state.isPopupOpen})
    }

    render() {
        const name = this.props.portfolio.name || "Portfolio "+(parseInt(this.props.index)+1);
        return (
            <PortfolioBox>
                {name} <Button label="Open popup" onClick={this.togglePopup} />
                {this.state.isPopupOpen && <PopupGraph name={name} onClose={this.togglePopup} />}
                <Button label="Delete" onClick={() => this.props.onDelete(this.props.index)} />
            </PortfolioBox>
        );
    }
}