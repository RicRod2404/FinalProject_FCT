import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faChartLine, faUser, faCog, faComment } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from '../../store/session';
import { httpDelete } from '../../utils/http';
import { logout } from '../../store/session';
import { set } from '../../store/snackbar';

const SideMenuContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 6rem);
  overflow-y: auto;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
`;

const StyledLink = styled(Link)`
  color: var(--federal-blue);
  text-decoration: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;

  &:hover {
    background-color: var(--teal);
    color: white;
    border-radius: 5px;
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
`;

const StyledLi = styled.li`
  margin: 0.5rem 0;
`;

const Spacer = styled.div`
  margin-bottom: calc(100vh - 25rem);;
`;

export default function ProfileMenu() {
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function exitSession() {
    httpDelete("/security").then(() => {
      dispatch(logout());
      dispatch(
        set({
          open: true,
          message: "Logout successful",
          type: "info",
          autoHideDuration: 3000,
        })
      );
      navigate("/");
    });
  }

  return (
    <SideMenuContainer className="side-menu">
      <StyledUl>
        <StyledLi>
          <StyledLink to="/backoffice">
            <IconWrapper>
              <FontAwesomeIcon icon={faChartLine} />
            </IconWrapper>
            A Minha Área
          </StyledLink>
        </StyledLi>
        <StyledLi>
        </StyledLi>
        <StyledLi>
          <StyledLink to={"/profile/" + session.nickname}>
            <IconWrapper>
              <FontAwesomeIcon icon={faUser} />
            </IconWrapper>
            Perfil
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to={"/profile/" + session.nickname + "/messages"}>
            <IconWrapper>
              <FontAwesomeIcon icon={faComment} />
            </IconWrapper>
            Mensagens
          </StyledLink>
        </StyledLi>
        <Spacer />
        <StyledLi>
          <StyledLink to="/settings">
            <IconWrapper>
              <FontAwesomeIcon icon={faCog} />
            </IconWrapper>
            Definições
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/" onClick={exitSession}>
            <IconWrapper>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </IconWrapper>
            Terminar sessão
          </StyledLink>
        </StyledLi>
      </StyledUl>
    </SideMenuContainer>
  );
}
