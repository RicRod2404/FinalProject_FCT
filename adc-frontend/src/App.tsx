import { Fragment } from "react/jsx-runtime";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register/Register";
import List from "./pages/Admin/List";
import CompleteRegister from "./pages/Register/CompleteRegister";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, sessionSelector } from "./store/session";
import { httpGet } from "./utils/http";
import { Alert, Snackbar } from "@mui/material";
import { snackbarSelector, unset } from "./store/snackbar";
import Profile from "./pages/Profile/Profile";
import Messages from "./pages/Profile/Messages.tsx";
import Edit from "./pages/Edit";
import PageNotFound from "./pages/PageNotFound";
import PasswordChange from "./pages/Settings/PasswordChange.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar/NavBar";
import AboutUs from "./pages/NavBar/AboutUs";
import EmailSent from "./pages/Register/EmailSent";
import EmailConfirmation from "./pages/Register/EmailConfirmation";
import Shop from "./pages/NavBar/Shop";
import BackOfficeHP from "./pages/BackOffice/BackOfficeHP.tsx";
import Social from "./pages/BackOffice/Social";
import Friends from "./pages/BackOffice/Friends";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ForgotPasswordEmail from "./pages/ForgotPassword/ForgotPasswordEmail.tsx";
import LayoutWithNavBarAndSideMenu from "./components/Layout/LayoutWithNavBarAndSideMenu";
import Admin from "./pages/Admin/Homepage";
import LayoutWithNavBarAndAdminSideMenu from "./components/Layout/LayoutWithNavBarAndAdminSideMenu"
import LayoutWithNavBarAndSettingsMenu from "./components/Layout/LayoutWithNavBarAndSettingsMenu.tsx"
import Settings from "./pages/Settings/Settings.tsx";
import ChangeEmailRequest from "./pages/Settings/ChangeEmailRequest.tsx";
import ChangeEmailAction from "./pages/Settings/ChangeEmailAction.tsx";
import CreateProduct from "./pages/Admin/CreateProduct.tsx";
import Categories from "./pages/Admin/Categories.tsx";
import Products from "./pages/Admin/Products.tsx";
import EditProduct from "./pages/Admin/EditProduct.tsx";
import Homepage from "./pages/Homepage.tsx";
import CommunityPage from "./pages/BackOffice/CommunityPage.tsx";
import Rankings from "./pages/NavBar/Rankings.tsx";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const snackbar = useSelector(snackbarSelector);
    const session = useSelector(sessionSelector);

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            let t: any = jwtDecode(token.split(" ")[1]);
            if (t.exp * 1000 > Date.now()) {
                dispatch(
                    login({
                        email: t.email,
                        nickname: t.nickname,
                        profilePic: t.profilePic,
                        token: token as string,
                        role: t.role,
                        iat: t.iat,
                        exp: t.exp,
                        jti: t.jti,
                        isLogged: true,
                        validated: false,
                    })
                );
            } else {
                dispatch(logout());
                navigate("/");
            }
        }
    }, []);

    useEffect(() => {
        if (!session.validated && session.isLogged) {
            httpGet("/users/" + session.nickname)
                .then(() => {
                    dispatch(
                        login({
                            ...session,
                            validated: true,
                        })
                    );
                })
                .catch(() => {
                    dispatch(logout());
                    navigate("/");
                });
        }
    }, [session.validated]);

    function handleClose() {
        dispatch(unset());
    }

    return (
        <Fragment>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Fragment>
                            <NavBar />
                            <Homepage />
                        </Fragment>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <Fragment>
                            <NavBar />
                            <AboutUs />
                        </Fragment>
                    }
                />
                <Route
                    path="/shop"
                    element={
                        <Fragment>
                            <NavBar />
                            <Shop />
                        </Fragment>
                    }
                />
                <Route
                    path="/rankings"
                    element={
                        <Fragment>
                            <NavBar />
                            <Rankings />
                        </Fragment>
                    }
                />

                <Route path="/404" element={<PageNotFound />} />
                <Route path="/*" element={<PageNotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/emailsent" element={<EmailSent />} />

                <Route
                    path="/password/reset/:verifyHash"
                    element={<ForgotPassword />}
                />
                <Route path="/password/forgot" element={<ForgotPasswordEmail />} />
                <Route path="/activate/:hashverify" element={<EmailConfirmation />} />


                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/profile/:id"
                        element={
                            <LayoutWithNavBarAndSideMenu>
                                <Profile />
                            </LayoutWithNavBarAndSideMenu>
                        }
                    />

                    <Route path="/profile/:id/messages"
                        element={<LayoutWithNavBarAndSideMenu>
                            <Messages />
                        </LayoutWithNavBarAndSideMenu>
                        } />
                    <Route
                        path="/edit/:id"
                        element={
                            <LayoutWithNavBarAndSideMenu>
                                <Edit />
                            </LayoutWithNavBarAndSideMenu>
                        }
                    />

                    <Route
                        path="/password/:id"
                        element={
                            <LayoutWithNavBarAndSettingsMenu>
                                <PasswordChange />
                            </LayoutWithNavBarAndSettingsMenu>
                        }
                    />
                    <Route path="/register/complete" element={<CompleteRegister />} />

                    <Route
                        path="/backoffice"
                        element={
                            <LayoutWithNavBarAndSideMenu>
                                <BackOfficeHP />
                            </LayoutWithNavBarAndSideMenu>
                        }
                    />

                    <Route
                        path="/backoffice/social/amigos"
                        element={
                            <LayoutWithNavBarAndSideMenu>
                                <Friends />
                            </LayoutWithNavBarAndSideMenu>
                        }
                    />

                    <Route
                        path="/backoffice/social/home"
                        element={
                            <LayoutWithNavBarAndSideMenu>
                                <Social />
                            </LayoutWithNavBarAndSideMenu>
                        }
                    />
                    <Route
                        path="/backoffice/social/community"
                        element={
                            <LayoutWithNavBarAndSideMenu>
                                <CommunityPage />
                            </LayoutWithNavBarAndSideMenu>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <LayoutWithNavBarAndSettingsMenu>
                                <Settings />
                            </LayoutWithNavBarAndSettingsMenu>
                        }
                    />

                    <Route
                        path="/settings/email/:id"
                        element={
                            <LayoutWithNavBarAndSettingsMenu>
                                <ChangeEmailRequest />
                            </LayoutWithNavBarAndSettingsMenu>
                        }
                    />

                    <Route path="/email/change/:verifyHash" element={<ChangeEmailAction />} />

                </Route>

                <Route element={<ProtectedRoute roles={["GBO", "GA", "GS", "SU"]} />}>
                    <Route
                        path="/admin"
                        element={
                            <LayoutWithNavBarAndAdminSideMenu>
                                <Admin />
                            </LayoutWithNavBarAndAdminSideMenu>
                        }
                    />

                    <Route
                        path="/admin/product"
                        element={
                            <LayoutWithNavBarAndAdminSideMenu>
                                <CreateProduct />
                            </LayoutWithNavBarAndAdminSideMenu>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <LayoutWithNavBarAndAdminSideMenu>
                                <Products />
                            </LayoutWithNavBarAndAdminSideMenu>
                        }
                    />
                    <Route
                        path="/admin/product/:id"
                        element={
                            <LayoutWithNavBarAndAdminSideMenu>
                                <EditProduct />
                            </LayoutWithNavBarAndAdminSideMenu>
                        }
                    />
                    <Route
                        path="/admin/categories"
                        element={
                            <LayoutWithNavBarAndAdminSideMenu>
                                <Categories />
                            </LayoutWithNavBarAndAdminSideMenu>
                        }
                    />

                    <Route
                        path="/admin/list"
                        element={
                            <LayoutWithNavBarAndAdminSideMenu>
                                <List />
                            </LayoutWithNavBarAndAdminSideMenu>
                        }
                    />
                </Route>
            </Routes>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={snackbar.autoHideDuration}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.type}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default App;
