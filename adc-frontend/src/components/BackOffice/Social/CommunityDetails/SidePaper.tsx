import { useDispatch, useSelector } from "react-redux";
import { set } from "../../../../store/snackbar";
import styled from "styled-components";
import { httpGet } from "../../../../utils/http";
import { sessionSelector } from "../../../../store/session";
import { Paper, FormLabel, Divider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import CommunityMember from "./CommunityMember";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { communitySelector } from "../../../../store/community.ts";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Table, TableBody, Pagination } from "@mui/material";

const StyledFormLabel = styled(FormLabel)({
  marginTop: "1.5rem",
  fontSize: "0.9rem",
  marginLeft: "1rem",
  marginBottom: "1rem",
});

const StyledIconButton = styled(FontAwesomeIcon) <{ isActive: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  color: ${(props) => (props.isActive ? "var(--teal)" : "var(--federal-blue)")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px;
  cursor: pointer;

  &:hover {
    color: var(--teal);
  }

  &:active {
    color: var(--teal);
  }
`;

const theme = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'var(--teal)',
            color: '#fff',
          },
        },
      },
    },
  },
});

interface CommunityDividerProps {
  show: boolean;
}

interface MembersData {
  nickname: string;
  profilePic: string;
}

const CommunityDivider = ({ show }: CommunityDividerProps) =>
  show ? <Divider sx={{ borderWidth: "2px" }} /> : null;

export default function SidePaper({ communityName, fetchCommunityMembers, leader, members, moderators, isPublic }: any) {
  const communityParam = useSelector(communitySelector);
  const [activeSection, setActiveSection] = useState("members");
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const [requests, setRequests] = useState<MembersData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  let counter = 0;
  const usersPerPage = 6;

  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  function removeRequest(nickname: string) {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.nickname !== nickname)
    );
  }

  const filteredMembers = members.filter((member: MembersData) =>
    leader ? member.nickname !== leader.nickname : true
  );

  const filteredModerators = moderators.filter((moderator: MembersData) =>
    leader ? moderator.nickname !== leader.nickname : true
  );

  function getRequests() {
    if (session.isLogged) {
      httpGet("/communities/requests/" + communityParam.name).then(
        (res: any) => {
          setRequests(res.data);
        },
        (error) => {
          if (error.status === 403) {
            dispatch(
              set({
                open: true,
                message:
                  "Não tem permissão para ver os pedidos a esta comunidade.",
                type: "error",
                autoHideDuration: 3000,
              })
            );
          }
        }
      );
    }
  }

  const isModerator = (nickname: string) => {
    return moderators.some((moderator: MembersData) => moderator.nickname === nickname);
  };

  const visibleItems = filteredModerators.length + filteredMembers.length;

  const maxHeightMembers = visibleItems > 5
    ? `calc((5 - ${Math.min(filteredModerators.length, 3)}) * 4.2rem)`
    : `${Math.min(filteredMembers.length, 6)} * 4.2rem`;

  const maxHeightModerators = visibleItems > 5
    ? `calc((5 - ${Math.min(filteredMembers.length, 3)}) * 4.2rem)`
    : `${Math.min(filteredModerators.length, 6)} * 4.2rem`;

  // Calculate total pages
  const totalPages = Math.ceil(requests.length / usersPerPage);

  // Get current users for the page
  let currentReq = requests.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <Paper
      style={{
        width: "20rem",
        height: "auto",
        marginTop: "7rem",
        display: "flex",
        marginRight: "-13rem",
        flexDirection: "column",
      }}
      elevation={9}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <StyledIconButton
          icon={faPeopleGroup}
          isActive={activeSection === "members"}
          onClick={() => {
            setActiveSection("members");
            fetchCommunityMembers();
          }}
        />
        {(session.nickname === leader?.nickname ||
          isModerator(session.nickname)) && !isPublic && (
            <StyledIconButton
              icon={faUserPlus}
              isActive={activeSection === "requests"}
              onClick={() => {
                setActiveSection("requests");
                getRequests();
              }}
            />
          )}
      </div>
      {(session.nickname === leader?.nickname ||
        isModerator(session.nickname)) &&
        activeSection === "requests" &&
        (requests.length > 0 ? (
          <>
            {currentReq.map((request: any) => (
              <div key={request.nickname}>
                <CommunityMember
                  member={request}
                  activeSection="requests"
                  communityName={communityName}
                  fetchCommunityMembers={fetchCommunityMembers}
                  removeRequest={removeRequest}
                  isModerator={isModerator}
                  leaderNickname={leader?.nickname}
                />
                <CommunityDivider show={true} />
              </div>
            ))}
            {requests.length > 0 && (
              <ThemeProvider theme={theme}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => { setCurrentPage(value); console.log(event) }}
                  shape='rounded'
                  style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
                />
              </ThemeProvider>
            )}
          </>
        ) : (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            Não tem pedidos para aceitar
          </div>
        ))}
      {activeSection === "members" && (
        <>
          {leader && (
            <>
              <StyledFormLabel style={{ color: "var(--teal)" }}>
                Líder
              </StyledFormLabel>
              <CommunityMember
                member={leader}
                activeSection={"members"}
                role="leader"
                communityName={communityName}
                fetchCommunityMembers={fetchCommunityMembers}
                removeRequest={removeRequest}
                isModerator={isModerator}
                leaderNickname={leader?.nickname}
              />
              <CommunityDivider
                show={members.length > 0 || moderators.length > 0}
              />
            </>
          )}

          {filteredModerators.length > 0 && (
            <>
              <StyledFormLabel style={{ color: "var(--teal)" }}>
                Moderadores
              </StyledFormLabel>
              <div style={{ maxHeight: maxHeightModerators, overflowY: 'auto', flexGrow: 1 }}>
                <Table style={{ marginTop: "-1rem" }}>
                  <TableBody>
                    {filteredModerators.map((moderator: MembersData) => {
                      counter += 1;
                      return (
                        <div key={moderator.nickname}>
                          <CommunityMember
                            member={moderator}
                            activeSection={"members"}
                            role="moderator"
                            communityName={communityName}
                            fetchCommunityMembers={fetchCommunityMembers}
                            removeRequest={removeRequest}
                            isModerator={isModerator}
                            leaderNickname={leader?.nickname}
                          />
                          <CommunityDivider show={filteredModerators.length > 0} />
                        </div>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {filteredMembers.length > 0 && (
            <>
              <StyledFormLabel style={{ color: "var(--teal)" }}>
                Membros
              </StyledFormLabel>
              <div style={{ maxHeight: maxHeightMembers, overflowY: 'auto', flexGrow: 1 }}>
                <Table style={{ marginTop: "-1rem" }}>
                  <TableBody>
                    {filteredMembers.map((member: MembersData) => {
                      counter += 1;
                      return (
                        <div key={member.nickname}>
                          <CommunityMember
                            member={member}
                            activeSection={"members"}
                            role="member"
                            communityName={communityName}
                            fetchCommunityMembers={fetchCommunityMembers}
                            removeRequest={removeRequest}
                            isModerator={isModerator}
                            leaderNickname={leader?.nickname}
                          />
                          <CommunityDivider show={filteredMembers.length > 0} />
                        </div>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </>
      )}
    </Paper >
  );
}
