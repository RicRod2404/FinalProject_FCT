import React, {useState} from "react";
import {Col, Container, Row, Stack} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {Fragment} from "react/jsx-runtime";
import {set} from "../../store/snackbar";
import {useNavigate, useParams} from "react-router-dom";
import {httpPut} from "../../utils/http";
import PasswordField from "../../components/PassworldField";
import {LoadingButton} from "@mui/lab";
import Logo from "../../components/NavBar/Logo";

export default function ForgotPassword() {
    const { verifyHash } = useParams();
    const [form, setForm] = useState({
        verifyHash,
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }

    function submit() {
        console.log(form)
        setLoading(true);
        httpPut("/users/forgot-password", form).then(
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Palavra-passe alterada com sucesso",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
                navigate("/");
            },
            (error) => {
                setLoading(false);
                if (error.status === 400) {
                    dispatch(
                        set({
                            open: true,
                            message: "A palavra-passe e a sua confirmação não coincidem",
                            type: "error",
                            autoHideDuration: 4000,
                        })
                    );
                } else if (error.status === 406) {
                    dispatch(
                        set({
                            open: true,
                            message:
                                "A password não é forte o suficiente. Deve conter pelo menos 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caracter especial",
                            type: "error",
                            autoHideDuration: 6000,
                        })
                    );
                } else {
                    dispatch(
                        set({
                            open: true,
                            message: "Ocorreu um erro",
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
            <div style={{display: 'flex',marginTop: '6rem', marginLeft:"3rem"}}>
                <Fragment>
                    <Container style={{height: "50vh"}}>
                        <Col/>
                        <Row>
                            <Col className="col-4 mx-auto">
                                <Stack direction="vertical" gap={3}>
                  <span style={{marginInline: "6rem"}}>
                    <Logo width="200px"/>
                  </span>
                                    <h3 style={{marginInline: "4rem"}}>Redefinir a password</h3>
                                    <PasswordField
                                        handleChange={handleChange}
                                        name="newPassword"
                                        label="Nova password"
                                    />
                                    <PasswordField
                                        handleChange={handleChange}
                                        name="confirmPassword"
                                        label="Confirmar nova password"
                                    />
                                    <LoadingButton
                                        variant="contained"
                                        loading={loading}
                                        color="success"
                                        onClick={submit}
                                        style={{backgroundColor: "var(--teal)"}}
                                    >
                                        Confirmar
                                    </LoadingButton>
                                </Stack>
                            </Col>
                        </Row>
                        <Col/>
                    </Container>
                </Fragment>
            </div>
        </>
    );
}
