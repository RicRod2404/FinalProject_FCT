import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserFriends, faUsers } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const StyledLink = styled(Link) <StyledLinkProps>`
  color: var(--federal-blue);
  text-decoration: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;

  ${({ active }) => active && `
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

export default function SideMenu() {
    return (
        <SideMenuContainer className="side-menu">
            <StyledUl>
                <StyledLi>
                    <StyledLink to="/backoffice" active={location.pathname === "/backoffice" ? true : undefined}>
                        <IconWrapper>
                            <FontAwesomeIcon icon={faHome} />
                        </IconWrapper>
                        Home
                    </StyledLink>
                </StyledLi>
                {/* <StyledLi>
                    <StyledLink to="/backoffice/viagens">
                        <IconWrapper>
                            <FontAwesomeIcon icon={faPlane} />
                        </IconWrapper>
                        Viagens
                    </StyledLink>
                </StyledLi> */}
                <StyledLi>
                    <StyledLink to="/backoffice/social/amigos" active={location.pathname === "/backoffice/social/amigos" ? true : undefined}>
                        <IconWrapper>
                            <FontAwesomeIcon icon={faUserFriends} />
                        </IconWrapper>
                        Amigos
                    </StyledLink>
                </StyledLi>
                <StyledLi>
                    <StyledLink to="/backoffice/social/home" active={location.pathname === "/backoffice/social/home" ? true : undefined}>
                        <IconWrapper>
                            <FontAwesomeIcon icon={faUsers} />
                        </IconWrapper>
                        Comunidades
                    </StyledLink>
                </StyledLi>
            </StyledUl>
        </SideMenuContainer >
    );
}
