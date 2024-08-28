import { Fragment } from 'react/jsx-runtime';
import NavBar from '../NavBar/NavBar';
import LayoutWithAdminSideMenu from "./LayoutWithAdminSideMenu"

const AdminLayout = ({ children }: any) => {
  return (
    <Fragment>
      <NavBar />
      <LayoutWithAdminSideMenu>
        {children}
      </LayoutWithAdminSideMenu>
    </Fragment>
  );
};

export default AdminLayout;