import { Fragment, useState } from 'react';
import { Container, Row, Col, Stack, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { sessionSelector } from '../../store/session';
import { useNavigate } from 'react-router-dom';
import { httpGet, httpPut } from '../../utils/http';
import { Table, TableBody, TableCell, TableHead, TableRow, Pagination } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useFriends } from '../../contexts/FriendsContext';
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

export default function Requests() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const session = useSelector(sessionSelector);
    const { setAllFriends } = useFriends();

    const usersPerPage = 4;
    const [allInvitations, setAllInvitations] = useState<string[]>([]);

    const acceptInvite = async (selectedUser: string) => {
        if (selectedUser) {
            try {
                await httpPut(`/friends/accept/${selectedUser}`, {});
                dispatch(set({
                    open: true,
                    message: "You are now friends with " + selectedUser,
                    type: "success",
                    autoHideDuration: 3000,
                }));
                setAllInvitations(prev => prev.filter(user => user !== selectedUser));
                const response = await httpGet("/friends/" + session.nickname);
                setAllFriends(response.data as string[]);
            } catch (error) {
                dispatch(set({
                    open: true,
                    message: "Error accepting friend request",
                    type: "error",
                    autoHideDuration: 3000,
                }));
            }
        }
    };

    const declineInvite = async (selectedUser: string) => {
        if (selectedUser) {
            try {
                await httpPut(`/friends/reject/${selectedUser}`, {});
                dispatch(set({
                    open: true,
                    message: "Friend request from " + selectedUser + " declined",
                    type: "info",
                    autoHideDuration: 3000,
                }));
                setAllInvitations(prev => prev.filter(user => user !== selectedUser));
            } catch (error) {
                dispatch(set({
                    open: true,
                    message: "Error declining friend request",
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
            httpGet("/friends/requests").then((response) => {
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
                                    <TableCell><b>Pedidos de amizade</b></TableCell>
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
                                                    <Button
                                                        style={{ backgroundColor: "var(--teal)", borderColor: "var(--teal)" }}
                                                        onClick={() => navigate(`/profile/${row}`)}
                                                    >
                                                        Ver
                                                    </Button>
                                                    <IconContainer>
                                                        <FontAwesomeIcon
                                                            icon={faCheck}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => acceptInvite(row)}
                                                        />
                                                    </IconContainer>
                                                    <FontAwesomeIcon
                                                        icon={faTimes}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => declineInvite(row)}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Não tem pedidos pendentes.</TableCell>
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