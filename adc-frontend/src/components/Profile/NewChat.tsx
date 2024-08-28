import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import { httpGet, httpPost } from "../../utils/http.ts";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";
import { useChats } from "../../contexts/ChatContext";
import { set } from "../../store/snackbar.ts";
import { Chat } from "../../types/ChatType";
import { sessionSelector } from "../../store/session.ts";

export default function NewChat() {
    const [friends, setFriends] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [newMsgSidePanelOpen, setNewMsgSidePanelOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const session = useSelector(sessionSelector);
    const { chats, addChat } = useChats();

    useEffect(() => {
        if (newMsgSidePanelOpen) {
            httpGet("friends/" + session.nickname).then((response: any) => {
                const allFriends = response.data as string[];
                const friendsWithoutChats = allFriends.filter(friend => !chats.some(chat => chat.chatName.includes(friend)));
                setFriends(friendsWithoutChats);
            });
        }
    }, [newMsgSidePanelOpen, chats]);

    const handleSelectedUser = () => {
        if (selectedUsers.length > 0) {
            setNewMsgSidePanelOpen(false);
            httpPost("chats", selectedUsers).then((response: any) => {
                const newChat = response.data as Chat[];
                addChat(newChat);

                dispatch(set({
                    open: true,
                    message: "Conversas criadas com sucesso",
                    type: "info",
                    autoHideDuration: 3000,
                }));
                setSelectedUsers([]);
                window.location.href = `/profile/${session.nickname}/messages`;
            });
        }
    };

    const handleCheckboxChange = (user: string) => {
        if (selectedUsers.includes(user)) {
            setSelectedUsers(selectedUsers.filter(u => u !== user));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    return (
        <Container style={{ marginTop: '8rem' }}>
            <Row >
                <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 style={{ color: '#1B5E20', marginLeft: "12rem" }}>Conversas</h2>
                    <Button
                        style={{
                            backgroundColor: 'var(--teal)',
                            borderColor: 'var(--teal)',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onClick={() => setNewMsgSidePanelOpen(true)}
                    >
                        Iniciar uma nova conversa
                    </Button>
                </Col>
            </Row>
            <Modal style={{ marginTop: '20%' }} show={newMsgSidePanelOpen}>
                <Modal.Body>
                    <p style={{ display: "flex", justifyContent: "center" }}><strong>Escolha o amigo com quem quer começar uma conversa!</strong></p>
                    <hr />
                    <div style={{ maxHeight: '9rem', overflowY: 'auto', flexGrow: 1 }}>
                        <Table style={{ marginTop: "-1rem" }}>
                            <TableBody>
                                {friends.length > 0 ? (
                                    friends.map(user => (
                                        <TableRow key={user}>
                                            <TableCell
                                                align="center"
                                                onClick={() => handleCheckboxChange(user)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: selectedUsers.includes(user) ? '#f0f0f0' : 'transparent', // Change the color as needed
                                                    marginRight: '0.5rem'
                                                }}
                                            >
                                                {user}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell align="center">
                                            Não tens amigos disponíveis para iniciar uma conversa!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <span style={{ margin: '1rem' }}></span>
                    <div style={{ display: "flex" }}>
                        <Button style={{
                            backgroundColor: 'var(--teal)',
                            borderColor: 'var(--teal)',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }} onClick={() => handleSelectedUser()} disabled={selectedUsers.length == 0}>
                            Selecionar utilizador
                        </Button>
                        <span style={{ margin: '1rem' }}></span>
                        <Button style={{
                            backgroundColor: 'red',
                            borderColor: 'red',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }} onClick={() => setNewMsgSidePanelOpen(false)}>
                            Cancelar
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Container >
    );
}
