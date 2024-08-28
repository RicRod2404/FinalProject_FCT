import { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar, TextField
} from "@mui/material";
import { Product } from "../../types/ProductType";
import { httpGet, httpPut, httpDelete } from "../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { set } from "../../store/snackbar";
import PopUpModal from "../../components/PopUpModal";

export default function Categories() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stock, setStock] = useState<number>(1);
    const [selectedProductIC, setSelectedProductIC] = useState<string>("");
    const [stockPanelOpen, setStockPanelOpen] = useState<boolean>(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const dispatch = useDispatch();
    const session = useSelector(sessionSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (session.isLogged) {
            httpGet("products").then((response) => {
                // @ts-ignore
                setProducts(response.data);
            });
        }
    }, [session.isLogged]);

    const handleDeleteProduct = (internalCode: string) => {
        httpDelete(`/products/${internalCode}`)
            .then(() => {
                setProducts(products.filter((product) => product.internalCode !== internalCode));
                setDeleteModalIsOpen(false);
                dispatch(
                    set({
                        open: true,
                        message: "Produto deletado com sucesso",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                dispatch(
                    set({
                        open: true,
                        message: "Erro ao deletar o produto",
                        type: "error",
                        autoHideDuration: 3000,
                    })
                );
            });
    };

    const handleAddStock = (internalCode: string) => {
        httpPut("products/stock", { internalCode: internalCode, quantity: stock }).then(
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Stock adicionado com sucesso",
                        type: "success",
                        autoHideDuration: 3000,
                    })
                );
                setStockPanelOpen(false);
            },
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "Erro ao adicionar stock",
                        type: "error",
                        autoHideDuration: 3000,
                    })
                );
                setStockPanelOpen(false);
            }
        );
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
                                <TableCell style={{ fontSize: "1.5rem", color: "var(--teal)" }}>
                                    Produtos
                                </TableCell>
                                <TableRow>
                                    <TableCell>Foto</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Código Interno</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Categoria</TableCell>
                                    <TableCell>Preço</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.name}>
                                        <TableCell>
                                            <Avatar
                                                src={product.photo}
                                                alt={product.name}
                                                variant="square"
                                                style={{ width: 40, height: 40 }}
                                            />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.internalCode}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>
                                            {product.category.map((cat) => cat.name).join(", ")}
                                        </TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    setProductToDelete(product.internalCode);
                                                    setDeleteModalIsOpen(true);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    style={{ color: "var(--federal-blue)", width: 15, height: 15 }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => navigate(`/admin/product/${product.internalCode}`)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    style={{ color: "var(--federal-blue)", width: 15, height: 15 }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedProductIC(product.internalCode);
                                                    setStockPanelOpen(true);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    style={{ color: "var(--federal-blue)", width: 15, height: 15 }}
                                                />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <Modal style={{ marginTop: '15%' }} show={stockPanelOpen} onHide={() => setStockPanelOpen(false)}>
                <Modal.Body>
                    <p style={{ display: "flex", justifyContent: "center" }}>
                        <b>Quantidade de stock a adicionar: {selectedProductIC}</b>
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2rem" }}>
                        <TextField
                            style={{ marginRight: "1rem"}}
                            value={stock}
                            onChange={(event) => setStock(Number(event.target.value))}
                        />
                        <Button
                            onClick={() => {
                                handleAddStock(selectedProductIC);
                            }}
                            className="button-hover-effect"
                            style={{backgroundColor: "var(--federal-blue)", border: "none", height: "3rem"}}
                        >
                            Adicionar
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <PopUpModal
                isOpen={deleteModalIsOpen}
                onRequestClose={() => setDeleteModalIsOpen(false)}
                onConfirm={() => {
                    if (productToDelete) {
                        handleDeleteProduct(productToDelete);
                    }
                }}
                message="Tem a certeza de que deseja apagar este produto?"
            />
        </Fragment>
    );
}
