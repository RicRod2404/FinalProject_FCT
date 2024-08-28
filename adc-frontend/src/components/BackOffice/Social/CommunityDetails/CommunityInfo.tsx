import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { httpPut, httpDelete } from "../../../../utils/http";
import { useState } from "react";
import { sessionSelector } from "../../../../store/session";
import { Avatar, Paper, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartSimple,
  faArrowTurnUp,
  faCertificate,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import PopUpModal from "../../../PopUpModal";
import { set } from "../../../../store/snackbar";
import EditCommunityDialog from "./EditCommunityDialog";

const StyledIconWrapper = styled.div<{ tooltip: string; showTooltip: boolean }>`
  width: 4.5rem;
  height: 4.5rem;
  color: var(--federal-blue);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border: 10px solid white;
  background-color: white;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;

  &::after {
    content: "${(props) => props.tooltip}";
    position: absolute;
    background-color: var(--federal-blue);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 0.8rem;
    z-index: 1;
    display: ${(props) => (props.showTooltip ? "block" : "none")};
  }
`;

const StyledButtonWithTooltip = styled(Button)<{
  tooltip: string;
  showTooltip: boolean;
}>`
  position: relative;
  width: 6rem !important;
  border: none !important;
  color: white !important;
  margin-top: 2rem !important;
  margin-bottom: 1rem;
  text-transform: none !important;
  font-size: 1rem !important;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)}; 
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  
  &:hover::after {
  font-size: 0.8rem;
    content: "${(props) => props.tooltip}";
    position: absolute;
    background-color: white;
    color: var(--federal-blue);
    padding: 4px 8px;
    border-radius: 4px;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 1;
    display: ${(props) => (props.showTooltip ? "block" : "none")};
  }
`;

const ProfileAvatar = styled(Avatar)({
  display: "flex",
  position: "relative",
  border: "2px solid #fff",
  marginTop: "-10rem",
  backgroundColor: "white",
});

const H1 = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--teal);
  font-weight: bolder;
  font-size: 2rem;
  margin-top: 1rem;
`;

const Text = styled.h1`
  user-select: none;
  color: var(--teal);
  font-size: 2rem;
  display: flex;
  padding-left: 1rem;
`;

const Description = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  cursor: pointer;

  &:hover::after {
    content: attr(data-fulltext);
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background-color: white;
    padding: 0.5rem;
    z-index: 1;
    white-space: normal;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 70%;
    overflow: auto;
  }
`;

const IconWrapper = ({ icon, tooltip }: any) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <StyledIconWrapper
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      showTooltip={showTooltip}
      tooltip={tooltip}
    >
      <FontAwesomeIcon icon={icon} style={{ width: "3rem", height: "3rem" }} />
    </StyledIconWrapper>
  );
};

const ButtonWithTooltip = ({
  tooltip,
  onClick,
  children,
  style,
  showTooltip,
}: any) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative' }}
    >
      <StyledButtonWithTooltip
        onClick={onClick}
        style={style}
        showTooltip={showTooltip && hover}
        tooltip={tooltip}
      >
        {children}
      </StyledButtonWithTooltip>
    </div>
  );
};

