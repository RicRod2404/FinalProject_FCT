import { Fragment } from 'react/jsx-runtime';
import NavBar from '../NavBar/NavBar';
import LayoutWithSettingsMenu from "./LayoutWithSettingsMenu"

const SettingsLayout = ({ children }: any) => {
  return (
    <Fragment>
      <NavBar />
      <LayoutWithSettingsMenu>
        {children}
      </LayoutWithSettingsMenu>
    </Fragment>
  );
};

export default SettingsLayout;