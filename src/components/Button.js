import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: ${props => props.tiny ? "2px" : "8px"};
  text-transform: uppercase;
  font-size: ${props => props.tiny ? "10px" : "15px"};
  border: none;
  border-radius: 15px;
  background-color: ${props => props.disabled ? 'gainsboro' : (props.color || 'dodgerblue')};
  color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

export class Button extends React.Component {
    render() {
        return (
            <StyledButton tiny={this.props.tiny} disabled={this.props.disabled} color={this.props.color} onClick={this.props.disabled ? () => undefined : this.props.onClick}>{this.props.label}</StyledButton>
        );
    }
}