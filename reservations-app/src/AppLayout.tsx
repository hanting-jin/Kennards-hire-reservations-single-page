import { Outlet } from 'react-router-dom';
import { Header, Layout, PageContainer } from './components';

const AppLayout = () => (
  <Layout header={<Header />} fluid>
    <PageContainer>
      <Outlet />
    </PageContainer>
  </Layout>
);

export default AppLayout;
