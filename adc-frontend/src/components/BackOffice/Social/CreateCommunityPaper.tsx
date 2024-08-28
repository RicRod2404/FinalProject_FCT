import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import { Paper } from "@mui/material";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../../store/session";
import { httpGet } from "../../../utils/http";
import { useState, useEffect } from "react";
import { set } from "../../../store/snackbar";

interface UserData {
  level: number;
}

interface CreateCommunityPaperProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function CreateCommunityPaper({
  showModal,
  setShowModal,
}: CreateCommunityPaperProps) {
  const [level, setLevel] = useState<number>(1);
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();

  useEffect(() => {
      console.log(showModal)
    if (session.isLogged) {
      httpGet("/users/" + session.nickname).then(
        (res) => {
          const data = res.data as UserData;
          setLevel(data.level);
        },
        (error) => {
          dispatch(
            set({
              open: true,
              message:
                error.status === 404
                  ? "Utilizador não encontrado"
                  : "Erro ao carregar utilizador",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
      );
    }
  }, [session.isLogged, session.nickname]);

  return (
    <div
      style={{
        display: "flex",
        marginTop: "6rem",
        marginLeft: "22rem",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={9}
        style={{
          width: "30rem",
          height: "8rem",
          backgroundColor: "var(--federal-blue)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingLeft: "4rem",
            gap: "4rem",
          }}
        >
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon
              icon={faCertificate}
              style={{
                width: "6rem",
                height: "6rem",
                color: "var(--veronica)",
                border: "5px solid white",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "3rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {level}
            </div>
          </div>
          {level > 4 && (
            <Button
              style={{
                width: "12rem",
                height: "3rem",
                backgroundColor: "var(--teal)",
                border: "none",
              }}
              onClick={() => setShowModal(true)}
            >
              Criar uma Comunidade
            </Button>
          )}
          {level < 5 && (
            <Button
              style={{
                width: "12rem",
                height: "4rem",
                backgroundColor: "var(--teal)",
                border: "none",
              }}
              disabled={true}
            >
              Chegue a nível 5 para criar uma comunidade!
            </Button>
          )}
        </div>
      </Paper>
    </div>
  );
}
