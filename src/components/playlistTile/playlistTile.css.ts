import { styled } from "styled-vanilla-extract/qwik";

export const Tile = styled.div`
  border: 1px solid black;
  padding: 12px;
  height: 160px;
  width: 160px;
  display: flex;
  justify-content: center;
  background-color: blueviolet;
  cursor: pointer;

  &:hover{
    background-color: lightblue;
  } 
`;