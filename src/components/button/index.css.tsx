import { styled } from "styled-vanilla-extract/qwik";

export const Button = styled.button`
  background-color: var(--color-primary) !important;
  border-radius: 0px;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 15px 20px;
  text-align: center;
  font-size: 16px;

  &:hover{
    background-color: var(--color-secondary) !important;
  }
`;