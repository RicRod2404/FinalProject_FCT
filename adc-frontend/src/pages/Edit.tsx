import { Avatar } from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { httpGet, httpPut } from "../utils/http";
import { User } from "../types/UserType";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../store/session";
import { set } from "../store/snackbar";
import styled from "styled-components";
import { Card, CardContent, CardMedia } from "@mui/material";
import { Fragment } from "react";
import { Row, Col, Stack, Container, Button } from "react-bootstrap";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const ProfileAvatar = styled(Avatar)({
  display: "flex",
  position: "relative",
  border: "2px solid #fff",
  marginTop: "-10rem",
  cursor: "pointer",
  backgroundColor: "white",
});

const H1 = styled.h1`
  text-align: center;
  color: var(--teal);
  font-weight: bolder;
  font-size: 2rem;
  margin-top: 1rem;
`;

export default function Edit() {
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

  const params = useParams();
  const [image, setImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const dispatch = useDispatch();
  const session = useSelector(sessionSelector);
  const ref: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const bannerPicRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  useEffect(() => {
    if (session.isLogged) {
      if (session.role === "USER" && session.nickname !== params.id) {
        dispatch(
          set({
            open: true,
            message: "Request Denied",
            type: "error",
            autoHideDuration: 3000,
          })
        );
      } else {
        httpGet("/users/" + params.id).then(
          (res: any) => {
            setUser({
              ...res.data,
              nickname: res.data.nickname,
              profilePicDeleted: false,
            });
          },
          (error) => {
            dispatch(
              set({
                open: true,
                message:
                  error.status === 404
                    ? "User not found"
                    : "Error loading user",
                type: "error",
                autoHideDuration: 3000,
              })
            );
          }
        );
      }
    }
  }, [session.isLogged]);

  function handleChangePhoto() {
    ref.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "nickname") {
      setUser((prev) => ({
        ...prev,
        nickname: value,
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setUser((prev) => ({ ...prev, profilePicDeleted: false }));
    }
  }

  function handleChangeBannerPic() {
    bannerPicRef.current?.click();
  }

  function handleBannerPicChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const bannerPic = e.target.files[0];
      setBannerImage(bannerPic);
    }
  }
  function saveBannerPic() {
    const formData = new FormData();
    formData.append(
      "bannerPic",
      new Blob([bannerImage as BlobPart], {
        type: "application/octet-stream",
      })
    );
    httpPut(`/users/banner/${params.id}`, formData).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "Imagem de capa atualizada com sucesso",
            type: "success",
            autoHideDuration: 3000,
          })
        );
      },
      () => {
        dispatch(
          set({
            open: true,
            message: "Error updating banner",
            type: "error",
            autoHideDuration: 3000,
          })
        );
      }
    );
  }

  function deleteBannerPic() {
    httpPut(`/users/banner/${params.id}`, {}).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "Imagem de capa eliminada com sucesso",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        window.location.href = `/edit/${params.id}`;
      },
      () => {
        dispatch(
          set({
            open: true,
            message: "Error updating banner",
            type: "error",
            autoHideDuration: 3000,
          })
        );
      }
    );
  }

  function deleteImage() {
    setImage(null);
    user.profilePic = "";
    setUser((prev) => ({ ...prev, profilePicDeleted: true }));
  }

  // Submit edit form
  function editUser() {
    const formData = new FormData();
    // Build form
    formData.append(
      "form",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    if (image)
      formData.append(
        "profilePic",
        new Blob([image as BlobPart], { type: "application/octet-stream" })
      );

    console.log(formData.getAll("form"));

    httpPut("users/" + params.id, formData).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "User edited successfully",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        httpGet("users/" + user.nickname).then(() => {
          window.location.href = "/profile/" + user.nickname;
        });
      },
      (error) => {
        if (error.status === 400) {
          dispatch(
            set({
              open: true,
              message: "Numero de telemóvel errado",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        } else if (error.status === 404) {
          dispatch(
            set({
              open: true,
              message: "O utilizador não existe",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        } else if (error.status === 403) {
          dispatch(
            set({
              open: true,
              message: "Não tem permissões para editar o utilizador",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        } else if (error.status === 401) {
          dispatch(
            set({
              open: true,
              message: "Erro ao editar fotografia de perfil",
              type: "error",
              autoHideDuration: 3000,
            })
          );
        }
      }
    );
  }

  return (
    <>
      <div
        style={{
          marginLeft: "20rem",
          marginTop: "6rem",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{ width: "60rem", boxShadow: "0 20px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <CardMedia
            component="div"
            sx={{
              height: "18rem",
              backgroundColor: "var(--federal-blue)",
              cursor: "pointer",
              backgroundImage: bannerImage
                ? `url(${URL.createObjectURL(bannerImage)})`
                : `url(${user.bannerPic})`,
              position: "relative",
            }}
            style={{
              backgroundColor: user.bannerPic ? "white" : "var(--federal-blue)",
            }}
            onClick={handleChangeBannerPic}
          >
            <div
              style={{
                position: "absolute",
                right: "1rem",
                bottom: "0.5rem",
                display: "flex",
                flexDirection: "row-reverse",
                cursor: "pointer",
              }}
            >
              {bannerImage && (
                <>
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="2x"
                    color="red"
                    style={{ marginLeft: "1rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBannerPic();
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="2x"
                    color="var(--teal)"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveBannerPic();
                    }}
                  />
                </>
              )}
            </div>
          </CardMedia>
          <input
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            ref={bannerPicRef}
            onChange={handleBannerPicChange}
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
              onClick={handleChangePhoto}
            />
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              ref={ref}
              onChange={uploadImage}
            />
            <H1>{user.nickname}</H1>
          </CardContent>
        </Card>
        <Fragment>
          <Container style={{ height: "25vh", marginTop: "4rem" }}>
            <Row>
              <Col className="col-6 mx-auto">
                <Stack direction="vertical" gap={3}>
                  <TextField
                    name="email"
                    value={user.email}
                    disabled={true}
                    label="Email"
                    variant="outlined"
                  />
                  <TextField
                    name="name"
                    value={user.name}
                    label="Nome"
                    variant="outlined"
                    onChange={handleChange}
                  />

                  <TextField
                    name="phoneNum"
                    value={user.phoneNum}
                    label="Contacto"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Stack>
              </Col>

              <Col className="col-6 mx-auto">
                <Stack direction="vertical" gap={3}>
                  <TextField
                    name="address"
                    value={user.address}
                    label="Morada"
                    variant="outlined"
                    onChange={handleChange}
                  />

                  <TextField
                    name="postalCode"
                    value={user.postalCode}
                    label="Código Postal"
                    variant="outlined"
                    onChange={handleChange}
                  />

                  <TextField
                    name="nif"
                    value={user.nif}
                    label="NIF"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Stack>
              </Col>
            </Row>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Button
                style={{
                  marginRight: "1rem",
                  marginBottom: "2rem",
                  backgroundColor: "var(--teal)",
                  borderColor: "var(--teal)",
                }}
                onClick={editUser}
              >
                Guardar Informações
              </Button>
              <Button
                style={{
                  marginBottom: "2rem",
                  backgroundColor: "var(--federal-blue)",
                  borderColor: "var(--federal-blue)",
                }}
                onClick={deleteImage}
              >
                Remover Fotografia
              </Button>
              <Button
                style={{
                  marginLeft: "1rem",
                  marginBottom: "2rem",
                  backgroundColor: "white",
                  borderColor: "white",
                  color: "red",
                }}
                onClick={() =>
                  (window.location.href = "/profile/" + session.nickname)
                }
              >
                Cancelar
              </Button>
            </div>
          </Container>
        </Fragment>
      </div>
    </>
  );
}
