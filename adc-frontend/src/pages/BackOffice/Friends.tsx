import styled from "styled-components";
import PaperWithFriendStats from "../../components/BackOffice/PaperWithFriendStats";
import FriendsList from "../../components/BackOffice/FriendsList";
import Requests from "../../components/BackOffice/Requests.tsx";
import { FriendsProvider } from '../../contexts/FriendsContext';
import Invites from "../../components/BackOffice/Invites.tsx";

const FriendsContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-left: -1rem;
`;

const MarginTop = styled.div`
  margin-top: 6rem;
  margin-left: 17rem;
`;

export default function Friends() {
    return (
        <FriendsProvider>
            <MarginTop>
                <PaperWithFriendStats />
                <FriendsContainer>
                    <FriendsList />
                    <Requests />
                    <Invites />
                </FriendsContainer>
            </MarginTop>
        </FriendsProvider>
    );
}
