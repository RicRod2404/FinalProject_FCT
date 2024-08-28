import styled from "styled-components";
import BackToWebsiteBtn from "../../components/BackToWebsiteBtn";
import RegisterForm from "../../features/authentication/RegisterForm";
import Logo from "../../components/NavBar/Logo";

const Elements = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Register() {
    return (
        <Elements>
            <BackToWebsiteBtn />
            <span style={{ marginTop: "-5rem", marginBottom: "-2rem" }}>
                <Logo width="200px" />
            </span>
            <RegisterForm />
        </Elements>
    );
}