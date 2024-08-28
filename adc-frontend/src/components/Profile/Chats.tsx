import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { TableHead, TableBody, TableRow, TableCell, Pagination } from '@mui/material';
import { useChats } from '../../contexts/ChatContext';
import { Chat } from '../../types/ChatType';
import { httpGet } from "../../utils/http.ts";
import { useSelector } from "react-redux";
import { sessionSelector } from "../../store/session.ts";
import ProfileImage from "../NavBar/ProfileImage.tsx";
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

export default function Chats() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([])
    const [filteredChats, setFilteredChats] = useState<Chat[]>([])
    const { selectedChat, setSelectedChat } = useChats();
    const session = useSelector(sessionSelector);
    const chatTableRef = useRef<HTMLTableElement>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 5;

    useEffect(() => {
        if (searchQuery.length > 1) {
            const filtered = chats.filter(chat =>
                chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredChats(filtered);
        } else {
            setFilteredChats(chats);
        }
    }, [searchQuery]);

    useEffect(() => {
        httpGet("chats").then((response: any) => {
            setChats(response.data as Chat[]);
            setFilteredChats(response.data as Chat[]);
        });
    }, [session.isLogged]);

    useEffect(() => {
        httpGet("chats").then((response: any) => {
            setChats(response.data as Chat[]);
            setFilteredChats(response.data as Chat[]);
        });
    }, []);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const filtered = chats.filter(chat => {
                const parts = chat.chatName.split(" - ");
                // Identify the part of the chat name that is not the logged-in user
                const otherUser = parts.find(part => part.toLowerCase() !== session.nickname.toLowerCase());
                // Check if the search query is included in the other user's name
                const includesQuery = otherUser?.toLowerCase().includes(searchQuery.toLowerCase());

                return includesQuery;
            });
            console.log(filtered);
            setFilteredChats(filtered);
        } else {
            setFilteredChats(chats);
        }
    }, [searchQuery, chats]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredChats.length / usersPerPage);

    // Get current users for the page
    let currentChats = filteredChats.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


    const buildUrl = (chatPic: string) => {
        if (chatPic === undefined) {
            return chatPic;
        }

        let build = chatPic.split(" - ")
        let first = build[0] + build[1];
        let second = build[0] + build[2];

        if (build.length === 1)
            return chatPic

        if (first === session.profilePic || first === undefined)
            return second
        else
            return first

    }

    return (
        <Container style={{ marginLeft: "10rem" }}>
            <Row className="mt-5">
                <Col>
                    <Table ref={chatTableRef} style={{ width: "80%" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pesquisar conversa..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            maxWidth: '300px', margin: '0 auto', marginBottom: '1rem'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredChats.length > 0 ? (
                                currentChats.map((chat) => (
                                    <TableRow
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        style={{ cursor: "pointer" }}
                                        hover
                                    >
                                        <TableCell style={{ display: "flex", flexWrap: "wrap", alignItems: "center", backgroundColor: selectedChat && selectedChat.id === chat.id ? '#f0f0f0' : 'transparent' }}>
                                            <ProfileImage
                                                icon={buildUrl(chat.chatPic)}
                                            />

                                            {chat.chatName.split(" - ").filter(name => name !== session.nickname)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        Não tem conversas com ninguém
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {filteredChats.length > 0 && (
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
        </Container >
    );
}
