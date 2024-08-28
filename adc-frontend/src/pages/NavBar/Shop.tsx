import styled from "styled-components";
import Carousel from "react-bootstrap/Carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "../../types/ProductType.ts";
import { useEffect, useState } from "react";
import { Button, CardGroup } from "react-bootstrap";
import { httpGet, httpPut } from "../../utils/http.ts";
import { Category } from "../../types/CategoryType.tsx";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session.ts";
import { set } from "../../store/snackbar.ts";
import { useNavigate } from "react-router-dom";
import PopUpModal from "../../components/PopUpModal.tsx";


const StyledCarouselItem = styled(Carousel.Item)`
  background-color: #ccc;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const CardContainer = styled("div")({
  background: "ver(--baby-powder)",
  padding: "1rem",
  margin: "0.8rem",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  width: "16rem",
  height: "20rem",
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const CardTitle = styled.h4`
  color: #343a40;
`;

const CardText = styled.p`
  color: #6c757d;
`;

const CardImage = styled.img`
  max-width: 100%;
  height: 10rem;
  border-radius: 8px;
`;

const InformationCard = styled("div")({
  padding: "0.8rem 1rem 1rem 1rem",
  lineHeight: "0.2rem",
});

const StyledCardTitle = styled(CardTitle)({
  color: "var(--hover-federal-blue)",
  fontSize: "1.2rem",
});
const Veronica = styled.span`
    color: var(--veronica);
    font-weight: bold;
    margin-left: 1rem;
`;

const StyledCardText = styled(CardText)`
  padding: 0.1rem;
  overflow: hidden;
  font-size: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Número máximo de linhas */
  -webkit-box-orient: vertical;
  line-height: 1.1rem; /* Ajuste conforme necessário */
  max-height: 3.6rem; /* line-height * número máximo de linhas */
  text-overflow: ellipsis;
  word-wrap: break-word; /* Permite quebra de palavra */
  white-space: pre-wrap; /* Mantém quebras de linha */
`;
const StyledPointsTitle = styled.div`
    background-color: white;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    font-size: 1.2rem;
    border-radius: 8px;
    width: auto;
    padding: 1rem;
   border: 1px solid rgba(0, 0, 0, 0.05);
` ;


const StyledCardPriceText = styled(CardText)({
  color: "var(--veronica)",
  fontWeight: "bold",
});

const Spacer = styled.div`
  margin-top: 1rem;
`;

export default function Shop() {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [leafPoints, setLeafPoints] = useState<number>(0);
  const [toBuyProduct, setToBuyProduct] = useState<string>("");
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [buyProductIsopen, setBuyProductIsopen] = useState(false);

  useEffect(() => {
    httpGet("/products").then((res) => {
      // @ts-ignore
      setProducts(res.data);
    });
    httpGet("/products/category").then((res) => {
      const fetchedCategories = Array.isArray(res.data) ? res.data : [];
      setCategories(fetchedCategories);
    });
  }, []);

  useEffect(() => {
    if (session.isLogged) {
      httpGet("/users/" + session.nickname).then((res) => {
        // @ts-ignore
        setLeafPoints(res.data.leafPoints);
      });
    }
  }, [session.isLogged]);

  function handleCategoryChange(event: any, value: Category[]) {
    console.log(event);
    setSelectedCategories(value);
  }

  function handleBuyProduct(internalCode: string) {
    httpPut("sales", { email: session.email, internalCode }).then(
      () => {
        httpGet("/users/" + session.nickname).then((res) => {
          // @ts-ignore
          setLeafPoints(res.data.leafPoints);
        });
        dispatch(
          set({
            open: true,
            message: "Compra efetuada com sucesso",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        setBuyProductIsopen(false);
      },
      (error) => {
        dispatch(
          set({
            open: true,
            message:
              error.status === 400
                ? "LPs insuficientes"
                : error.status === 406
                ? "Produto esgotado"
                : "Erro ao processar pedido, por favor tente mais tarde",
            type: "error",
            autoHideDuration: 3000,
          })
        );
        setBuyProductIsopen(false);
      }
    );
  }

  return (
    <div>
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

      <Spacer />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginLeft: "3rem",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        {session.isLogged && (
          <StyledPointsTitle
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Pontos: <Veronica>{leafPoints}</Veronica>
          </StyledPointsTitle>
        )}
        <Autocomplete
          multiple
          id="category-select"
          options={categories}
          getOptionLabel={(option) => option.name}
          value={selectedCategories}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          onChange={handleCategoryChange}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Categoria" />
          )}
          style={
            session.isLogged
              ? { width: "25%", marginLeft: "1rem", marginRight: "2rem" }
              : {
                  width: "40%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }
          }
        />
      </div>

      <div style={{ marginLeft: "2rem", display: "flex", flexWrap: "wrap", marginTop: "1.5rem", marginBottom: "2rem" }}>
        {Object.values(products)
          .flat()
          .filter(
            (product: Product) =>
              selectedCategories.length === 0 ||
              product.category.some((category) =>
                selectedCategories.some((cat) =>
                  cat.name.includes(category.name)
                )
              )
          )
          .map((product: Product, index) => (
            <div key={index} style={{ marginTop: "1rem" }}>
              <CardGroup style={{ cursor: "pointer" }}>
                <CardContainer style={{ height: "100%" }} key={index}>
                  <CardImage
                    src={product.photo as string}
                    alt={product.name as string}
                  />
                  <InformationCard>
                    <StyledCardTitle title={product.name.trim()}>
                      {product.name.trim().length > 19
                        ? `${product.name.trim().substring(0, 19)}...`
                        : product.name.trim()}
                    </StyledCardTitle>
                    <StyledCardText>{product.description}</StyledCardText>
                    <StyledCardPriceText>{`${product.price.toString()} LPs`}</StyledCardPriceText>
                  </InformationCard>
                  <Button
                    onClick={() => {
                      setToBuyProduct(product.internalCode);
                      session.isLogged
                        ? setBuyProductIsopen(true)
                        : navigate("/login");
                    }}
                    className="button-hover-effect"
                    style={{backgroundColor:"var(--federal-blue)", border: "none"}}
                  >
                    Comprar
                  </Button>
                </CardContainer>
              </CardGroup>
              <PopUpModal
                isOpen={buyProductIsopen}
                onRequestClose={() => setBuyProductIsopen(false)}
                onConfirm={() => handleBuyProduct(toBuyProduct)}
                message={"Tem a certeza de que pretende comprar este produto?"}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
