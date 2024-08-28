import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { MutableRefObject, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { httpPost } from "../../../utils/http";
import { Community } from "../../../types/CommunityType";
import { FormControlLabel, Switch } from "@mui/material";
import {useDispatch} from "react-redux";
import {set} from "../../../store/snackbar.ts";

const ComunityImage = styled("div")({
  display: "block",
  width: "10rem",
  height: "10rem",
  alignContent: "center",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f0f0f0",
  cursor: "pointer",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  marginLeft: "4rem",
});

const IconWrapper = styled("span")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

interface CreateCommunityDialogProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function CreateCommunityDialog({
  showModal,
  setShowModal,
}: CreateCommunityDialogProps) {
  const [community, setCommunity] = useState<Community>({
    leaderNickname: "",
    name: "",
    description: "",
    communityPic: "",
    minLevelToJoin: 1,
    isPublic: true,
    communityLevel: 1,
    communityExp: 0,
    maxMembers: 10,
    communityExpToNextLevel: 0,
    currentMembers: 0,
  });
  const [communityImage, setCommunityImage] = useState<File | null>(null);
  const ref: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const dispatch = useDispatch();

  function createCommunity() {
    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify(community)], {
        type: "application/json",
      })
    );

    if (communityImage) {
      formData.append(
        "communityPic",
        new Blob([communityImage as BlobPart], {
          type: "application/octet-stream",
        })
      );
    }

    httpPost("/communities", formData)
      .then(() => {
        setShowModal(false);
        window.location.href = "/backoffice/social/home";
      })
      .catch((error) => {
        if (error.status === 409) {
          dispatch(set({
                open: true,
                message: "Já existe uma comunidade com este nome",
                type: "error",
                autoHideDuration: 3000,
              }));
        }
        if (error.status === 400) {
          dispatch(set({
            open: true,
            message: "Nome ou nível incorretos.",
            type: "error",
            autoHideDuration: 3000,
          }));
        }
        if (error.status === 403) {
          dispatch(set({
            open: true,
            message: "Alcance o nível 5 para poder criar uma comunidade.",
            type: "error",
            autoHideDuration: 3000,
          }));
        }
      });
  }

  function handleChangePhoto() {
    ref.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCommunity((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSwitchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setCommunity((prev) => ({ ...prev, [e.target.name]:checked }));
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setCommunityImage(e.target.files[0]);
    }
  }

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ color: "var(--teal)" }}>Criar Comunidade</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{display: "flex", alignItems: "center"}}>
          <Grid item xs={6}>
            <ComunityImage
              onClick={handleChangePhoto}
              style={{
                backgroundImage: `url(${
                  communityImage
                    ? URL.createObjectURL(communityImage)
                    : community.communityPic
                })`,
              }}
            >
              {!communityImage && (
                <IconWrapper>
                  <FontAwesomeIcon icon={faImage} color="grey" size="4x" />
                </IconWrapper>
              )}
            </ComunityImage>
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              ref={ref}
              onChange={uploadImage}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              paddingRight: "3rem",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={community.isPublic}
                  onChange={handleSwitchChange}
                  name="isPublic"
                  color="primary"
                />
              }
              label="Pública"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name={"name"}
              label="Nome da Comunidade"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="minLevelToJoin"
              name={"minLevelToJoin"}
              defaultValue={1}
              label="Nível mínimo"
              type="number"
              fullWidth
              onChange={handleChange}
            />
            
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="description"
              name={"description"}
              label="Descrição da Comunidade"
              type="text"
              fullWidth
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowModal(false)}
          style={{ backgroundColor: "var(--federal-blue)", border: "none" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={createCommunity}
          style={{ backgroundColor: "var(--teal)", border: "none" }}
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
