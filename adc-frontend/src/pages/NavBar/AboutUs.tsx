import styled from 'styled-components';

const PageContainer = styled.div`
  padding-left: 2rem;
  padding-top:1rem;
  margin-top: 6rem;
  margin-bottom: 4rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const TextContainer = styled.div`
  flex: 1 1;
  padding-top: 2rem;
  padding-left: 10rem;
  overflow: auto;
`;

const ImageContainer = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 8rem;
  margin-top: -5.5rem;
  margin-bottom: 8rem;
`;

const H1 = styled.h1`
  user-select: none;
  color: var(--federal-blue);
  font-weight: bolder;
  font-size: 3rem;
`;

const H3 = styled.h1`
  padding-top: 3rem;
  padding-left: 2rem;
  user-select: none;
  color: var(--federal-blue);
  font-weight: bolder;
  font-size: 1.5rem;
`;

const GreenSpan = styled.span`
  color: var(--green);
`;

const StyledImage = styled.img`
  border-radius: 310px;
`;

const StyledList = styled.ul`
  list-style: none;
`;

const StyledListItem = styled.li`
  &::before {
    content: "•";
    color: var(--green);
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
  color: var(--federal-blue);
`;

const src = "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/pegadas.jpg";
export default function AboutUs() {
  return (
    <>
    <PageContainer>
      <ContentContainer>
        <TextContainer>
          <H1>Quem Somos <GreenSpan>?</GreenSpan></H1>
          <p>Bem-vindo à <GreenSpan>Treap</GreenSpan>, onde cada escolha faz a diferença!</p>
          <p> A nossa missão, juntamente contigo, é reduzir a pegada de carbono por meio de escolhas diárias conscientes e divertidas. </p>
          <H3>A Nossa Visão</H3>
          <p>Vivemos num mundo onde as mudanças climáticas são uma realidade crescente, e acreditamos que a mais pequena ação individual
             pode ter um impacto significativo no combate a este desafio global.</p>
          <p>Queremos inspirar uma comunidade global a tomar decisões ecológicas e a adotar práticas sustentáveis, tornando isso numa 
            experiência positiva e recompensadora.</p>
            <H3>Como Funciona<GreenSpan>?</GreenSpan></H3>
            <p>Na <GreenSpan>Treap</GreenSpan>, transformamos a jornada para a sustentabilidade num jogo interativo e envolvente. Eis como podes começar a fazer a diferença:</p>
            <StyledList>
              <StyledListItem>Regista as tuas viagens</StyledListItem>
              <StyledListItem>Acumula pontos e sobe de nível</StyledListItem>
              <StyledListItem>Sobe de Ranking</StyledListItem>
              <StyledListItem>Junta-te a Comunidades</StyledListItem>
              <StyledListItem>Explora a Nossa Loja</StyledListItem>
              <StyledListItem>Utiliza os teus pontos na Loja</StyledListItem>
            </StyledList>
        </TextContainer>
        <ImageContainer>
          <StyledImage src= {src} alt="AboutUs" width={400}/>
        </ImageContainer>
      </ContentContainer>
    </PageContainer>
    </>
  )
}