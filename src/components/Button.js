import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 8px;
  margin: 4px;
  text-transform: uppercase;
  font-size: 15px;
  border: none;
  border-radius: 15px;
  background-color: ${props => props.color || 'dodgerblue'};
  color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  
  :first-child {
    margin-left: 0;
  }
  
  :last-child {
    margin-right: 0;
  }
`;

export class Button extends React.Component {
    render() {
        return (
            <StyledButton color={this.props.color} onClick={this.props.onClick}>{this.props.label}</StyledButton>
        );
    }
}