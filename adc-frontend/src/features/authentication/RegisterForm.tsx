import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { Col, Container, Row, Stack } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { httpPost } from "../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { useNavigate } from "react-router-dom";
import { set } from "../../store/snackbar";
import PasswordField from "../../components/PassworldField.tsx";
import { setCommunity } from "../../store/community.ts";

interface FormState {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterForm() {
    const [form, setForm] = useState<FormState>({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [nicknameError, setNicknameError] = useState(false);
    const [nicknameErrorText, setNicknameErrorText] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const session = useSelector(sessionSelector);

    useEffect(() => {
        if (session.isLogged) navigate("/");
    }, [session.isLogged]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        if (name === "nickname") {
            if (!/[A-Za-z]/.test(value)) {
                setNicknameError(true);
                setNicknameErrorText("Username tem de conter no mínimo uma letra");
            } else {
                const nicknamePattern = /^(?=.*[A-Za-z])[A-Za-z0-9]+$/;
                if (!nicknamePattern.test(value)) {
                    setNicknameError(true);
                    setNicknameErrorText("Username só pode conter letras e números");
                } else {
                    setNicknameError(false);
                    setNicknameErrorText('');
                }
            }
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function register() {
        setLoading(true);

        // Send form
        httpPost("/users", form).then(
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "User created successfully",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
                dispatch(
                    setCommunity({
                        name: form.email,
                    }
                    ));
                navigate('/emailsent')
            },
            (error) => {
                setLoading(false);
                if (error.status === 409) {
                    dispatch(
                        set({
                            open: true,
                            message: "Username already exists",
                            type: "error",
                            autoHideDuration: 3000,
                        })
                    );
                } else if (error.status === 400) {
                    dispatch(
                        set({
                            open: true,
                            message: "Form is incomplete or invalid",
                            type: "error",
                            autoHideDuration: 4000,
                        })
                    );
                } else if (error.status === 403) {
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
                            message: "Error while creating user",
                            type: "error",
                            autoHideDuration: 3000,
                        })
                    );
                }
            }
        );
    }

    return (
        <Fragment>
            <h5 style={{ fontWeight: "bold" }}>Cria a tua conta</h5>
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

                            <TextField
                                name="nickname"
                                required
                                label="Username"
                                onChange={handleChange}
                                error={nicknameError}
                                helperText={nicknameError ? nicknameErrorText : ""}
                            />

                            <PasswordField
                                handleChange={handleChange}
                                name="password"
                                label="Password"
                            />

                            <PasswordField
                                handleChange={handleChange}
                                name="confirmPassword"
                                label="Confirm Password"
                            />

                            <Button
                                disabled={loading || !form.email || !form.nickname || !form.password || !form.confirmPassword || nicknameError}
                                onClick={register}
                                sx={{
                                    color: "var(--baby-powder)",
                                    display: "block",
                                    background: "var(--federal-blue)",
                                    textTransform: "none",
                                    ":hover": { background: "var(--hover-federal-blue)" },
                                }}
                                variant="contained"
                            >
                                Registar
                            </Button>
                        </Stack>
                    </Col>
                </Row>
                <Col />
            </Container>
        </Fragment>
    );
}
