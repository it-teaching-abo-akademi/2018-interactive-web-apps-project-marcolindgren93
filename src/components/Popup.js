import React from "react";
import styled from "styled-components";

const PopupBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const PopupWindow = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
  z-index: 101;
`;

/* A generic popup wrapper component */
/* Makes sure the popup is drawn on top of everything else with a darkened background. Used in all popup windows. */
export class Popup extends React.Component {
    render() {
        return (
            <PopupBackground>
                <PopupWindow>
                    {this.props.children}
                </PopupWindow>
            </PopupBackground>
        );
    }
}