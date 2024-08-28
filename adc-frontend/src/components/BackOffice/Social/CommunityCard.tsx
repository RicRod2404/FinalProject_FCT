import {
  CardContent,
  CardHeader,
  Card,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faUserPlus,
  faUserCheck,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { httpPut, httpGet } from "../../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../../store/snackbar";
import { useState, useEffect } from "react";
import { sessionSelector } from "../../../store/session";
import { setCommunity } from "../../../store/community.ts";
import { useNavigate } from "react-router-dom";

const ComunityAvatar = styled(Avatar)({
  display: "flex",
  position: "relative",
  border: "2px solid #fff",
  backgroundColor: "white",
});

const IconContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon) <{ joined: boolean }>`
  margin-left: 1rem;
  width: 20px;
  height: 20px;
  border: 8px solid white;
  color: ${(props) => (props.joined ? "var(--teal)" : "var(--veronica)")};
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
`;

const StyledFontAwesomeIconIsPublic = styled(FontAwesomeIcon) <{
  isPublic: boolean;
}>`
  margin-left: 1rem;
  width: 20px;
  height: 20px;
  border: 8px solid white;
  color: ${(props) => (props.isPublic ? "var(--teal)" : "var(--veronica)")};
  background-color: white;
  border-radius: 50%;
`;

interface MembersData {
  nickname: string;
  profilePic: string;
}

interface CommunityMemberProps {
  member: MembersData;
  role?: string;
}

const CommunityMember = ({ member, role }: CommunityMemberProps) => (
  <div style={{ display: "flex", alignItems: "center", padding: "10px 20px" }}>
    <Avatar
      src={member.profilePic}
      sx={{ marginRight: "20px", height: "2.5rem", width: "2.5rem" }}
    />
    <Typography variant="body1" sx={{ fontWeight: role ? "bold" : "normal" }}>
      {member.nickname}
    </Typography>
  </div>
);

interface CommunityDividerProps {
  show: boolean;
}

const CommunityDivider = ({ show }: CommunityDividerProps) =>
  show ? <Divider sx={{ borderWidth: "2px" }} /> : null;

interface CommunityApiResponse {
  leaderNickname?: string;
  leaderProfilePic?: string;
  members?: MembersData[];
  moderators?: MembersData[];
}

export default function CommunityCard({ community, activeSection }: any) {
  const dispatch = useDispatch();
  const [joined, setJoined] = useState(false);
  const [leader, setLeader] = useState<MembersData | null>(null);
  const [members, setMembers] = useState<MembersData[]>([]);
  const [moderators, setModerators] = useState<MembersData[]>([]);
  const session = useSelector(sessionSelector);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { name, communityPic, isPublic, maxMembers, currentMembers } =
    community;

  const filteredMembers = members.filter((member) =>
    leader ? member.nickname !== leader.nickname : true
  );
  const filteredModerators = moderators.filter((moderator) =>
    leader ? moderator.nickname !== leader.nickname : true
  );

  function joinCommunity(event: React.MouseEvent) {
    event.stopPropagation();
    setIsLoading(true);
    httpPut(`/communities/join/${name}`, {})
      .then(() => {
        dispatch(
          set({
            open: true,
            message: isPublic ? "Entrou na comunidade com sucesso" : "Pedido enviado com sucesso",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        setJoined(true);
      })
      .catch((error) => {
        console.error("Erro ao enviar pedido de adesão à comunidade:", error);
        if (error.status === 403) {
          dispatch(
            set({
              open: true,
              message:
                "Ainda não tem nível suficiente para se juntar à comunidade.",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
        if (error.status === 409) {
          dispatch(
            set({
              open: true,
              message: "Já se encontra na lista de membros desta comunidade.",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
        if (error.status === 406) {
          dispatch(
            set({
              open: true,
              message: "A comunidade já se encontra lotada.",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (session.isLogged) {
      setIsLoading(true);
      httpGet(`/communities/members/${name}`)
        .then((response: any) => {
          const data: CommunityApiResponse = response.data;
          if (data) {
            const fetchedLeader =
              data.leaderNickname && data.leaderProfilePic
                ? {
                  nickname: data.leaderNickname,
                  profilePic: data.leaderProfilePic,
                }
                : null;
            setLeader(fetchedLeader);

            setMembers(data.members || []);
            setModerators(data.moderators || []);

            const isMember = [
              fetchedLeader,
              ...(data.moderators || []),
              ...(data.members || []),
            ].some((member) => member?.nickname === session.nickname);

            setJoined(isMember);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar membros da comunidade:", error);
          setMembers([]);
          setModerators([]);
          setLeader(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [session.isLogged, name]);

  return (
    <Card sx={{ width: "30rem", height: "auto" }}>
      <CardHeader
        avatar={
          <ComunityAvatar src={communityPic} sx={{ width: 70, height: 70 }} />
        }
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            onClick={() => {
              dispatch(setCommunity({ name: name }))
              navigate("/backoffice/social/community")
            }
            }
          >
            <span style={{ fontSize: "20px", color: "white" }}>{name}</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconContainer style={{ backgroundColor: "white", borderRadius: "50px", width: "3.5rem", height: "2rem" }}>
                <span
                  style={{ fontSize: "15px", color: "var(--veronica)" }}
                >{`${currentMembers}/${maxMembers}`}</span>
              </IconContainer>
              <IconContainer>
                <StyledFontAwesomeIconIsPublic
                  icon={isPublic ? faUnlock : faLock}
                  isPublic={isPublic}
                />
              </IconContainer>
              <IconContainer>
                {activeSection === "minhasComunidades" && (
                  <StyledFontAwesomeIcon icon={faMessage} joined={false} onClick={(event) => { event.stopPropagation(); navigate(`/profile/${session.nickname}/messages`) }} />
                )}
                {activeSection === "explorar" && (
                  <StyledFontAwesomeIcon
                    icon={joined ? faUserCheck : faUserPlus}
                    onClick={joinCommunity}
                    joined={joined}
                  />
                )}
              </IconContainer>
            </div>
          </div>
        }
        onClick={() => {
          dispatch(setCommunity({ name: name }))
          navigate("/backoffice/social/community")
        }}
        style={{ backgroundColor: "var(--federal-blue)", color: "white" }}
      />
      <CardContent>
        {isLoading ? (
          <Typography variant="body1">A carregar...</Typography>
        ) : (
          <>
            {leader && (
              <>
                <CommunityMember member={leader} role="Leader" />
                <CommunityDivider
                  show={members.length > 0 || moderators.length > 0}
                />
              </>
            )}
            {filteredModerators.length > 0 ? (
              <>
                {filteredModerators.slice(0, 2).map((moderator, index) => (
                  <div key={moderator.nickname}>
                    <CommunityMember member={moderator} role="Moderator" />
                    <CommunityDivider
                      show={index < filteredModerators.length - 1}
                    />
                  </div>
                ))}
                {filteredModerators.length === 1 &&
                  filteredMembers.length > 0 && (
                    <div key={filteredMembers[0].nickname}>
                      <CommunityMember member={filteredMembers[0]} />
                    </div>
                  )}
                <CommunityDivider
                  show={
                    filteredMembers.length > 1 ||
                    filteredModerators.length === 1
                  }
                />
              </>
            ) : (
              <>
                {filteredMembers.slice(0, 2).map((member) => (
                  <div key={member.nickname}>
                    <CommunityMember member={member} />
                    <CommunityDivider show={filteredMembers.length > 0} />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
