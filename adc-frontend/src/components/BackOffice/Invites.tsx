import { Fragment, useState } from 'react';
import { Container, Row, Col, Stack } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { sessionSelector } from '../../store/session';
//import { useNavigate } from 'react-router-dom';
import { httpGet, httpPut } from '../../utils/http';
import { Table, TableBody, TableCell, TableHead, TableRow, Pagination } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styled from 'styled-components';
import { useEffect } from 'react';
import { set } from '../../store/snackbar';

const IconContainer = styled.div`
  position: relative;
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

export default function Invites() {
    //const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const session = useSelector(sessionSelector);

    const usersPerPage = 4;
    const [allInvitations, setAllInvitations] = useState<string[]>([]);

    const cancelInvite = async (selectedUser: string) => {
        if (selectedUser) {
            try {
                await httpPut(`/friends/cancel/${selectedUser}`, {});
                dispatch(set({
                    open: true,
                    message: "Friend request to " + selectedUser + " canceled",
                    type: "info",
                    autoHideDuration: 3000,
                }));
                setAllInvitations(prev => prev.filter(user => user !== selectedUser));
            } catch (error) {
                dispatch(set({
                    open: true,
                    message: "Error canceling friend request",
                    type: "error",
                    autoHideDuration: 3000,
                }));
            }
        }
    }

    useEffect(() => {
        const totalPages = Math.ceil(allInvitations.length / usersPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [allInvitations, currentPage, usersPerPage]);

    useEffect(() => {
        if (session.isLogged) {
            httpGet("/friends/requests/sent").then((response) => {
                const invitations = response.data as string[];
                setAllInvitations(invitations);
            });
        }
    }, [session.isLogged]);

    // Calculate total pages
    const totalPages = Math.ceil(allInvitations.length / usersPerPage);

    // Get current users for the page
    let currentUsers = allInvitations.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <Fragment>
            <Container className="tw-mt-3">
                <Row>
                    <Col>
                        <Table className="tw-mt-3" style={{ width: "20rem" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Pedidos enviados</b></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allInvitations.length > 0 ? (
                                    currentUsers.map((row) => (
                                        <TableRow key={row}>
                                            <TableCell component="th" scope="row">
                                                {row}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="horizontal" gap={5}>
                                                    <IconContainer>
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => cancelInvite(row)}
                                                        />
                                                    </IconContainer>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Não tem pedidos enviados.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {allInvitations.length > 0 && (
                            <ThemeProvider theme={theme}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(event, value) => { setCurrentPage(value); console.log(event) }}
                                    shape='rounded'
                                    style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
                                />
                            </ThemeProvider>
                        )}

                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}