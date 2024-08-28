import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CreateCommunityDialog from "../../components/BackOffice/Social/CreateCommunityDialog";
import CreateCommunityPaper from "../../components/BackOffice/Social/CreateCommunityPaper";
import { Paper, Typography } from "@mui/material";
import CommunityCard from "../../components/BackOffice/Social/CommunityCard";
import CommunityBreadCrumb from "../../components/BackOffice/Social/CommunityBreadcrumb";
import { httpGet } from "../../utils/http";
import { Community } from "../../types/CommunityType";
import { CardGroup } from "react-bootstrap";
import { sessionSelector } from "../../store/session";

function CommunityCardGroup({ communities, activeSection, error }: any) {
  return (
    <div
      style={{
        display: "flex",
        marginTop: "1rem",
        marginLeft: "13rem",
        width: "100%",
      }}
    >
      <Paper
        elevation={9}
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "auto",
          padding: "2rem",
        }}
      >
        {error ? (
          <Typography style={{ color: "var(--veronica)" }}>{error}</Typography>
        ) : (
          <CardGroup style={{ gap: "2rem", justifyContent: "center" }}>
            {communities.map((community: any) => (
              <CommunityCard
                key={community.name}
                activeSection={activeSection}
                community={community}
              />
            ))}
          </CardGroup>
        )}
      </Paper>
    </div>
  );
}

export default function Social() {
  const session = useSelector(sessionSelector);
  const [activeSection, setActiveSection] = useState("minhasComunidades");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [errorMyCommunities, setErrorMyCommunities] = useState<string>();
  const [errorCommunities, setErrorCommunities] = useState<string>();
  const [communitiesString, setCommunitiesString] = useState<string>();

  useEffect(() => {
    httpGet("/communities/user/" + session.nickname)
      .then((response: any) => {
        setMyCommunities(response.data);
        if (response.data.length === 0) {
          setErrorMyCommunities("Ainda não faz parte de nenhuma comunidade.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar comunidades:", error);
      });

    httpGet("/communities")
      .then((response: any) => {
        setCommunities(response.data);
        if (response.data.length === 0) {
          setErrorCommunities("Ainda não existem comunidades para mostrar.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar comunidades:", error);
      });
  }, [session.nickname]);

  httpGet("/communities/search/" + searchQuery).then((response: any) => {
    setCommunitiesString(response.data);
    if (response.data.length === 0) {
      setErrorCommunities("Não existem comunidades com esse nome.");
    }
  });

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyCommunities = myCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <CreateCommunityPaper showModal={showModal} setShowModal={setShowModal} />
      <CommunityBreadCrumb
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CommunityCardGroup
        communities={
          activeSection === "minhasComunidades"
            ? filteredMyCommunities
            : filteredCommunities
        }
        activeSection={activeSection}
        error={
          activeSection === "minhasComunidades"
            ? errorMyCommunities
            : errorCommunities
        }
      />

      <CreateCommunityDialog
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}
