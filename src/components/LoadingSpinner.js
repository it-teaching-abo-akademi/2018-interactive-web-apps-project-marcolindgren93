import styled, { keyframes } from "styled-components";

const SpinAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: ${props => props.size ? props.size : "15px"};
  height: ${props => props.size ? props.size : "15px"};
  border: 4px solid rgba(0, 0, 0, 0.4);
  border-radius: 100%;
  border-bottom-color: black;
  animation: ${SpinAnimation} 1s ease-in-out infinite;
`;