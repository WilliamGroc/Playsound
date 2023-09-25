import { styled } from 'styled-vanilla-extract/qwik';

export const HeaderLink = styled.button`
  background-color: var(--color-primary);
  padding: 16px;
  border-radius: 0;
  color: white;
  
  &:hover{
    background-color: var(--color-secondary);
  }
  
  `;

export const Header = styled.header`
  background-color: var(--color-primary);
`;


export const Logo = styled.div`
  padding: 16px;
`;