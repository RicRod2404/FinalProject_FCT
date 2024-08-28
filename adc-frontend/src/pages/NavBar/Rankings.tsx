import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRankingStar,
  faUser,
  faPeopleGroup,
  faCheck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { httpGet } from "../../utils/http";

interface RankingData {
  targetName: string;
  leafPoints: number;
}

const H1 = styled.h1`
  user-select: none;
  color: var(--federal-blue);
  font-weight: bolder;
  font-size: 2rem;
  text-align: center;
  margin-top: 2rem;
`;

const StaircaseContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
`;

const StepContainer = styled.div<{ width: number; rank: number }>`
  width: ${(props) => props.width}px;
  height: 40px;
  background-color: ${(props) =>
    props.rank % 2 === 0 ? "var(--teal)" : "var(--federal-blue)"};
  color: white;
  align-content: center;
  text-align: center;
  line-height: 20px;
  margin: 3px 0;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)({
  color: "#ffc552",
  width: "7rem",
  height: "5rem",
});

const Label = styled(Typography)`
  color: var(--federal-blue);
  padding-top: 2rem;
  padding-left: 3rem;
`;

const SubLabel = styled(Typography)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--federal-blue);
  padding-top: 1.5rem;
  padding-left: 4rem;
`;

const Spacer = styled.div`
  margin-top: -0.5rem;
