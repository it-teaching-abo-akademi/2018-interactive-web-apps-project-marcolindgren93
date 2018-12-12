import React from "react";
import styled from "styled-components";

const CheckBoxButton = styled.button`
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 15px;
  box-shadow: ${props => props.checked ? '' : 'inset'} 1px 1px 5px rgba(0, 0, 0, 0.4);
  background-color: ${props => props.checked ? 'orange' : 'transparent'};
`;

export class CheckBox extends React.Component {
    render() {
        return (
            <CheckBoxButton checked={this.props.checked} onClick={this.props.onClick} />
        );
    }
}