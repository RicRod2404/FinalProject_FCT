import AdminSideMenu from '../Menus/AdminSideMenu';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 20px;
  width: calc(100% - 220px);
`;

const LayoutWithAdminSideMenu = ({ children }: any) => {
  return (
    <LayoutContainer>
      <AdminSideMenu />
      <Content>
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default LayoutWithAdminSideMenu;