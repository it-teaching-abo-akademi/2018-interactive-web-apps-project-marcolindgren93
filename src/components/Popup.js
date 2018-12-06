import React from 'react';
import styled from 'styled-components';

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
`;

const PopupWindow = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 10px;
  background-color: white;
`;

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