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

export class PopupInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputStr: "",
        };
    }

    componentDidMount() {
        this.input.focus();
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

    handleInput(event) {
        this.setState({inputStr: event.target.value});
    }

    handleSubmit() {
        this.props.onSubmit(this.state.inputStr);
        this.props.onClose();
    }
}