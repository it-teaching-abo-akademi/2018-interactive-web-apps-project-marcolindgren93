import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { Popup } from "./Popup";

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

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
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
                    <StyledInput ref={(input) => this.input = input} value={this.state.inputStr} maxLength={this.props.maxLength} onChange={event => this.handleInput(event)} />
                    <ButtonWrapper>
                        <Button label={this.props.submitText || "Submit"} onClick={() => this.handleSubmit()} />
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