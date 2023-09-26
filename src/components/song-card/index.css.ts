import { styled } from "styled-vanilla-extract/qwik";

export const Container = styled.div`
  padding: 8px;
  display: flex;
  border: 2px solid transparent;

  &:hover{
    background-color: gray;
    border: 2px solid black;
  }
`;