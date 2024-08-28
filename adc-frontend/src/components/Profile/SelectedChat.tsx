import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { Paper, TableBody, TableRow, TableCell } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useChats } from '../../contexts/ChatContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { sessionSelector } from "../../store/session.ts";
import { useSelector } from "react-redux";
import { httpGet, httpPost } from "../../utils/http.ts";
import { Message } from "../../types/MessageType.ts";
import ProfileImage from '../NavBar/ProfileImage.tsx';
import { useNavigate } from 'react-router-dom';
// import SockJS from "sockjs-client";
// import {Client, over} from "stompjs";
// let websocket : Client;
// const ip = "https://treapapp.ew.r.appspot.com/"

export default function SelectedChat() {
    const [selectedFriend, setSelectedFriend] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [profileImages, setProfileImages] = useState<{ [key: string]: string }>({});
    const currentPage = 0;
    const session = useSelector(sessionSelector);
    const [inter, setInter] = useState<any>(null);
    const { selectedChat } = useChats();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef<boolean>(false);
    const [isCommunityChat, setIsCommunityChat] = useState<boolean>(false);
    const navigate = useNavigate();

    function getMsgs() {
        if (selectedChat) {
            httpGet(`chats/messages?chatId=${selectedChat.id}&page=${currentPage}`).then((res: any) => {
                setMessages(res.data.content || []);
                // WS NOT SUPPORTED IN GAE STANDARD...
                /*const socket = new SockJS(ip + "ws")
                websocket = over(socket)
                websocket.connect({}, () => {
                    websocket.subscribe("/topic/msg-" + selectedChat?.id, (msg: any) => {
                        setMessages((prev: Message[]) => ([...prev, JSON.parse(msg.body)]));
                        scrollToBottom();
                    });
                    websocket.subscribe("/topic/writing-" + selectedChat?.id, onWrite)
                }, err => console.log(err))*/
            });
        }
    }

    useEffect(() => {
        if (selectedChat) {
            if (inter) clearInterval(inter);

            const intervalId = setInterval(getMsgs, 2000);
            setInter(intervalId);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [selectedChat]);

    useEffect(() => {
        if (selectedChat) {
            let name = selectedChat.chatName.split(" - ").filter(name => name !== session.nickname)[0];
            setSelectedFriend(name);
            setIsCommunityChat(selectedChat.chatName.indexOf(" - ") === -1);
            getMsgs();  // Ensure messages are loaded when the chat is selected
        }
    }, [selectedChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
            isAtBottomRef.current = true;
        } else if (isAtBottomRef.current) {
            isAtBottomRef.current = false;
        }
    }, [messages]);

    const handleSendMsg = () => {
        if (selectedChat) {
            const trimmedInput = inputText.trim();
            if (trimmedInput) {
                // WS NOT SUPPORTED IN GAE STANDARD...
                /*websocket.send("/app/chat/msg-" + selectedChat.id, {}, JSON.stringify({
                    originNickname: session.nickname,
                    message: trimmedInput,
                }));*/
                httpPost(`chats/messages/${selectedChat.id}`, { originNickname: session.nickname, message: trimmedInput }).then(
                    () => {
                        setMessages([...messages, { originNickname: session.nickname, message: trimmedInput }]);
                        setInputText("");
                        isAtBottomRef.current = false;
                    }
                );
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMsg();
        }
    };

    const scrollToBottom = () => {
        if (!isAtBottomRef.current || messages) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
            isAtBottomRef.current = true;
        }
    };

    // WS NOT SUPPORTED IN GAE STANDARD...
    // function onWrite(payload: any) {
    //     const body: any = JSON.parse(payload.body)
    //     setWriting(prev => {
    //         const array: any = [...prev]
    //         if (body.writing && body.user !== session.nickname)
    //             array.push(body.user)
    //         else {
    //             const i = array.indexOf((it: any) => it === body.user)
    //             array.splice(i, 1)
    //         }
    //         return array
    //     })
    // }

    // function focus() {
    //     websocket?.send(`/app/chat/writing-${selectedChat?.id}`, {}, JSON.stringify({ user: session.nickname, writing: true }))
    // }

    // function blur() {
    //     websocket?.send(`/app/chat/writing-${selectedChat?.id}`, {}, JSON.stringify({ user: session.nickname, writing: false }))
    // }

    const handleGetUser = async (nickname: string) => {
        try {
            const res = await httpGet(`users/${nickname}`);
            const answer = res.data as any;
            if (answer.profilePic) {
                return { profilePic: answer.profilePic, nickname: answer.nickname };
            } else {
                return { profilePic: "", nickname: answer.nickname };
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return { profilePic: "", nickname: "" };
        }
    };

    useEffect(() => {
        const fetchProfileImages = async () => {
            const images: { [key: string]: string } = {};
            for (const msg of messages) {
                if (!images[msg.originNickname]) {
                    const user = await handleGetUser(msg.originNickname);
                    images[msg.originNickname] = user.profilePic || user.nickname;
                }
            }
            setProfileImages(images);
        };

        fetchProfileImages();
    }, [messages]);

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <Table style={{ width: "35rem" }}>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {selectedChat ? (
                                        <Paper elevation={3} style={{ padding: '10px', height: "26rem" }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                width: '100%',
                                                marginTop: '0.5rem'
                                            }}>
                                                A conversar com {selectedFriend}
                                            </div>
                                            <hr />
                                            <div style={{ display: 'flex', flexDirection: 'column', height: '20rem' }}>
                                                <div className="scrollable-element" style={{ overflowY: 'scroll', flexGrow: 1 }} >
                                                    {messages.slice().reverse().map((msg, index) => (
                                                        <div key={index} style={{ clear: 'both' }}>
                                                            <p style={{
                                                                backgroundColor: msg.originNickname === session.nickname ? 'var(--teal)' : 'var(--federal-blue)',
                                                                borderColor: msg.originNickname === session.nickname ? 'var(--teal)' : 'var(--federal-blue)',
                                                                color: 'white',
                                                                padding: '0.5rem',
                                                                marginRight: "2rem",
                                                                float: msg.originNickname === session.nickname ? 'right' : 'left',
                                                                marginBottom: '0.1rem',
                                                                display: 'inline-block',
                                                                maxWidth: '80%',
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'pre-wrap',
                                                                borderRadius: '10px',
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    {isCommunityChat && msg.originNickname !== session.nickname && profileImages[msg.originNickname] && (
                                                                        <>
                                                                            {profileImages[msg.originNickname].startsWith('http') ? (
                                                                                <ProfileImage icon={profileImages[msg.originNickname]} onProfileClick={() => { navigate(`/profile/${msg.originNickname}`) }} width="30px" height="30px" />
                                                                            ) : (
                                                                                <b style={{ color: 'var(--teal)', cursor: "pointer" }} onClick={() => { navigate(`/profile/${msg.originNickname}`) }}>{msg.originNickname + " - "}</b>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                    {msg.message}
                                                                </div>
                                                            </p>
                                                        </div>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    marginTop: '2rem'
                                                }}>
                                                    <hr />
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Escreva a sua mensagem..."
                                                        value={inputText}
                                                        onChange={(e) => setInputText(e.target.value)}
                                                        onKeyDown={handleKeyPress}
                                                        style={{
                                                            width: '80%',
                                                            marginRight: '1rem'
                                                        }}
                                                    />
                                                    <FontAwesomeIcon icon={faPaperPlane}
                                                        style={{
                                                            backgroundColor: 'var(--teal)',
                                                            borderColor: 'var(--teal)',
                                                            padding: '0.7rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            color: 'white',
                                                            borderRadius: '10%',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={handleSendMsg}
                                                    />
                                                </div>
                                            </div>
                                        </Paper>
                                    ) : (
                                        <Paper elevation={3} style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: "26rem"
                                        }}>
                                            Não tem conversas selecionadas.
                                        </Paper>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

// { writing.length > 0 ? writing.join(", ") + (writing.length === 1 ? " está a escrever..." : "estão a escrever...") : selectedFriend }}
