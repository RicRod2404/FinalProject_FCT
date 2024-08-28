import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faTags,
  faList,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormLabel } from "react-bootstrap";

interface StyledLinkProps {
  active?: boolean;
}

const StyledFormLabel = styled(FormLabel)({
  marginTop: "2rem",
  color: "var(--teal)",
  fontSize: "0.9rem",
});

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

export default function AdminSideMenu() {
  return (
    <SideMenuContainer className="side-menu">
      <StyledUl>
        <StyledFormLabel component="legend"> Utilizadores </StyledFormLabel>
        <StyledLi>
          <StyledLink to="/admin/list" active={location.pathname === "/admin/list"}>
            <IconWrapper>
              <FontAwesomeIcon icon={faUsers} />
            </IconWrapper>
            Utilizadores
          </StyledLink>
        </StyledLi>
        <StyledFormLabel component="legend"> Loja </StyledFormLabel>
        <StyledLi>
          <StyledLink
            to="/admin/categories"
            active={location.pathname === "/admin/categories"}
          >
            <IconWrapper>
              <FontAwesomeIcon icon={faList} />
            </IconWrapper>
            Categorias
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink
            to="/admin/products"
            active={location.pathname === "/admin/products"}
          >
            <IconWrapper>
              <FontAwesomeIcon icon={faTags} />
            </IconWrapper>
            Produtos
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink
            to="/admin/product"
            active={location.pathname === "/admin/product"}
          >
            <IconWrapper>
              <FontAwesomeIcon icon={faTag} />
            </IconWrapper>
            Inserir Produto
          </StyledLink>
        </StyledLi>
      </StyledUl>
    </SideMenuContainer>
  );
}
