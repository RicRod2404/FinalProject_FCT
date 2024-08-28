import styled from "styled-components";
import Slogan from "../components/Slogan";
import Carousel from "react-bootstrap/Carousel";
import "react-multi-carousel/lib/styles.css";


const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 6rem;
`;

const ImageContainer = styled.div`
  display: grid;
  margin-top: 1rem;
`;

const AppStore = "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/apple.png"
const GoogleStore = "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/google.png"
const QRCode = "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/Treap_QRcode.png"

const StyledCarouselItem = styled(Carousel.Item)`
  background-color: #ccc;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

export default function HomepageWithoutLogin() {
  return (
    <HeroSection>
      <Carousel>
        <Carousel.Item>
          <StyledCarouselItem>
            <img
              src="https://storage.googleapis.com/treapapp.appspot.com/frontend-source/Shop1.jpg"
              alt="First slide"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </StyledCarouselItem>
        </Carousel.Item>
        <Carousel.Item>
          <StyledCarouselItem>
            <img
              src="https://storage.googleapis.com/treapapp.appspot.com/frontend-source/Shop2.jpg"
              alt="Second slide"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </StyledCarouselItem>
        </Carousel.Item>
        <Carousel.Item>
          <StyledCarouselItem>
            <img
              src="https://storage.googleapis.com/treapapp.appspot.com/frontend-source/Shop3.jpg"
              alt="Third slide"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </StyledCarouselItem>
        </Carousel.Item>
      </Carousel>
      <div style={{marginLeft : "4rem"}}>
      <Slogan />
      <ImageContainer>
        <img src={GoogleStore} alt="GoogleStore" style={{ gridRow: '1' }} />
        <img src={AppStore} alt="AppStore" style={{ gridRow: '2' }} />
        <img src={QRCode} style={{ gridRow: '1/span 2', gridColumn: '2 / span 100', height: "9rem", width: "9rem" }} />
      </ImageContainer>
      </div>
    </HeroSection>
  );
}
