import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";
import { FormLabel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { httpDelete, httpPut, httpGet } from "../../utils/http";
import { useState, useEffect } from "react";
import { User } from "../../types/UserType";
import PopUpModal from "../PopUpModal";
import { set } from "../../store/snackbar";

interface StyledLinkProps {
  active?: boolean;
}

const SideMenuContainer = styled.div`
  position: fixed;
  margin-top: 6rem;
  background-color: white;
  padding: 1rem 2rem 0rem 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 6rem);
  overflow-y: auto;
`;

const StyledLink = styled(Link)<StyledLinkProps>`
  color: var(--federal-blue);
  text-decoration: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;

  ${({ active }) =>
    active &&
    `
    background-color: var(--teal);
    color: white;
    border-radius: 10px;
  `}

  &:hover {
    background-color: var(--teal);
    color: white;
    border-radius: 10px;
  }
`;

const StyledDeleteLink = styled(Link)`
  color: var(--federal-blue);
  text-decoration: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: red;
`;

const Spacer = styled.div`
  margin-bottom: calc(100vh - 24rem);
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;

const StyledUl = styled.ul`
  margin-top: 2rem;
  list-style: none;
  padding: 0;
`;

const StyledLi = styled.li`
  margin: 0.5rem 0;
`;

const StyledFormLabel = styled(FormLabel)({
  color: "var(--teal)",
  fontSize: "0.9rem",
});

export default function SettingsMenu() {
  const session = useSelector(sessionSelector);
  const location = useLocation();
  const [privacySwitch, setPrivacySwitch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dispatch = useDispatch();

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

  useEffect(() => {
    console.log(user)
    console.log(loading)
    const fetchUserData = async () => {
      try {
        const response = await httpGet(`/users/${session.nickname}`);
        const userData = response.data as User;
        setUser(userData);
        setPrivacySwitch(!userData.isPublic);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setLoading(false);
      }
    };

    if (session.nickname) {
      fetchUserData();
    }
  }, [session.nickname]);

  const handlePrivacySwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newIsPublic = !event.target.checked;
    setPrivacySwitch(event.target.checked);
    httpPut(`/users/privacy`, { isPublic: newIsPublic }).then(
      (response) => {
        console.log("Estado de privacidade atualizado com sucesso:", response);
      },
      (error) => {
        console.error("Erro ao atualizar estado de privacidade:", error);
      }
    );
  };

  const handleDeleteAccount = () => {
    httpDelete(`/users/${session.nickname}`).then(
      (response) => {
        console.log("Conta eliminada com sucesso:", response);
        dispatch(
          set({
            open: true,
            message: "Conta eliminada com sucesso.",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        window.location.href = "/";
      },
      (error) => {
        console.error("Erro ao eliminar conta:", error);
        if(error.status === 403) {
          dispatch(set({
            open: true,
            message: "Não pode eliminar esta conta.",
            type: "error",
            autoHideDuration: 4000,
          }));
        }
      }
    );
  };

  const openDeleteAccountModal = () => {
    setModalMessage(
      "Tem a certeza de que pretende eliminar permanentemente a sua conta?"
    );
    setModalIsOpen(true);
  };

  return (
    <SideMenuContainer className="side-menu">
      <StyledUl>
        <StyledFormLabel component="legend">Perfil</StyledFormLabel>
        <StyledLi>
          <fieldset style={{ marginLeft: "0.5rem" }}>
            <IconWrapper>
              <FontAwesomeIcon icon={faLock} />
            </IconWrapper>
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={privacySwitch}
                  onChange={handlePrivacySwitchChange}
                />
              }
              label="Privado"
              labelPlacement="start"
            />
          </fieldset>
        </StyledLi>
        <StyledLi>
          <StyledLink
            to={"/password/" + session.nickname}
            active={location.pathname === "/password/" + session.nickname}
          >
            <IconWrapper>
              <FontAwesomeIcon icon={faKey} />
            </IconWrapper>
            Alterar Palavra-Passe
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink
            to={"/settings/email/" + session.nickname}
            active={location.pathname === "/settings/email/" + session.nickname}
          >
            <IconWrapper>
              <FontAwesomeIcon icon={faEnvelope} />
            </IconWrapper>
            Alterar Email
          </StyledLink>
        </StyledLi>
        <Spacer />
        <StyledLi>
          <StyledDeleteLink to="#" onClick={openDeleteAccountModal}>
            Eliminar conta
          </StyledDeleteLink>
        </StyledLi>
      </StyledUl>
      <PopUpModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onConfirm={handleDeleteAccount}
        message={modalMessage}
      />
    </SideMenuContainer>
  );
}
