import SideMenu from '../Menus/SideMenu';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 20px;
  width: calc(100% - 220px);
`;

const LayoutWithSideMenu = ({ children }: any) => {
  return (
    <LayoutContainer>
      <SideMenu />
      <Content>
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default LayoutWithSideMenu;