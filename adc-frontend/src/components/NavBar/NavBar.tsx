import styled from "styled-components";
import Logo from "./Logo";
import NavBarLinksList from "./NavBarLinksList";
import NavBarButtonsList from "./NavBarButtonsList";
import {Link} from "react-router-dom";

const StyledNavBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LogoAndLinks = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
`;

export default function NavBar() {
    return (
        <StyledNavBar>
            <LogoAndLinks>
                <Link to="/">
                    <Logo/>
                </Link>
                <NavBarLinksList/>
            </LogoAndLinks>
            <NavBarButtonsList/>
        </StyledNavBar>
    );
}
