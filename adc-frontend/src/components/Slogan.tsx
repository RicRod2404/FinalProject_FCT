import styled from "styled-components";

const H1 = styled.h1`
  user-select: none;
  padding-top: 2rem;
  color: var(--federal-blue);
  font-weight: bolder;
  font-size: 4rem;
`;

const GreenSpan = styled.span`
  color: var(--green);
`;
const VeronicaSpan = styled.span`
  color: var(--veronica);
`;
export default function Slogan() {
  return (
    <H1>
      Faz a tua <GreenSpan>Escolha!</GreenSpan>{" "}
      <VeronicaSpan>Segue</VeronicaSpan> a tua <GreenSpan>Treap</GreenSpan>.
    </H1>
  );
}
