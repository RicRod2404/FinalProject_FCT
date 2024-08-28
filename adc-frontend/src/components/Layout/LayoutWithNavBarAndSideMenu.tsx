import { Fragment } from 'react/jsx-runtime';
import NavBar from '../NavBar/NavBar';
import LayoutWithSideMenu from './LayoutWithSideMenu';

const Layout = ({ children }: any) => {
  return (
    <Fragment>
      <NavBar />
      <LayoutWithSideMenu>
        {children}
      </LayoutWithSideMenu>
    </Fragment>
  );
};

export default Layout;