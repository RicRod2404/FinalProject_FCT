import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonWalking, faShoePrints, faLeaf } from "@fortawesome/free-solid-svg-icons";

const StyledShoePrints = styled(FontAwesomeIcon)({
  width: "3rem",
  height: "3rem",
  color: "var(--teal)",
  marginRight: "1rem",
});

const StyledPaper = styled(Paper)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  flexDirection: "row-reverse",
  padding: "1rem",
});

const Text = styled.span`
  font-size: 1rem;
`;

const TruncatedTextContainer = styled.div`
  position: relative;
  width: 100%;
`;

const TruncatedText = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: var(--veronica);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  cursor: pointer;
  margin: 0;

  &:hover::after {
    content: attr(data-fulltext);
    position: absolute;
    left: 0;
    top: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 0.5rem;
    z-index: 1;
    white-space: nowrap;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export default function DailyStatistics({
  currentCarbonFootprint,
  todaySteps,
  currentDayDistance,
}: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        "& > :not(style)": {
          m: 1,
          width: 275,
          height: 140,
        },
      }}
    >
      <StyledPaper elevation={1}>
        <StyledShoePrints icon={faLeaf} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p>Pegada de Carbono:</p>
          <TruncatedTextContainer>
            <TruncatedText data-fulltext={currentCarbonFootprint}>
              {currentCarbonFootprint !== null ? (
                currentCarbonFootprint
              ) : (
                <Text> Sem estatísticas diárias </Text>
              )}
            </TruncatedText>
          </TruncatedTextContainer>
        </div>
      </StyledPaper>
      <StyledPaper elevation={1}>
        <StyledShoePrints icon={faShoePrints} style={{ rotate: "-45deg" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p>Passos de hoje:</p>
          <TruncatedTextContainer>
            <TruncatedText data-fulltext={todaySteps}>
              {todaySteps !== null ? (
                todaySteps
              ) : (
                <Text> Sem estatísticas diárias </Text>
              )}
            </TruncatedText>
          </TruncatedTextContainer>
        </div>
      </StyledPaper>
      <StyledPaper elevation={1}>
        <StyledShoePrints icon={faPersonWalking} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p>Distância percorrida hoje:</p>
          <TruncatedTextContainer>
            <TruncatedText data-fulltext={currentDayDistance}>
              {currentDayDistance !== null ? (
                currentDayDistance
              ) : (
                <Text> Sem estatísticas diárias </Text>
              )}
            </TruncatedText>
          </TruncatedTextContainer>
        </div>
      </StyledPaper>
    </Box>
  );
}
