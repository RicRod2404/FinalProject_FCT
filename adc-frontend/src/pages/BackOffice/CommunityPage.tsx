import CommunityInfo from "../../components/BackOffice/Social/CommunityDetails/CommunityInfo";
import SidePaper from "../../components/BackOffice/Social/CommunityDetails/SidePaper";
import { useDispatch, useSelector } from "react-redux";
import { httpGet } from "../../utils/http";
import { useState } from "react";
import { useEffect } from "react";
import { sessionSelector } from "../../store/session";
import { set } from "../../store/snackbar";
import { Community } from "../../types/CommunityType";
import { communitySelector } from "../../store/community.ts";
import { useNavigate } from "react-router-dom";

interface CommunityApiResponse {
  leaderNickname?: string;
  leaderProfilePic?: string;
  members?: MembersData[];
  moderators?: MembersData[];
}

interface MembersData {
  nickname: string;
  profilePic: string;
}

export default function CommunityPage() {
  const communityParam = useSelector(communitySelector);
  const [community, setCommunity] = useState<Community>();
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<Boolean>();
  const navigate = useNavigate();
  const [leader, setLeader] = useState<MembersData | null>(null);
  const [members, setMembers] = useState<MembersData[]>([]);
  const [moderators, setModerators] = useState<MembersData[]>([]);
  const [isMember, setIsMember] = useState(true);

  function fetchCommunityMembers() {
    setIsLoading(true);
    if (session.isLogged) {
      httpGet(`/communities/members/${community?.name}`)
        .then((response: any) => {
          const data: CommunityApiResponse = response.data;
          if (data) {
            const fetchedLeader = {
              nickname: data.leaderNickname || "",
              profilePic: data.leaderProfilePic || "",
            };

            setLeader(fetchedLeader);
            setMembers(data.members || []);
            setModerators(data.moderators || []);

            const isUserMember =
              session.nickname === fetchedLeader.nickname ||
              members.some(
                (member) => member.nickname === session.nickname
              ) ||
              moderators.some(
                (moderator) => moderator.nickname === session.nickname
              );

            setIsMember(isUserMember);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar membros da comunidade:", error);
          setMembers([]);
          setModerators([]);
          setLeader({ nickname: "", profilePic: "" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  useEffect(() => {
    if (!communityParam.name) navigate("/backoffice/social/home");
  }, [communityParam.name]);

  useEffect(() => {
    if (session.isLogged && communityParam.name) {
      httpGet("/communities/" + communityParam.name).then(
        (res: any) => {
          setCommunity({ ...res.data });
          setIsLoading(false);
        },
        (error) => {
          dispatch(
            set({
              open: true,
              message:
                error.status === 404
                  ? "Comunidade não encontrada"
                  : "Erro ao carregar comunidade",
              type: "error",
              autoHideDuration: 3000,
            })
          );
          setIsLoading(false);
        }
      );
    }
  }, [session.isLogged, communityParam.name, dispatch]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        {community && (
          <>
            <CommunityInfo
              community={community}
              isLoading={isLoading}
              isMember={isMember}
            />

            {(isMember || community.isPublic) && (<SidePaper
              communityName={community?.name}
              leaderNickname={community?.leaderNickname}
              fetchCommunityMembers={fetchCommunityMembers}
              leader={leader}
              members={members}
              moderators={moderators}
              isPublic={community?.isPublic}
            />)}
          </>
        )}
      </div>
    </>
  );
}
