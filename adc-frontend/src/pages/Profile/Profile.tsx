import { User } from "../../types/UserType";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../store/snackbar";
import styled from "styled-components";
import { httpGet } from "../../utils/http";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sessionSelector } from "../../store/session";
import {
  Avatar,
  CardMedia,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import PaperWithTreapProfile from "../../components/Profile/PaperWithTreapProfile";

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
  gap: 0.5rem;
`;

const GreenSpan = styled.span`
  color: var(--green);
`;
const VeronicaSpan = styled.span`
  color: var(--federal-blue);
`;

export default function Profile() {
  const [user, setUser] = useState<User>({
    nickname: "",
    name: "",
    email: "",
    phoneNum: "",
    address: "",
    postalCode: "",
    nif: "",
    profilePic: "",
    role: "",
    status: "",
    leafPoints: 0,
    isPublic: true,
    level: 0,
    bannerPic: "",
    levelExp: 0,
    levelExpToNextLevel: 0,
  });

  const navigate = useNavigate();
  const params = useParams();
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const [image] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    if (session.isLogged) {
      httpGet("users/" + params.id).then(
        (res: any) => {
          setUser({ ...res.data, profilePicDeleted: false });
          const userData: User = res.data;
          if (userData.bannerPic) {
            setBannerImage(userData.bannerPic);
          }
        },
        (error) => {
          dispatch(
            set({
              open: true,
              message:
                error.status === 404
                  ? "Utilizador não encontrado"
                  : "Erro ao carregar utilizador",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
      );
    }
  }, [session.isLogged, params.id]);

  return (
    <div>
      <div
        style={{
          marginTop: "6rem",
          marginLeft: "22rem",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{ width: "60rem", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <CardMedia
            component="img"
            sx={{
              height: "18rem",
              backgroundColor: "var(--federal-blue)",
              backgroundImage: bannerImage ? `url(${bannerImage})` : "none",
            }}
            style={{
              backgroundColor: bannerImage ? "white" : "var(--federal-blue)",
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ProfileAvatar
              src={image ? URL.createObjectURL(image) : user.profilePic}
              sx={{
                width: 200,
                height: 200,
                boxShadow: "0 20px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
            <H1>
              {user.nickname}
              <div style={{ position: "relative", marginLeft: "0.5rem" }}>
                <FontAwesomeIcon
                  icon={faCertificate}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    color: "var(--federal-blue)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {user.level}
                </div>
              </div>
            </H1>
            <p style={{ marginTop: "1rem", marginBottom: "2rem" }}>
              {" "}
              <VeronicaSpan>
                {" "}
                {user.levelExp} / {user.levelExpToNextLevel}
              </VeronicaSpan>{" "}
              <GreenSpan>exp</GreenSpan> |{" "}
              <VeronicaSpan> {user.leafPoints}</VeronicaSpan>{" "}
              <GreenSpan>pontos</GreenSpan>
            </p>
            <Breadcrumbs aria-label="breadcrumb">
              {session.nickname === user.nickname && (
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate("/edit/" + user.nickname)}
                  sx={{ cursor: "pointer" }}
                >
                  Editar Perfil
                </Link>
              )}
            </Breadcrumbs>
          </CardContent>
        </Card>
      </div>
      <div style={{ display: "block", marginLeft: "22rem" }}>
        <PaperWithTreapProfile nickname={user.nickname} />
      </div>
    </div>
  );
}
