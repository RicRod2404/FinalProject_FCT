import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { useState } from "react";
import ProfileImage from "./ProfileImage";
import styled from "styled-components";
import ProfileMenu from "../Menus/ProfileMenu";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const List = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
`;

const ListBtns = styled.ul`
  list-style-type: none;
  gap: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: 0;
  margin-top: 1rem;
`;

const ListItem = styled.li`
  color: var(--federal-blue);
  font-size: 1.2rem;
`;

const IconWrapper = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 20px;
  background-color: #f2f2f2;
`;
const StyledLink = styled(Link) ({
  textDecoration: "none",
  color: "var(--federal-blue)",
  "&:hover": {
    color: "var(--veronica)",
  },
});

export default function NavBarButtonsList({ icon }: any) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const session = useSelector(sessionSelector);
  const navigate = useNavigate();

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  return (
    <List>
      {session.isLogged ? (
        <ListBtns>
          {session.role !== "USER" && (<ListItem>{session.role}</ListItem>)}
          <ListItem>
            {!(session.role == "USER" || session.role == "GC") && <StyledLink to ="/admin">Administrar</StyledLink>}
          </ListItem>
          <ListItem>
            {session.profilePic ? (
              <ProfileImage
                icon={session.profilePic}
                onProfileClick={toggleSideMenu}
              />
            ) : (
              <IconWrapper>
                {icon ? (
                  icon
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    onClick={toggleSideMenu}
                    size="lg"
                    style={{ color: "var(--federal-blue", cursor: "pointer" }}
                  />
                )}
              </IconWrapper>
            )}
            {isSideMenuVisible && <ProfileMenu />}
          </ListItem>
        </ListBtns>
      ) : (
        <>
          <Button
            onClick={() => navigate("/login")}
            sx={{
              color: "var(--federal-blue)",
              display: "block",
              textTransform: "none",
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/register")}
            sx={{
              background: "var(--federal-blue)",
              color: "var(--baby-powder)",
              display: "block",
              ":hover": { background: "var(--veronica)" },
              borderRadius: "1rem",
              height: "3rem",
              textTransform: "none",
            }}
            variant="contained"
          >
            Regista-te aqui!
          </Button>
        </>
      )}
    </List>
  );
}
