import { IconButton, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const StyledCloseIcon = styled(CloseIcon)({
  fontSize: "3rem",

});

const StyledButton = styled(IconButton)({
  fontSize: "3rem",
  marginTop: "2rem",
  marginRight: "4rem",
  marginBottom: "2rem",
  color: "var(--teal)",
});


export default function BackToWebsiteBtn() {
  const navigate = useNavigate();
  return (
    <StyledButton
      color="inherit"
      onClick={() => navigate("/")}
      style={{ alignSelf: "end" }}
    >
      <StyledCloseIcon
      />
    </StyledButton>
  );
}