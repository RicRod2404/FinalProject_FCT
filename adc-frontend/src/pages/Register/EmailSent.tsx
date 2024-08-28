import styled from "styled-components";
import { ImMail4 } from "react-icons/im";
import BackToWebsiteBtn from "../../components/BackToWebsiteBtn";
import {communitySelector} from "../../store/community.ts";
import {useDispatch, useSelector} from "react-redux";
import {httpPut} from "../../utils/http.ts";
import {set} from "../../store/snackbar.ts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: "100vh";
`;
const H1 = styled.h1`
  padding: 3rem;
`;

const Sub = styled.p`
  color: var(--grey);
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



export default function EmailSent() {
    const community = useSelector(communitySelector) //Reusing the communitySelector from the store
    const dispatch = useDispatch();

   function resendEmail() {
       httpPut("/users/resendEmail?email=" + community.name, {}).then(
           () => {
               dispatch(
                   set({
                       open: true,
                       message: "Email reenviado",
                       type: "success",
                       autoHideDuration: 3000,
                   })
               );
           },
           () => {
               dispatch(
                   set({
                       open: true,
                       message: "Ocorreu um erro, por favor tente novamente",
                       type: "error",
                       autoHideDuration: 3000,
                   })
               );
           })
   }

  return (
    <Container>
      <BackToWebsiteBtn />
      <ImMail4 size="15rem" color="var(--federal-blue)" />
        <H1>Foi enviado um email de confirmação. </H1>
        <H1>O pedido pode demorar alguns minutos. Verifique a caixa de Spam.</H1>
      <Sub>Não recebeste?</Sub>
      <StyledResend>
        <Link onClick={() => resendEmail()}>Reenviar</Link> email
      </StyledResend>
    </Container>
  );
}
