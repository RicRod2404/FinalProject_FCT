import { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Category } from "../../types/CategoryType";
import { httpGet, httpPost, httpDelete } from "../../utils/http";
import { useSelector, useDispatch} from "react-redux";
import { sessionSelector } from "../../store/session";
import { set } from "../../store/snackbar";

export default function Categories() {
  const[form, setForm] = useState<Category>({
    name: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (session.isLogged) {
      httpGet("/products/category")
        .then((response) => {
          const fetchedCategories = Array.isArray(response.data) ? response.data : [];
          setCategories(fetchedCategories);
        })
        .catch((error) => {
          console.error("Failed to fetch categories:", error);
          setCategories([]); 
        });
    }
  }, [session.isLogged]);
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewCategory(e.target.value);
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }

  function addCategory() {
    console.log("form", form);
    if (newCategory.trim() !== "") {
      httpPost(`/products/category/${newCategory}`, {})
        .then(() => {
          dispatch(
            set({
              open: true,
              message: "Categoria adicionada com sucesso",
              type: "success",
              autoHideDuration: 3000,
            })
          );
          setCategories([...categories, { name: newCategory }]);
          setNewCategory(""); 
        })
      }
    }

  // Remover uma categoria existente
  const handleDeleteCategory = (name: string) => {
    httpDelete(`/products/category/${name}`)
      .then(() => {
        setCategories(categories.filter((category) => category.name !== name));
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  return (
    <Fragment>
      <Container
        className="tw-mt-3"
        style={{ marginTop: "7rem", marginLeft: "13rem" }}
      >
        <Row>
          <Col>
            <Table className="tw-mt-3">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ fontSize: "1.5rem", color: "var(--teal)" }}
                  >
                    Categorias
                  </TableCell>
                  <TableCell align="right" style={{ color: "var(--teal)" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.name}>
                    <TableCell component="th" scope="row">
                      {category.name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteCategory(category.name)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "var(--federal-blue)", width: 15, height: 15 }}
                      
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={newCategory}
                      onChange={handleChange}
                      placeholder="Nova Categoria"
                      variant="outlined"
                      InputProps={{
                        style: { height: '45px' },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={addCategory}
                      style={{
                        backgroundColor: "var(--teal)",
                        borderColor: "var(--teal)",
                      }}
                    >
                      Adicionar
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}
