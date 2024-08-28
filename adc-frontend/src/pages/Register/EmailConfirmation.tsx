import styled from "styled-components";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { httpPut } from "../../utils/http";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;

  padding-top: 10%;
`;
const H1 = styled.h1`
  padding: 3rem;
`;
const StyledResend = styled.p`
  font-size: 1.5rem;
`;
const Link = styled.a`
  color: var(--veronica);
  cursor: pointer;
  text-decoration: none;
  font-weight: normal;

  &:hover {
    font-weight: bolder;
  }
`;

export default function EmailConfirmation() {
  const [result, setResult] = useState(false);
  const { hashverify } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function confirmEmail() {
      setIsLoading(true);
      try {
        await httpPut(`/users/activate/${hashverify}`, null);
        setResult(true);
      } catch (error) {
        console.error("Erro ao confirmar o email:", error);
        setResult(false); 
      } finally {
        setIsLoading(false);
      }
    }
    confirmEmail();
  }, [hashverify]); 

  return (
    <Container>
      {isLoading ? <h1>A processar pedido...</h1> : (result ? (
        <>
          <IoIosCheckmarkCircle size="15rem" color="var(--teal)" />
          <H1>Email confirmado com sucesso!</H1>
          <StyledResend>
            Ir para a página de{" "}
            <Link onClick={() => navigate("/login")}>Login</Link>
          </StyledResend>
        </>
      ) : (
        <>
          <FaCircleXmark size="15rem" color="#BB271A" />
          <H1>Houve um problema.</H1>
          <StyledResend>
            <Link onClick={() => console.log("resend")}>Reenviar</Link> email de
            confirmação.
          </StyledResend>
        </>
      ))}
    </Container>
  );
}
