import React, { useState } from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, MailOutlined } from '@ant-design/icons';
import { Col, Layout, Menu, Row, theme, Avatar } from 'antd';
import { useLocation } from 'react-router-dom';
import FormSanPham from '../SanPham';


const Home = () => {
  const location = useLocation();
  const { state } = location;
  const info = state?.info || {};
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Footer, Sider } = Layout;
  const items = [
    {
      label: 'Tạo sản phẩm',
      key: 'product',
      icon: <MailOutlined />,
    },
    {
      label: 'Danh sách sản phẩm',
      key: 'list',
      icon: <MailOutlined />,
    },
    {
      label: 'Sản phẩm đã gửi',
      key: 'upload',
      icon: <UploadOutlined />,
    },
    {
      label: 'Trung tâm kiểm định',
      key: 'center',
      icon: <UserOutlined />,
    },
  ]
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{ flex: 1, height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={'15%'}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" style={{height: 100}}/>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={'product'}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Row>
            <Col span={4}>
              <div className='logo'></div>
            </Col>
            <Col span={16}>
              <Menu selectedKeys={'1'} mode="horizontal" items={items} />
            </Col>
            <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar size="large" icon={<UserOutlined />} />
              <p style={{ margin: 0, paddingLeft: 10 }}>{info.username}</p>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <FormSanPham/>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Home;