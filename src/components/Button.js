import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 8px;
  text-transform: uppercase;
  font-size: 15px;
  border: none;
  border-radius: 15px;
  background-color: ${props => props.color || (props.disabled ? 'gainsboro' :'dodgerblue')};
  color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

export class Button extends React.Component {
    render() {
        return (
            <StyledButton disabled={this.props.disabled} color={this.props.color} onClick={this.props.disabled ? () => undefined : this.props.onClick}>{this.props.label}</StyledButton>
        );
    }
}