export default function CommunityInfo({ community, isLoading, isMember }: any) {
  const [image] = useState<File | null>(null);
  const session = useSelector(sessionSelector);
  const [leaveModalIsOpen, setLeaveModalIsOpen] = useState(false);
  const [leaveModalMessage, setLeaveModalMessage] = useState("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const {
    leaderNickname,
    name,
    communityPic,
    description,
    communityLevel,
    communityExpToNextLevel,
    communityExp,
    isPublic,
    maxMembers,
    minLevelToJoin,
    currentMembers,
  } = community;

  function handleLeaveCommunity() {
    if (session.isLogged) {
      httpPut("/communities/leave", {
        name: name,
        nickname: session.nickname,
      })
        .then((response: any) => {
          console.log("Saiu comunidade com sucesso", response);
          setLeaveModalIsOpen(false);
          dispatch(
            set({
              open: true,
              message: "Saiu da Comunidade com sucesso",
              type: "success",
              autoHideDuration: 3000,
            })
          );
          window.location.href = `/backoffice/social/home`;
        })
        .catch((error: any) => {
          console.error("Erro ao sair da comunidade", error);
          dispatch(
            set({
              open: true,
              message: "Ocorreu algo de errado ao sair da comunidade.",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        });
    }
  }

  function handleDeleteCommunity() {
    if (session.isLogged) {
      httpDelete(`/communities/${name}`)
        .then((response: any) => {
          console.log("Comunidade excluída com sucesso", response);
          setDeleteModalIsOpen(false);
          dispatch(
            set({
              open: true,
              message: "Comunidade eliminada com sucesso",
              type: "success",
              autoHideDuration: 3000,
            })
          );
          window.location.href = `/backoffice/social/home`;
        })
        .catch((error: any) => {
          console.error("Erro ao excluir a comunidade", error);
          if (error.status === 403) {
            dispatch(
              set({
                open: true,
                message: "Não tem permissão para eliminar esta comunidade.",
                type: "error",
                autoHideDuration: 3000,
              })
            );
          }
        });
    }
  }

  const openDeleteCommunityModal = () => {
    setDeleteModalMessage(
      "Tem certeza de que deseja excluir permanentemente a comunidade?"
    );
    setDeleteModalIsOpen(true);
  };

  const openLeaveCommunityModal = () => {
    setLeaveModalMessage("Tem certeza de que deseja sair da comunidade?");
    setLeaveModalIsOpen(true);
  };

  return (
    <div
      style={{
        marginTop: "16rem",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginRight: "-7rem",
        marginLeft: "3rem",
      }}
    >
      <ProfileAvatar
        src={image ? URL.createObjectURL(image) : communityPic}
        sx={{
          width: 240,
          height: 240,
          boxShadow: "0 20px 20px rgba(0, 0, 0, 0.1)",
        }}
      />

      {isLoading ? (
        <Paper
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50rem",
            height: "20rem",
            marginTop: "2rem",
          }}
          elevation={9}
        >
          <H1>A carregar...</H1>
        </Paper>
      ) : (
        <Paper
          style={{
            display: "grid",
            width: "50rem",
            height: "21rem",
            marginTop: "2rem",
            gridTemplateRows: "1fr 1fr 1fr 1fr",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            padding: "2rem",
          }}
          elevation={9}
        >
          <div
            style={{
              gridColumn: "1 / span3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <H1>{name}</H1>
          </div>
          <div
            style={{
              gridColumn: "1 / span 3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Description data-fulltext={description}>{description}</Description>
          </div>
          <div
            style={{
              gridColumn: "1 / span 2",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginLeft: "3rem",
            }}
          >
            <IconWrapper icon={faChartSimple} tooltip="Exp da Comunidade" />
            <Text> {`${communityExp} / ${communityExpToNextLevel}`}</Text>
            <Text> exp </Text>
          </div>
          <div
            style={{
              gridColumn: "3 / 4",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginLeft: "3rem",
            }}
          >
            <IconWrapper icon={faCertificate} tooltip="Nível da Comunidade" />
            <Text> {communityLevel}</Text>
          </div>
          <div
            style={{
              gridColumn: "1 / 2",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginLeft: "3rem",
            }}
          >
            <IconWrapper
              icon={isPublic ? faUnlock : faLock}
              tooltip="Estado da Comunidade"
            />
            <Text> {isPublic ? "Public" : "Private"}</Text>
          </div>
          <div
            style={{
              gridColumn: "2 / 3",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginLeft: "3.5rem",
            }}
          >
            <IconWrapper icon={faUsers} tooltip="Membros da Comunidade" />
            <Text> {`${currentMembers} / ${maxMembers}`}</Text>
          </div>
          <div
            style={{
              gridColumn: "3 / 4",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginLeft: "3rem",
            }}
          >
            <IconWrapper
              icon={faArrowTurnUp}
              tooltip="Nível Mínimo para se juntar à Comunidade"
            />
            <Text> {minLevelToJoin}</Text>
          </div>
        </Paper>
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        <ButtonWithTooltip
          style={{ backgroundColor: "var(--teal)" }}
          tooltip="Voltar à página anterior"
          onClick={() => (window.location.href = "/backoffice/social/home")}
          showTooltip={false}
        >
          Voltar
        </ButtonWithTooltip>
        {session.nickname === leaderNickname && (
          <ButtonWithTooltip
            tooltip="Para poder sair deve passar a liderança"
            onClick={() => console.log("Switch leadership")}
            style={{ backgroundColor: "var(--veronica)" }}
            showTooltip={true}
          >
            Sair
          </ButtonWithTooltip>
        )}
        {isMember && session.nickname !== leaderNickname && (
          <ButtonWithTooltip
            style={{ backgroundColor: "var(--veronica)" }}
            tooltip="Sair da Comunidade"
            onClick={openLeaveCommunityModal}
            showTooltip={true}
          >
            Sair
          </ButtonWithTooltip>
        )}
        <PopUpModal
          isOpen={leaveModalIsOpen}
          onRequestClose={() => setLeaveModalIsOpen(false)}
          onConfirm={handleLeaveCommunity}
          message={leaveModalMessage}
        />
        {session.nickname === leaderNickname && (
          <>
            <ButtonWithTooltip
              style={{ backgroundColor: "var(--veronica)" }}
              tooltip="Editar Comunidade"
              onClick={() => setShowModal(true)}
              showTooltip={false} 
            >
              Editar
            </ButtonWithTooltip>
            <ButtonWithTooltip
              style={{ backgroundColor: "var(--veronica)" }}
              tooltip="Eliminar Comunidade"
              onClick={openDeleteCommunityModal}
              showTooltip={false} 
            >
              Eliminar
            </ButtonWithTooltip>
            <EditCommunityDialog
              showModal={showModal}
              setShowModal={setShowModal}
              community={community}
            />
          </>
        )}
        <PopUpModal
          isOpen={deleteModalIsOpen}
          onRequestClose={() => setDeleteModalIsOpen(false)}
          onConfirm={handleDeleteCommunity}
          message={deleteModalMessage}
        />
      </div>
    </div>
  );
}
