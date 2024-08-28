import SettingsMenu from '../Menus/SettingsMenu';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 20px;
  width: calc(100% - 220px);
`;

const LayoutWithSettingsMenu = ({ children }: any) => {
  return (
    <LayoutContainer>
      <SettingsMenu />
      <Content>
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default LayoutWithSettingsMenu;