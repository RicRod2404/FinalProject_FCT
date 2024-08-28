import { Button, TextField } from "@mui/material";
import {useEffect, useState} from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { httpPut } from "../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { set } from "../../store/snackbar";
import React from "react";
import { MuiTelInput } from "mui-tel-input";
import { sessionSelector } from "../../store/session.ts";
import { User } from "../../types/UserType.ts";

export default function CompleteRegisterForm() {
  const [user, setUser] = useState<User>({
    nickname: "",
    name: "",
    email: "",
    phoneNum: "",
    address: "",
    postalCode: "",
    nif: "",
    profilePic: "",
    role: "",
    status: "",
    isPublic: true,
    level: 0,
    bannerPic: "",
    levelExp: 0,
    levelExpToNextLevel: 0,
  });

  const [phone, setPhone] = useState<string>("");
  const [countryCode, setCountryCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector(sessionSelector);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleTelChange = (newPhone: string) => {
    let phoneNumWithoutSpaces = newPhone.replace(/\s/g, "");
    let spaceIndex = newPhone.indexOf(" ");
    let newCountryCode = newPhone.substring(0, spaceIndex);

    if (countryCode === "") {
      setPhone(newPhone);
      setCountryCode(newCountryCode);
      setUser((prev) => ({ ...prev, phoneNum: newPhone }));
    } else if (newCountryCode !== countryCode) {
      setCountryCode(newCountryCode);
      setPhone("");
      setUser((prev) => ({ ...prev, phoneNum: "" }));
    } else {
      if (
        newPhone.substring(spaceIndex, phoneNumWithoutSpaces.length).length <= 9
      ) {
        setPhone(newPhone);
        setUser((prev) => ({ ...prev, phoneNum: newPhone }));
      }
    }
  };

  useEffect(() => {
      if (session.isLogged)
          setUser((prev) => ({ ...prev, nickname: session.nickname }));
  }, [session.isLogged])

  function submit() {
    const formData = new FormData();
    // Build form
    formData.append(
      "form",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    httpPut("users/" + session.nickname, formData).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "User edited successfully",
            type: "success",
            autoHideDuration: 3000,
          })
        );

        httpPut("users/active/" + session.nickname, null).then(() => {
              navigate("/");
          });
      },
      () => {
        dispatch(
          set({
            open: true,
            message: "Error editing user",
            type: "error",
            autoHideDuration: 3000,
          })
        );
      }
    );
  }

  function skip() {
    httpPut("users/active/" + session.nickname, null).then(() => {
      navigate("/");
    });
  }

  return (
    <Fragment>
      <Container>
        <Col />
        <h5 style={{ marginBottom: "2rem" }}>Completa o teu Registo</h5>
        <Row>
          <Col className="col-10 mx-4">
            <Stack direction="vertical" gap={3}>
              <TextField
                name="name"
                label="Nome completo"
                onChange={handleChange}
              />

              <MuiTelInput
                name="phoneNum"
                label="N° Telemóvel"
                defaultCountry="PT"
                value={phone}
                forceCallingCode
                onChange={handleTelChange}
              />

              <TextField
                name="address"
                label="Morada"
                onChange={handleChange}
              />

              <TextField
                name="postalCode"
                label="Código Postal"
                onChange={handleChange}
              />

              <TextField name="nif" label="NIF" onChange={handleChange} />

              <Button
                onClick={submit}
                sx={{
                  color: "var(--baby-powder)",
                  padding: "10px",
                  display: "block",
                  background: "var(--federal-blue)",
                  textTransform: "none",
                  ":hover": { background: "var(--hover-federal-blue)" },
                }}
                variant="contained"
              >
                Completar registo
              </Button>

              <Button
                onClick={skip}
                sx={{
                  color: "var(--baby-powder)",
                  padding: "10px",
                  display: "block",
                  background: "var(--federal-blue)",
                  textTransform: "none",
                  ":hover": { background: "var(--hover-federal-blue)" },
                }}
                variant="contained"
              >
                Skip
              </Button>
            </Stack>
          </Col>
        </Row>
        <Col />
      </Container>
    </Fragment>
  );
}
