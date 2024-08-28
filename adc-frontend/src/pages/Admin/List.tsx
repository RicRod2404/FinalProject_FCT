import {
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { User } from "../../types/UserType";
import { httpGet, httpPut } from "../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../store/snackbar";
import { useNavigate } from "react-router-dom";
import { sessionSelector } from "../../store/session";
import { InputGroup, Form } from "react-bootstrap";
import styled from "styled-components";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  margin-top: 3rem;
  height: 5rem;
`;

const theme = createTheme({
    components: {
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'var(--teal)',
                        color: '#fff',
                    },
                },
            },
        },
    },
});

export default function List() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const session = useSelector(sessionSelector);
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setSize] = useState(5)

    useEffect(() => {
        if (session.isLogged) {
            httpGet(`users?query=${query}&page=${currentPage-1}&size=${size}`).then((response) => {
                // @ts-ignore
                setTotalPages(response.data.totalPages);
                // @ts-ignore
                setUsers(response.data.content as User[]);
            });
        }
    }, [session.isLogged, currentPage, query, size]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    function changeStatus(event: SelectChangeEvent, index: number) {
        httpPut("/users/status", {
            nickname: users[index].nickname,
            status: event.target.value,
        }).then(
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Estado alterado com sucesso",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
                setUsers((prev) => {
                    const newUsers = [...prev];
                    newUsers[index].status = event.target.value;
                    return newUsers;
                });
            },
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Ocurreu um erro ao alterar o estado",
                        type: "error",
                        autoHideDuration: 3000,
                    })
                );
            }
        );
    }

    function changeRole(event: SelectChangeEvent, index: number) {
        httpPut("/users/role", {
            nickname: users[index].nickname,
            role: event.target.value,
        }).then(
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Permissão alterada com sucesso",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
                setUsers((prev) => {
                    const newUsers = [...prev];
                    newUsers[index].role = event.target.value;
                    return newUsers;
                });
            },
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Ocurreu um erro ao alterar permissões",
                        type: "error",
                        autoHideDuration: 3000,
                    })
                );
            }
        );
    }

    return (
        <Fragment>
            <Container className="tw-mt-3" style={{ marginTop: "6rem", marginLeft: "14rem" }}>
                <StyledPaper>
                    <div style={{ display: "flex", marginTop: "0.3rem" }}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Username..."
                                onChange={handleInputChange}
                                style={{
                                    width: "20rem", margin: '0 auto', marginBottom: '1rem'
                                }}
                            />
                        </InputGroup>

                        <Select
                            required
                            value={size}
                            sx={{ width: "120px", height: "38px", marginLeft: '1rem'}}
                            onChange={(e) => {
                                setCurrentPage(1)
                                setSize(Number(e.target.value))
                            }}
                        >
                            <MenuItem value="5"> Qt.: 5</MenuItem>
                            <MenuItem value="10">Qt.: 10</MenuItem>
                            <MenuItem value="25">Qt.: 25</MenuItem>
                            <MenuItem value="50">Qt.: 50</MenuItem>
                        </Select>
                    </div>
                </StyledPaper>
                <Row>
                    <Col>
                        <Table className="tw-mt-3">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Username</b></TableCell>
                                    <TableCell><b>Email</b></TableCell>
                                    <TableCell><b>Nome</b></TableCell>
                                    {session.role !== "USER" && (
                                        <Fragment>
                                            <TableCell><b>Telemóvel</b></TableCell>
                                            <TableCell><b>Morada</b></TableCell>
                                            <TableCell><b>Código Postal</b></TableCell>
                                            <TableCell><b>NIF</b></TableCell>
                                        </Fragment>
                                    )}
                                    <TableCell align="center"><b>Ações</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((row, index) => (
                                    <TableRow
                                        key={row.nickname}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.nickname}
                                        </TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        {session.role !== "USER" && (
                                            <Fragment>
                                                <TableCell>{row.phoneNum}</TableCell>
                                                <TableCell>{row.address}</TableCell>
                                                <TableCell>{row.postalCode}</TableCell>
                                                <TableCell>{row.nif}</TableCell>
                                            </Fragment>
                                        )}
                                        <TableCell>
                                            <Stack direction="horizontal" gap={2}>
                                                <Button
                                                    style={{ backgroundColor: "var(--teal)", borderColor: "var(--teal)" }}
                                                    variant="primary"
                                                    onClick={() => navigate(`/profile/${row.nickname}`)}
                                                >
                                                    Ver
                                                </Button>
                                                {session.role !== "USER" && session.role !== "GBO" && session.role !== "GC" && (
                                                    <Select
                                                        required
                                                        disabled={
                                                            (session.role === "GA" && row.role === "GA") ||
                                                            session.email === row.email
                                                        }
                                                        value={row.role}
                                                        sx={{ width: "100px", height: "43px" }}
                                                        onChange={(e) => changeRole(e, index)}
                                                    >
                                                        <MenuItem value="USER">USER</MenuItem>
                                                        <MenuItem value="GC">GC</MenuItem>
                                                        <MenuItem value="GBO">GBO</MenuItem>
                                                        <MenuItem value="GA" hidden={session.role === "GA"}>
                                                            GA
                                                        </MenuItem>
                                                        <MenuItem value="GS" hidden={session.role === "GA" || session.role === "GS"}>
                                                            GS
                                                        </MenuItem>
                                                        <MenuItem value="SU" hidden={session.role === "GA" || session.role === "GS"}>
                                                            SU
                                                        </MenuItem>
                                                    </Select>
                                                )}
                                                {(session.role !== "USER" && session.role !== "GC") && (
                                                    <Select
                                                        required
                                                        disabled={session.email === row.email}
                                                        value={row.status}
                                                        sx={{ width: "130px", height: "43px" }}
                                                        onChange={(e) => changeStatus(e, index)}
                                                    >
                                                        <MenuItem value="ACTIVE">ATIVO</MenuItem>
                                                        <MenuItem value="INACTIVE">INATIVO</MenuItem>
                                                    </Select>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {users.length > 0 && (
                            <ThemeProvider theme={theme}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(_, value) => setCurrentPage(value)}
                                    shape="rounded"
                                    style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}
                                />
                            </ThemeProvider>
                        )}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}