import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default function DeleteChat() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState<string[]>([]);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const handleDeleteUser = () => {
        if (userToDelete) {
            const updatedUsers = users.filter(user => user !== userToDelete);
            setUsers(updatedUsers);
            setShowModal(false);
            setUserToDelete(null);
        }
    };

    return (
        <Modal style={{ marginTop: '20%' }} show={showModal} onHide={() => setShowModal(false)} >
            <Modal.Body>
                <p style={{ display: "flex", justifyContent: "center" }}><strong>Tem a certeza que quer apagar a conversa?</strong></p>
                <hr />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button style={{
                        backgroundColor: 'var(--teal)',
                        borderColor: 'var(--teal)',
                        textDecoration: 'none',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                    }} onClick={handleDeleteUser}>
                        Sim
                    </Button>
                    <span style={{ margin: '1rem' }}></span>
                    <Button onClick={() => setShowModal(false)}>
                        Não
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}