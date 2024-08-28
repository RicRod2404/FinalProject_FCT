import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

const List = styled.ul`
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

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: var(--federal-blue);

  text-decoration: none;
  color: var(--federal-blue);

  &:hover {
    color: var(--veronica);
  }

  ,
  &.active {
    color: var(--highlight-color);
    font-weight: bold;
    border-bottom: 2px solid var(--highlight-color);
    transition: all 0.3s ease;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: flex;
  color: var(--federal-blue);
  align-items: center;
  padding-bottom: 0.2rem;
  &:hover {
    color: var(--veronica);
  }

  ,
  &.active {
    color: var(--highlight-color);
    font-weight: bold;
    border-bottom: 2px solid var(--highlight-color);
    transition: all 0.3s ease;
  }
`;

export default function NavBarLinksList() {
  const session = useSelector(sessionSelector);
  return (
    <List>
      <ListItem>
        <StyledLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Sobre
        </StyledLink>
      </ListItem>
      <ListItem>
        <StyledLink
          to="/shop"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Loja
        </StyledLink>
      </ListItem>
      <ListItem>
        <StyledLink
          to="/rankings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <StyledFontAwesomeIcon icon={faRankingStar} />
        </StyledLink>
      </ListItem>
      {session.isLogged && (
        <ListItem>
          <StyledLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          ></StyledLink>
        </ListItem>
      )}
    </List>
  );
}
