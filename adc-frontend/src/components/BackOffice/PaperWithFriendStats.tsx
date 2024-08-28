import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionSelector } from '../../store/session';
import { httpPut, httpGet } from '../../utils/http';
import styled from 'styled-components';
import { Paper } from '@mui/material';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { set } from "../../store/snackbar";

const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  flex-direction: column;
  width: 110%;
  padding: 1rem;
  margin-top: 3rem;
  height: 10rem;
`;

export default function PaperWithFriendStats() {
    const dispatch = useDispatch();
    const session = useSelector(sessionSelector);
    const [users, setUsers] = useState<string[]>([]);
    const [addFriend, setAddFriend] = useState("");
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const handleSelectUser = (user: string) => {
        setAddFriend(user);
        setSelectedUser(user);
        setUsers([]);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setAddFriend(value);

        if (value.length > 1) {
            httpGet(`users/search/${value}`).then((response) => {
                let allUsers = response.data as string[];
                const BfrfilteredUsers = allUsers.filter(user => user !== session.nickname && user.toLowerCase().includes(value.toLowerCase()));
                setUsers(BfrfilteredUsers);
            });

            const exactMatch = users.find(user => user.toLowerCase() === value.toLowerCase());
            if (exactMatch) {
                setSelectedUser(exactMatch);
            } else {
                setSelectedUser(null);
            }
        } else {
            setUsers([]);
            setSelectedUser(null);
        }
    };

    const addFriendSubmit = async () => {
        if (selectedUser || addFriend) {
            const username = selectedUser ? selectedUser : addFriend;
            try {
                await httpPut(`/friends/${username}`, {});
                dispatch(set({
                    open: true,
                    message: "Friend request sent successfully",
                    type: "success",
                    autoHideDuration: 3000,
                }));
                //setAddFriend("");
                //TODO: FIX TEMPORARY SOLUTION
                window.location.reload();
            } catch (error) {
                dispatch(set({
                    open: true,
                    message: "Error sending friend request",
                    type: "error",
                    autoHideDuration: 3000,
                }));
            }
        }
    };

    return (
        <StyledPaper>
            <div style={{ flex: 1, lineHeight: "1.2", marginTop: "1rem" }}>
                <p style={{ marginInline: "5rem" }}><strong>Adicionar amigo</strong></p>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Username..."
                        value={addFriend}
                        onChange={handleInputChange}
                        style={{
                            maxWidth: '300px', margin: '0 auto', marginBottom: '1rem'
                        }}
                    />
                    <Dropdown.Menu show={users.length > 0} style={{ marginTop: "2.4rem", maxHeight: "10rem", overflowY: "auto", width: "100%" }}>
                        {users.map(user => (
                            <Dropdown.Item key={user} onClick={() => handleSelectUser(user)}>
                                {user}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                    <Button variant="primary" style={{ height: "2.4rem", backgroundColor: "var(--federal-blue)", border: "none" }} onClick={addFriendSubmit}>Enviar</Button>
                </InputGroup>
            </div>
        </StyledPaper>
    );
}
