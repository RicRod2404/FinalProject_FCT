import { TextField, Button } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { Col, Container, Row, Stack} from "react-bootstrap";
import { useState } from "react";
import styled from "styled-components";
import BackToWebsiteBtn from "../../components/BackToWebsiteBtn";
import Logo from "../../components/NavBar/Logo";
import {httpPut} from "../../utils/http.ts";
import {useDispatch} from "react-redux";
import {set} from "../../store/snackbar.ts";
import {useNavigate} from "react-router-dom";

const Elements = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function ForgotPasswordEmail() {
  const [form, setForm] = useState({email: ""});
    const dispatch = useDispatch();
    const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit() {
      console.log(form.email)
    httpPut("/users/forgot-password/" + form.email, {}).then(
        () => {
            dispatch(
            set({
                open: true,
                message: "Email enviado com sucesso",
                type: "success",
                autoHideDuration: 3000,
            })
            );
            navigate("/");
        },
        (error) => {
            if (error.status === 404) {
            dispatch(
                set({
                open: true,
                message: "Email não encontrado",
                type: "error",
                autoHideDuration: 3000,
                })
            );
            } else {
            dispatch(
                set({
                open: true,
                message: "Erro ao enviar email",
                type: "error",
                autoHideDuration: 3000,
                })
            );
            }
        }
        );
  }
  return (
    <Elements>
      <BackToWebsiteBtn />
      <span style={{ marginTop: "-5rem", marginBottom: "-2rem" }}>
        <Logo width="200px" />
      </span>
      <Fragment>
        <h5 style={{ fontWeight: "bold" }}>Insira o seu email aqui!</h5>
        <Container>
          <Col />
          <Row>
            <Col className="col-5 mx-auto">
              <Stack direction="vertical" gap={2}>
                <TextField
                  name="email"
                  required
                  label="Email"
                  onChange={handleChange}
                />
                 <Button
        
                onClick={submit}
                sx={{
                    color: "var(--baby-powder)",
                    display: "block",
                    background: "var(--federal-blue)",
                    textTransform: "none",
                    ":hover": { background: "var(--hover-federal-blue)" },
                  }}
                variant="contained"
              >
                Continuar
              </Button>
              </Stack>
            </Col>
          </Row>
        </Container>
      </Fragment>
    </Elements>
  );
}
