import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:first-of-type {
    background-color: var(--teal);
    color: white;
  }

  &:last-of-type {
    background-color: lightgray;
  }
`;



interface ConfirmModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  message: string;
}

const PopUpModal: React.FC<ConfirmModalProps> = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal show={isOpen} onHide={onRequestClose} centered>
      <ModalContent>
        <h4>{message}</h4>
        <ButtonGroup>
          <Button onClick={onConfirm}>Sim, tenho a certeza</Button>
          <Button onClick={onRequestClose}>Cancelar</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default PopUpModal;
