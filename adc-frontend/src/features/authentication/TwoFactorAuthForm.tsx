/*import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { Col, Container, Row, Stack } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { httpPut } from "../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login, sessionSelector } from "../../store/session";
import { Link, useNavigate } from "react-router-dom";
import { set } from "../../store/snackbar";
import PasswordField from "../../components/PassworldField";
import { Google } from "@mui/icons-material";
import styled from "styled-components";

export default function TwoFactorAuthForm() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit() {}
  return (
    <Fragment>
      <Container>
        <Col />
        <Row>
          <Col className="col-5 mx-auto">
            <Stack direction="vertical" gap={2}>
              <TextField
                name="tfacode"
                required
                label="Código de autenticação"
                onChange={handleChange}
              />

              <Button
                disabled={loading}
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
                Submeter código
              </Button>
            </Stack>
          </Col>
        </Row>
        <Col />
      </Container>
    </Fragment>
  );
}*/

import {Fragment} from "react/jsx-runtime";

export default function TwoFactorAuthForm() {
    return (
        <Fragment>
            <h1>Comentado</h1>
        </Fragment>
    )
}
