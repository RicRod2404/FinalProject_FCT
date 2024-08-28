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
import { MutableRefObject, useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { httpPut } from "../../../../utils/http";
import { Community } from "../../../../types/CommunityType";
import { FormControlLabel, Switch } from "@mui/material";
import { useDispatch } from "react-redux";
import { set } from "../../../../store/snackbar.ts";
//import { useNavigate } from "react-router-dom";

const ComunityImage = styled("div")({
  display: "block",
  width: "16rem",
  height: "14rem",
  alignContent: "center",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f0f0f0",
  cursor: "pointer",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const IconWrapper = styled("span")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

interface CreateCommunityDialogProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  community: Community;
}

interface CommunityForm {
  name: string;
  description: string;
  isPublic: boolean;
  minLevelToJoin: number;
  communityPic: string;
  oldName: string;
}

export default function EditCommunityDialog({
  showModal,
  setShowModal,
  community,
}: CreateCommunityDialogProps) {
  const [communityImage, setCommunityImage] = useState<File | null>(null);
  const ref: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const [communityEdit, setCommunity] = useState<CommunityForm>({
    name: "",
    description: "",
    isPublic: false,
    minLevelToJoin: 1,
    communityPic: "",
    oldName: "",
  });

  useEffect(() => {
    setCommunity({
      name: community.name,
      description: community.description,
      isPublic: community.isPublic,
      minLevelToJoin: community.minLevelToJoin,
      communityPic: community.communityPic,
      oldName: community.name,
    });
  }, [community]);

  function editCommunity() {
    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify(communityEdit)], { type: "application/json" })
    );

    console.log(communityImage)
    if (communityImage)
      formData.append(
        "communityPic",
        new Blob([communityImage as BlobPart], {
          type: "application/octet-stream",
        })
      );

    httpPut(`/communities/${communityEdit?.oldName}`, formData).then(() => {
      dispatch(
        set({
          open: true,
          message: "Comunidade editada com sucesso",
          type: "success",
          autoHideDuration: 3000,
        })
      );
      setShowModal(false);
      window.location.href = "/backoffice/social/community";
    });
  }

  function handleChangePhoto() {
    ref.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCommunity((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSwitchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setCommunity((prev) => ({
      ...prev,
      [name]: checked,
    }));
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
      <DialogTitle sx={{ color: "var(--teal)" }}>Editar Comunidade</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={3}
          style={{ display: "flex", alignItems: "center" }}
        >
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
              {!communityImage ||
                (!communityEdit && (
                  <IconWrapper>
                    <FontAwesomeIcon icon={faImage} color="grey" size="4x" />
                  </IconWrapper>
                ))}
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
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={communityEdit?.isPublic}
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
              name="name"
              value={communityEdit?.name}
              label="Nome da Comunidade"
              variant="outlined"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="minLevelToJoin"
              name={"minLevelToJoin"}
              value={communityEdit?.minLevelToJoin}
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
              value={communityEdit?.description}
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
          onClick={editCommunity}
          style={{ backgroundColor: "var(--teal)", border: "none" }}
        >
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
