import DeleteChat from "../../components/Profile/DeleteChat";
import Chats from "../../components/Profile/Chats";
import SelectedChat from "../../components/Profile/SelectedChat";
import NewMessage from "../../components/Profile/NewChat.tsx";
import styled from "styled-components";
import { ChatProvider } from "../../contexts/ChatContext.tsx";

const MarginLeft = styled.div`
  margin-left: 5rem;
`;

const NextToEachOther = styled.div`
  display: flex;
`;

export default function MessagesPage() {
    return (
        <MarginLeft>
            <ChatProvider>
                <NewMessage />
                <hr style={{ maxWidth: "100rem", marginLeft: "11rem" }} />
                <NextToEachOther>
                    <Chats />
                    <DeleteChat />
                    <SelectedChat />
                </NextToEachOther>
            </ChatProvider>
        </MarginLeft>
    );
}