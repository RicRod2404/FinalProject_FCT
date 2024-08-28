import styled from "styled-components";
import CompleteRegisterForm from "../../features/authentication/CompleteRegisterForm";

const Elements = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 7rem;
  margin-left: 15rem;
  align- items: center;
`;

const FormContainer = styled.div`
  flex: 1;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  padding: 1rem;
  margin-top: -1rem;
`;

const src = "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/pegada.jpg";
export default function CompleteRegister() {
  return (
    <>
      <Elements>
        <FormContainer>
          <CompleteRegisterForm />
        </FormContainer>
        <ImageContainer>
          <img src={src} width={400} style={{ borderRadius: "310px" }} />
        </ImageContainer>
      </Elements>
    </>
  );
}
