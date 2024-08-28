import { Fragment, useState, useEffect } from 'react';
import { Container, Row, Col, Stack, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faComment } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { sessionSelector } from '../../store/session';
import { useNavigate } from 'react-router-dom';
import { httpGet, httpPut } from '../../utils/http';
import { Table, TableBody, TableCell, TableHead, TableRow, Pagination } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useFriends } from '../../contexts/FriendsContext';
import styled from 'styled-components';

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

export default function FriendsList() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const session = useSelector(sessionSelector);

    const usersPerPage = 4;
    const { allFriends, setAllFriends } = useFriends();

    const handleRemoveFriends = async (friend: string) => {
        try {
            await httpPut(`/friends/remove/${friend}`, {});
            setAllFriends(prev => prev.filter(f => f !== friend));
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    useEffect(() => {
        const totalPages = Math.ceil(allFriends.length / usersPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [allFriends, currentPage, usersPerPage]);

    useEffect(() => {
        if (session.isLogged) {
            httpGet("/friends/" + session.nickname).then((response) => {
                const allFriends = response.data as string[];
                setAllFriends(allFriends);
            });
        }
    }, [session.isLogged]);

    // Calculate total pages
    const totalPages = Math.ceil(allFriends.length / usersPerPage);

    // Get current users for the page
    let currentUsers = allFriends.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <Fragment>
            <Container className="tw-mt-3">
                <Row>
                    <Col>
                        <Table className="tw-mt-3" style={{ width: "20rem" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Amigos</b></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allFriends.length > 0 ? (
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
                                                            icon={faUserMinus}
                                                            style={{ cursor: "pointer", color:"var(--federal-blue)" }}
                                                            onClick={() => handleRemoveFriends(row)}
                                                        />
                                                    </IconContainer>
                                                    <FontAwesomeIcon
                                                        icon={faComment}
                                                        style={{ cursor: "pointer", color:"var(--federal-blue)"}}
                                                        onClick={() => navigate(`/profile/${session.nickname}/messages`)}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Não tem amigos.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {allFriends.length > 0 && (
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
