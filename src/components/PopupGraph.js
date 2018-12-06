import React from 'react';
import { Button } from "./Button";
import { Popup } from "./Popup";

export class PopupGraph extends React.Component {
    render() {
        return (
            <Popup>
                {this.props.name} <Button label="Close" onClick={this.props.onClose}/>
            </Popup>
        );
    }
}