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

/* A generic checkbox component. Its state is handled in its parent. */
/*  Props:
 *  checked - If this is true the checkbox is checked, otherwise it's unchecked
 *  onClick - Takes a function that the checkbox should execute once clicked. Preferably something that changes the checked state in the parent
 */
export class CheckBox extends React.Component {
    render() {
        return (
            <CheckBoxButton checked={this.props.checked} onClick={this.props.onClick} />
        );
    }
}