import styled from "styled-components";

// Definindo um estilo que aceita a largura como uma propriedade
const StyledLogo = styled.img`
  width: ${(props) =>
    props.width
      ? props.width
      : "80px"}; /* Define a largura baseada na prop 'width', caso não seja fornecida, usa 80px */
`;

// Componente Logo que usa o StyledLogo
export default function Logo({ width }: any) {
  // Recebe 'width' como propriedade
  const src = "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/logo.png";
  return <StyledLogo src={src} alt="logo" width={width} />; // Passa a prop 'width' para o StyledLogo
}
