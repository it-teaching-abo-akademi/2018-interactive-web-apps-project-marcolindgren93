import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { Popup } from "./Popup";
import { ButtonWrapper } from "./Portfolio";

const PopupInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 150px;
`;

const StyledInput = styled.input`
  font-size: 15px;
  height: 30px;
  width: 300px;
`;

/* A generic text input popup */
/*  Props:
 *  labelText - The heading text of the popup
 *  submitText - The text on the Submit button. If not set, it says "Submit"
 *  maxLength - optional maximum length for the input string
 *  onSubmit - The action to be taken when the submit button is pressed. Preferably something that handles the input string
 *  onClose - What should happen when the close button is pressed. Preferably something that closes the popup
 */
export class PopupInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputStr: "", // Contains the inputted string
        };
    }

    componentDidMount() {
        this.input.focus(); // Set the focus on the input field when the component mounts
    }

    render() {
        return (
            <Popup>
                <PopupInputWrapper>
                    {this.props.labelText}
                    <StyledInput type="text" ref={(input) => this.input = input} value={this.state.inputStr} maxLength={this.props.maxLength} onChange={event => this.handleInput(event)} />
                    <ButtonWrapper>
                        <Button label={this.props.submitText || "Submit"} onClick={() => this.handleSubmit()} disabled={!this.state.inputStr} />
                        <Button label="Cancel" color="crimson" onClick={this.props.onClose} />
                    </ButtonWrapper>
                </PopupInputWrapper>
            </Popup>
        );
    }

    // Sets the inputStr state variable to the text in the input box
    handleInput(event) {
        this.setState({inputStr: event.target.value});
    }

    // Executes the onSubmit prop function followed by the onClose function
    handleSubmit() {
        this.props.onSubmit(this.state.inputStr);
        this.props.onClose();
    }
}