`;

const Step = ({
  width,
  rank,
  user,
}: {
  width: number;
  rank: number;
  user: RankingData;
}) => (
  <StepContainer width={width} rank={rank}>
    {user.targetName} - {user.leafPoints} LPs
  </StepContainer>
);

const RankingStaircase = ({
  users,
  top,
}: {
  users: RankingData[];
  top: number;
}) => {
  const steps = [];
  const totalSteps = Math.min(users.length, top);
  const maxWidth = 100;
  const baseWidth = 100 * totalSteps;
  const increment = 100;

  let currentWidth = baseWidth;
  let usersCorrectOrder = users
    .sort((a, b) => a.leafPoints - b.leafPoints)
    .slice(0, top);

  for (let userIndex = 0; userIndex < totalSteps; userIndex++) {
    let width = currentWidth - increment * userIndex;

    if (width > maxWidth) {
      const adjustedIncrement = (maxWidth - baseWidth) / (totalSteps - 1);
      width = baseWidth + adjustedIncrement * userIndex;
    }

    steps.push(
      <Step
        key={userIndex}
        width={width}
        rank={userIndex + 1}
        user={usersCorrectOrder[userIndex]}
      />
    );
  }

  return <>{steps}</>;
};

const SelectWithButtonYear = ({
  onSelectYear,
  reset,
  resetDone,
}: {
  buttonText: string;
  onSelectYear: (year: number) => void;
  reset: boolean;
  resetDone: () => void;
}) => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (reset) {
      setSelectedYear(undefined);
      resetDone();
    }
  }, [reset, resetDone]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleButtonClick = () => {
    if (selectedYear !== undefined) {
      onSelectYear(selectedYear);
    }
  };

  return (
    <>
      <FormControl
        variant="outlined"
        style={{ marginLeft: "0.5rem", width: "12rem" }}
      >
        <Select
          value={selectedYear || ""}
          onChange={handleChange}
          style={{ height: "2rem" }}
        >
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleButtonClick}>
        <FontAwesomeIcon icon={faCheck} />
      </Button>
    </>
  );
};

const SelectWithButtonMonth = ({
  onSelectMonth,
  reset,
  resetDone,
}: {
  buttonText: string;
  onSelectMonth: (year: number, month: number) => void;
  reset: boolean;
  resetDone: () => void;
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (reset) {
      setSelectedMonth(undefined);
      setSelectedYear(undefined);
      resetDone();
    }
  }, [reset, resetDone]);

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleButtonClick = () => {
    if (selectedYear !== undefined && selectedMonth !== undefined) {
      onSelectMonth(selectedYear, selectedMonth);
    }
  };

  return (
    <>
      <FormControl
        variant="outlined"
        style={{ marginLeft: "0.5rem", width: "5rem" }}
      >
        <Select
          value={selectedMonth || ""}
          onChange={handleMonthChange}
          style={{ height: "2rem" }}
        >
          <MenuItem value={1}>Jan</MenuItem>
          <MenuItem value={2}>Feb</MenuItem>
          <MenuItem value={3}>Mar</MenuItem>
          <MenuItem value={4}>Apr</MenuItem>
          <MenuItem value={5}>May</MenuItem>
          <MenuItem value={6}>Jun</MenuItem>
          <MenuItem value={7}>Jul</MenuItem>
          <MenuItem value={8}>Aug</MenuItem>
          <MenuItem value={9}>Sep</MenuItem>
          <MenuItem value={10}>Oct</MenuItem>
          <MenuItem value={11}>Nov</MenuItem>
          <MenuItem value={12}>Dec</MenuItem>
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        style={{ marginLeft: "0.5rem", width: "6rem" }}
      >
        <Select
          value={selectedYear || ""}
          onChange={handleYearChange}
          style={{ height: "2rem" }}
        >
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleButtonClick}>
        <FontAwesomeIcon icon={faCheck} />
      </Button>
    </>
  );
};

export default function Rankings() {
  const [userRankings, setUserRankings] = useState<RankingData[]>([]);
  const [communityRankings, setCommunityRankings] = useState<RankingData[]>([]);
  const [filter, setFilter] = useState<"none" | "users" | "communities">(
    "none"
  );
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    httpGet("/rankings/users/yearly", { year: new Date().getFullYear() })
      .then((res: any) => setUserRankings(res.data.content as RankingData[]))
      .catch((err) => {
        console.error(err);
        setUserRankings([]);
      });

    httpGet("/rankings/communities/yearly", { year: new Date().getFullYear() })
      .then((res: any) =>
        setCommunityRankings(res.data.content as RankingData[])
      )
      .catch((err) => {
        console.error(err);
        setCommunityRankings([]);
      });
  }, []);

  const handleYearSelectionU = (year: number) => {
    setFilter("users");
    httpGet("/rankings/users/yearly", { year: year })
      .then((res: any) => {
        setUserRankings(res.data.content as RankingData[]);
      })
      .catch((err) => {
        console.error(err);
        setUserRankings([]);
      });
  };

  const handleYearSelectionC = (year: number) => {
    setFilter("communities");
    httpGet("/rankings/communities/yearly", { year: year })
      .then((res: any) => {
        setCommunityRankings(res.data.content as RankingData[]);
      })
      .catch((err) => {
        console.error(err);
        setCommunityRankings([]);
      });
  };

  const handleMonthSelectionU = (year: number, month: number) => {
    setFilter("users");
    httpGet("/rankings/users/monthly", { year: year, month: month })
      .then((res: any) => {
        setUserRankings(res.data.content as RankingData[]);
      })
      .catch((err) => {
        console.error(err);
        setUserRankings([]);
      });
  };

  const handleMonthSelectionC = (year: number, month: number) => {
    setFilter("communities");
    httpGet("/rankings/communities/monthly", { year: year, month: month })
      .then((res: any) => {
        setCommunityRankings(res.data.content as RankingData[]);
      })
      .catch((err) => {
        console.error(err);
        setCommunityRankings([]);
      });
  };

  const handleReset = () => {
    setFilter("none");
    setReset(true);
    httpGet("/rankings/users/yearly", { year: new Date().getFullYear() })
      .then((res: any) => {
        setUserRankings(res.data.content as RankingData[]);
      })
      .catch((err) => {
        console.error(err);
        setUserRankings([]);
      });

    httpGet("/rankings/communities/yearly", { year: new Date().getFullYear() })
      .then((res: any) => {
        setCommunityRankings(res.data.content as RankingData[]);
      })
      .catch((err) => {
        console.error(err);
        setCommunityRankings([]);
      });
  };

  const resetDone = () => setReset(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "auto",
        marginTop: "5.5rem",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
        }}
      >
        <Paper elevation={9} style={{ height: "33rem", width: "23rem" }}>
          <H1>Rankings</H1>
          <Label>
            <FontAwesomeIcon icon={faUser} /> Utilizadores
          </Label>
          <SubLabel>
            Anual:{" "}
            <SelectWithButtonYear
              buttonText="Confirmar"
              onSelectYear={handleYearSelectionU}
              reset={reset}
              resetDone={resetDone}
            />
          </SubLabel>
          <SubLabel>
            Mensal:{" "}
            <SelectWithButtonMonth
              buttonText="Confirmar"
              onSelectMonth={handleMonthSelectionU}
              reset={reset}
              resetDone={resetDone}
            />
          </SubLabel>
          <Label>
            <FontAwesomeIcon icon={faPeopleGroup} /> Comunidades
          </Label>
          <SubLabel>
            Anual:{" "}
            <SelectWithButtonYear
              buttonText="Confirmar"
              onSelectYear={handleYearSelectionC}
              reset={reset}
              resetDone={resetDone}
            />
          </SubLabel>
          <SubLabel>
            Mensal:{" "}
            <SelectWithButtonMonth
              buttonText="Confirmar"
              onSelectMonth={handleMonthSelectionC}
              reset={reset}
              resetDone={resetDone}
            />
          </SubLabel>
          <div style={{ marginTop: "2.5rem", marginLeft: "3.5rem" }}>
            <Button
              style={{
                backgroundColor: "var(--teal)",
                borderColor: "var(--teal)",
                padding: "0.5rem",
                color: "white",
                width: "80%",
              }}
              onClick={handleReset}
            >
              Limpar filtros
            </Button>
          </div>
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Spacer />
        {userRankings.length > 0 && communityRankings.length > 0 ? (
          (() => {
            switch (filter) {
              case "none":
                return (
                  <>
                    {userRankings.length > 0 && (
                      <>
                        <StyledFontAwesomeIcon icon={faRankingStar} />
                        <StaircaseContainer>
                          <RankingStaircase users={userRankings} top={3} />
                        </StaircaseContainer>
                      </>
                    )}
                    {communityRankings.length > 0 && (
                      <>
                        <Spacer style={{ marginTop: "4rem" }} />
                        <StyledFontAwesomeIcon icon={faRankingStar} />
                        <StaircaseContainer>
                          <RankingStaircase users={communityRankings} top={3} />
                        </StaircaseContainer>
                      </>
                    )}
                  </>
                );
              case "users":
                return (
                  <>
                    <StyledFontAwesomeIcon icon={faRankingStar} />
                    <StaircaseContainer>
                      <RankingStaircase users={userRankings} top={10} />
                    </StaircaseContainer>
                  </>
                );
              case "communities":
                return (
                  <>
                    <StyledFontAwesomeIcon icon={faRankingStar} />
                    <StaircaseContainer>
                      <RankingStaircase users={communityRankings} top={10} />
                    </StaircaseContainer>
                  </>
                );
            }
          })()
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "13rem",
                marginRight: "18rem",
              }}
            >
              <StyledFontAwesomeIcon
                icon={faBan}
                style={{ color: "lightgray" }}
              />

              <Typography
                style={{ color: "lightgray", marginTop: "1rem" }}
              >
                Não existem rankings para a data selecionada.
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
