import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { httpPut, httpPost } from "../../../../utils/http";
import { sessionSelector } from "../../../../store/session";
import { Avatar, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCheck,
  faCircleDown,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PopUpModal from "../../../PopUpModal";
import { set } from "../../../../store/snackbar";
import { useNavigate } from "react-router-dom";

const RequestContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-left: 2rem;
  margin-right: 1.5rem;
  margin-top: 1rem;
`;

const RequestInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RequestStatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RequestStatusIcon = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

export default function CommunityMember({
  member,
  activeSection,
  role,
  communityName,
  fetchCommunityMembers,
  removeRequest,
  isModerator,
  leaderNickname
}: any) {
  const session = useSelector(sessionSelector);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleAcceptRequest(member: string) {
      console.log(isModerator)
    if (session.isLogged) {
      httpPut("/communities/accept", {
        name: communityName,
        nickname: member,
      })
        .then((response: any) => {
          console.log("Solicitação aceite com sucesso", response);
          removeRequest(member);
        })
        .catch((error: any) => {
          console.error("Erro ao aceitar solicitação", error);
          if (error.status === 409) {
            dispatch(
              set({
                open: true,
                message: "Utilizador não encontrado.",
                type: "error",
                autoHideDuration: 3000,
              })
            );
          }
          if (error.status === 406) {
            dispatch(
              set({
                open: true,
                message:
                  "Não pode aceitar mais utilizadores, a comunidade já se encontra lotada.",
                type: "error",
                autoHideDuration: 3000,
              })
            );
          }
        });
    }
  }

  function handleRejectRequest(member: string) {
    if (session.isLogged) {
      httpPut("/communities/reject", {
        name: communityName,
        nickname: member,
      })
        .then((response: any) => {
          console.log("Pedido eliminado com sucesso", response);
          removeRequest(member);
        })
        .catch((error: any) => {
          console.error("Erro ao eliminar pedido", error);
          if (error.status === 409) {
            dispatch(
              set({
                open: true,
                message: "Utilizador não encontrado.",
                type: "error",
                autoHideDuration: 3000,
              })
            );
          }
        });
    }
  }

  function handlePromote(member: string) {
    if (role === "moderator") {
      setModalMessage(
        "Tem a certeza de que deseja promover o utilizador a Líder? Você deixará de ser o líder desta comunidade."
      );
      setShowPromoteModal(true);
    } else {
      promoteUser(member);
    }
  }

  function promoteUser(member: string) {
    if (session.isLogged && communityName) {
      httpPost(`/communities/promote/${member}`, {
        nickname: member,
        name: communityName,
      })
        .then((response) => {
          console.log("Utilizador Promovido com sucesso", response);
          fetchCommunityMembers();
        })
        .catch((error) => {
          console.error("Ocorreu um erro ao promover o usuário", error);
        });
    }
  }

  function handleConfirmPromotion(member: string) {
    promoteUser(member);
    setShowPromoteModal(false);
  }

  function handleDemote(member: string) {
    if (session.isLogged && communityName) {
      httpPost(`/communities/demote/${member}`, {
        nickname: member,
        name: communityName,
      })
        .then((response) => {
          console.log("Utilizador Despromovido com sucesso", response);
          fetchCommunityMembers();
        })
        .catch((error) => {
          console.error("Ocorreu um erro ao despromover o usuário", error);
        });
    }
  }

  return (
    <RequestContainer>
      <RequestInfoContainer>
        <Avatar
          src={member.profilePic}
          sx={{ marginRight: "20px", height: "2.5rem", width: "2.5rem", cursor: "pointer"}}
          onClick={() => navigate(`/profile/${member.nickname}`)}
        />
        <Typography variant="body1">{member.nickname}</Typography>
      </RequestInfoContainer>
      {activeSection === "requests" ? (
        <RequestStatusContainer>
          <RequestStatusIcon
            icon={faCheck}
            style={{ color: "var(--teal)", cursor: "pointer" }}
            onClick={() => handleAcceptRequest(member.nickname)}
          />
          <RequestStatusIcon
            icon={faXmark}
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleRejectRequest(member.nickname)}
          />
        </RequestStatusContainer>
      ) : (
        activeSection === "members" && session.nickname === leaderNickname && (
          <RequestStatusContainer>
            {role !== "leader" && (
              <RequestStatusIcon
                icon={faCircleUp}
                style={{ color: "var(--teal)", cursor: "pointer" }}
                onClick={() => handlePromote(member.nickname)}
              />
            )}
            {role === "moderator" && (
              <RequestStatusIcon
                icon={faCircleDown}
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDemote(member.nickname)}
              />
            )}
          </RequestStatusContainer>
        )
      )}

      <PopUpModal
        isOpen={showPromoteModal}
        onRequestClose={() => setShowPromoteModal(false)}
        onConfirm={() => handleConfirmPromotion(member.nickname)}
        message={modalMessage}
      />
    </RequestContainer>
  );
}
