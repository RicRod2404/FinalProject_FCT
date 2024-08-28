import { useEffect, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react/jsx-runtime";
import { sessionSelector } from "../../store/session";
import { set } from "../../store/snackbar";
import { useNavigate } from "react-router-dom";
import { httpPut } from "../../utils/http";
import PasswordField from "../../components/PassworldField";
import { LoadingButton } from "@mui/lab";
import Logo from "../../components/NavBar/Logo";

export default function PasswordChange() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setForm((prev) => ({ ...prev, nickname: session.nickname }));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit() {
    setLoading(true);
    httpPut("/users/password", form).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "Password changed successfully",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        navigate("/");
      },
      (error) => {
        setLoading(false);
        if (error.status === 403) {
          dispatch(
            set({
              open: true,
              message: "Old password is incorrect",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        } else if (error.status === 400) {
          dispatch(
            set({
              open: true,
              message: "Password and Confirm Password do not match",
              type: "error",
              autoHideDuration: 4000,
            })
          );
        } else if (error.status === 406) {
          dispatch(
            set({
              open: true,
              message:
                "Password is not strong enough. It must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
              type: "error",
              autoHideDuration: 6000,
            })
          );
        } else {
          dispatch(
            set({
              open: true,
              message: "An error occurred",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
      }
    );
  }

  return (
    <>
      <div style={{ display: 'flex', height: "50vh", marginTop: "6rem", marginBottom:"6rem", marginLeft: "25rem" }}>
        <Fragment>
          <Container >
            <Col />
            <Row>
              <Col className="col-6 mx-auto">
                <Stack direction="vertical" gap={3}>
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    <Logo width="200px" />
                  </span>
                  <h3 style={{ textAlign: "center", marginTop: "-1rem" }}>Alterar palavra-passe</h3>
                  <PasswordField
                    handleChange={handleChange}
                    name="oldPassword"
                    label="Palavra-passe Atual"
                  />
                  <PasswordField
                    handleChange={handleChange}
                    name="newPassword"
                    label="Nova Palavra-passe"
                  />
                  <PasswordField
                    handleChange={handleChange}
                    name="confirmPassword"
                    label="Confirmar nova Palavra-passe"
                  />
                  <LoadingButton
                    variant="contained"
                    loading={loading}
                    color="success"
                    onClick={submit}
                    style={{ backgroundColor: "var(--teal)" }}
                  >
                    Mudar Palavra-Passe
                  </LoadingButton>
                </Stack>
              </Col>
            </Row>
            <Col />
          </Container>
        </Fragment>
      </div >
    </>
  );
}
