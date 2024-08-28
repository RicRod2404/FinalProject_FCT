import styled from "styled-components";
import { Fragment } from "react/jsx-runtime";
import { Row, Col, Stack, Container, Button } from "react-bootstrap";
import { TextField, Autocomplete } from "@mui/material";
import { Product } from "../../types/ProductType";
import { MutableRefObject, useRef, useState } from "react";
import {httpGet, httpPost} from "../../utils/http";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { sessionSelector } from "../../store/session";
import { set } from "../../store/snackbar";
import { useEffect } from "react";
import { Category } from "../../types/CategoryType";

const PictureContainer = styled("div")({
  display: "block",
  width: "60rem",
  height: "30rem",
  alignContent: "center",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f0f0f0",
  cursor: "pointer",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const IconWrapper = styled("span")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function CreateProduct() {
  const [product, setProduct] = useState<Product>({
    name: "",
    internalCode: "",
    description: "",
    category: [],
    price: 0,
    photo: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const ref: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);
  //const params = useParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (session.isLogged) {
      httpGet("/products/category")
        .then((response) => {
          const fetchedCategories = Array.isArray(response.data)
            ? response.data
            : [];
          setCategories(fetchedCategories);
        })
        .catch((error) => {
          console.error("Failed to fetch categories:", error);
          setCategories([]);
        });
    }
  }, [session.isLogged]);

  function handleChangePhoto() {
    ref.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleCategoryChange(event: any, value: Category[]) {
    console.log(event);
    setSelectedCategories(value);
    // @ts-ignore //TODO: CHECK IF IS NECESSARY TO FIX THIS PROPERLY
    setProduct((prev) => ({ ...prev, category: value }));
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setProduct((prev) => ({ ...prev, profilePicDeleted: false }));
    }
  }

  function create() {
    const formData = new FormData();
    const productWithCategories = {
      ...product,
      category: selectedCategories,
    };

    formData.append(
      "form",
      new Blob([JSON.stringify(productWithCategories)], {
        type: "application/json",
      })
    );

    if (image)
      formData.append(
        "photo",
        new Blob([image as BlobPart], { type: "application/octet-stream" })
      );

    httpPost("/products", formData).then(
      () => {
        dispatch(
          set({
            open: true,
            message: "Produto criado com sucesso",
            type: "success",
            autoHideDuration: 3000,
          })
        );
        navigate("/admin");
      },
      () => {
        dispatch(
          set({
            open: true,
            message: "Erro ao criar produto",
            type: "error",
            autoHideDuration: 3000,
          })
        );
      }
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "7rem",
          marginLeft: "20rem",
        }}
      >
        <PictureContainer
          onClick={handleChangePhoto}
          style={{
            backgroundImage: `url(${
              image ? URL.createObjectURL(image) : product.photo
            })`,
          }}
        >
          {!image && (
            <IconWrapper>
              <FontAwesomeIcon icon={faUpload} color="grey" size="10x" />
            </IconWrapper>
          )}
        </PictureContainer>
        <input
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          ref={ref}
          onChange={uploadImage}
        />
        <Fragment>
          <Container style={{ height: "auto" }}>
            <Row style={{ marginTop: "4rem" }}>
              <Col className="col-10 mx-auto">
                <Stack direction="vertical" gap={3}>
                  <TextField
                    name="name"
                    value={product.name}
                    label="Nome"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <Autocomplete
                    multiple
                    id="category-select"
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    value={selectedCategories}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Categoria"
                      />
                    )}
                  />
                  <TextField
                    name="description"
                    value={product.description}
                    label="Descrição"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <TextField
                    name="price"
                    value={product.price}
                    label="Pontos"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <TextField
                    name="internalCode"
                    value={product.internalCode}
                    label="Código interno"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Stack>
              </Col>
            </Row>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Button
                style={{
                  marginRight: "1rem",
                  marginBottom: "2rem",
                  backgroundColor: "var(--teal)",
                  borderColor: "var(--teal)",
                }}
                onClick={create}
              >
                Guardar Informações
              </Button>

              <Button
                style={{
                  marginLeft: "1rem",
                  marginBottom: "2rem",
                  backgroundColor: "white",
                  borderColor: "white",
                  color: "red",
                }}
                onClick={() => navigate("/admin")}
              >
                Cancelar
              </Button>
            </div>
          </Container>
        </Fragment>
      </div>
    </>
  );
}