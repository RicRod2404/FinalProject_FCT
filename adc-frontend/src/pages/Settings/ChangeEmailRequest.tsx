import { useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Fragment } from "react/jsx-runtime";
import { set } from "../../store/snackbar";
import { useNavigate } from "react-router-dom";
import { httpPut } from "../../utils/http";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Logo from "../../components/NavBar/Logo";

export default function ChangeEmailRequest() {
  const [form, setForm] = useState({email: ""});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit() {
    setLoading(true);
    console.log(form)
    httpPut("/users/request-email?email=" + form.email, {}).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "Email request sent to the new email",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        navigate("/settings");
      },
      () => {
        dispatch(
          set({
            open: true,
            message: "An error has occurred",
            type: "error",
            autoHideDuration: 3000,
          })
        );
        setLoading(false);
      }
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "50vh",
          marginTop: "6rem",
          marginLeft: "15rem",
        }}
      >
        <Fragment>
          <Container style={{marginLeft: "10rem"}}>
            <Col />
            <Row>
              <Col className="col-6 mx-auto">
                <Stack direction="vertical" gap={3}>
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    <Logo width="200px" />
                  </span>
                  <h3 style={{ textAlign: "center", marginTop: "-1rem" }}>
                    Alterar email
                  </h3>
                  <TextField
                    onChange={handleChange}
                    name="email"
                    label="Novo email"
                  />
                  <LoadingButton
                    variant="contained"
                    loading={loading}
                    color="success"
                    onClick={submit}
                    style={{ backgroundColor: "var(--teal)" }}
                  >
                    Confirmar email
                  </LoadingButton>
                </Stack>
              </Col>
            </Row>
            <Col />
          </Container>
        </Fragment>
      </div>
    </>
  );
}
