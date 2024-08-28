import {Button, TextField} from "@mui/material";
import {useState} from "react";
import {Col, Container, Row, Stack} from "react-bootstrap";
import {Fragment} from "react/jsx-runtime";
import {httpGet, httpPut} from "../../utils/http";
import {useDispatch} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {login} from "../../store/session";
import {useNavigate} from "react-router-dom";
import {set} from "../../store/snackbar";
import PasswordField from "../../components/PassworldField";
import styled from "styled-components";

const SpanVeronica = styled.span`
  color: var(--veronica);
  cursor: pointer;
  margin-left: 0.5rem;
`;
export default function LoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }

    function checkForRegister(nickname: string) {
        httpGet("/users/active/" + nickname).then((res) => {
            if (res.data) navigate("/");
            else navigate("/register/complete");
        });
    }

    function submit() {
        setLoading(true);
        httpPut("/security", form).then(
            (res) => {
                let t: any = jwtDecode(res.headers["authorization"].split(" ")[1]);
                dispatch(
                    login({
                        email: t.email,
                        nickname: t.nickname,
                        profilePic: t.profilePic,
                        token: res.headers["authorization"],
                        role: t.role,
                        iat: t.iat,
                        exp: t.exp,
                        jti: t.jti,
                        isLogged: true,
                        validated: true,
                    })
                );
                dispatch(
                    set({
                        open: true,
                        message: "Login successful",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
                checkForRegister(t.nickname);
            },
            (error) => {
                setLoading(false);
                if (error.status === 403) {
                    dispatch(
                        set({
                            open: true,
                            message: "Invalid credentials",
                            type: "error",
                            autoHideDuration: 3000,
                        })
                    );
                } else if (error.status === 423) {
                    httpPut("/users/resendEmail?email=" + form.email, {}).then(
                        () => {
                            dispatch(
                                set({
                                    open: true,
                                    message: "User is not active. Resending activation email",
                                    type: "error",
                                    autoHideDuration: 3000,
                                })
                            );
                        },
                        () => {
                            dispatch(
                                set({
                                    open: true,
                                    message: "User is not active. Error while resending activation email",
                                    type: "error",
                                    autoHideDuration: 3000,
                                })
                            );
                        }
                    )
                }
            }
        );
    }

    return (
        <Fragment>
            <h5 style={{fontWeight: "bold"}}>Log In</h5>
            <Container>
                <Col/>
                <Row>
                    <Col className="col-5 mx-auto">
                        <Stack direction="vertical" gap={2}>
                            <TextField
                                name="email"
                                required
                                label="Email"
                                onChange={handleChange}
                            />

                            <PasswordField
                                handleChange={handleChange}
                                name="password"
                                label="Password"
                            />

                            <Button
                                disabled={loading}
                                onClick={submit}
                                sx={{
                                    color: "var(--baby-powder)",
                                    display: "block",
                                    background: "var(--federal-blue)",
                                    textTransform: "none",
                                    ":hover": {background: "var(--hover-federal-blue)"},
                                }}
                                variant="contained"
                            >
                                Entrar com email
                            </Button>
                            <h6 style={{textAlign: "center"}}>
                                Esqueceste-te da password?
                                <SpanVeronica onClick={() => (navigate("/password/forgot"))}>
                                    Repor password.
                                </SpanVeronica>
                            </h6>
                            <h6 style={{textAlign: "center"}}>
                                Ainda não tens conta?
                                <SpanVeronica

                                    onClick={() => (navigate("/register"))}>
                                    Cria uma aqui!
                                </SpanVeronica>
                            </h6>
                        </Stack>
                    </Col>
                </Row>
                <Col/>
            </Container>
        </Fragment>
    );
}
