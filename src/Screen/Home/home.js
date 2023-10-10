import React, { useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MailOutlined,
  ContainerOutlined, MehOutlined,
} from "@ant-design/icons";
import { Col, Layout, Menu, Row, theme, Avatar, Dropdown } from "antd";
import { useLocation, Link, useNavigate } from "react-router-dom";
import FormSanPham from "../SanPham";
import DanhSachSanPham from "../DS_SanPham";
import DanhSachHopDong from "../DS_DaGui";
import TrungTam from "../TrungTam";

const Home = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const selectedKey = location.pathname;
  const info = JSON.parse(localStorage.getItem("user"));
  const role = info ? info.role : null;
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("home");
  const { Header, Content, Footer, Sider } = Layout;
  let items;
  if (role == "user") {
    items = [
      {
        label: "Tạo sản phẩm",
        key: "/home",
        icon: <MailOutlined />,
        to: "/home",
      },
      {
        label: "Danh sách sản phẩm",
        key: "/product",
        icon: <MailOutlined />,
        to: "/product",
      },
      {
        label: "Sản phẩm đã gửi",
        key: "/contract",
        icon: <UploadOutlined />,
        to: "/contract",
      },
      {
        label: "Trung tâm kiểm định",
        key: "/company",
        icon: <UserOutlined />,
        to: "/company",
      },
    ];
  } else if (role == "admin") {
    items = [
      {
        label: "Sản phẩm chờ duyệt",
        key: "/check",
        icon: <ContainerOutlined />,
        to: "/check",
      },
      {
        label: "Cấp chứng chỉ",
        key: "/phieu",
        icon: <ContainerOutlined />,
        to: "/phieu",
      },
    ];
  }
  else if (role == null) {
    items = [{
      label: "What are you try to do ?",
      key: "/tryhard",
      icon: <MehOutlined />
    }]
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menu = (
    <Menu>
      <Menu.Item key="profile">Thông tin tài khoản</Menu.Item>
      <Menu.Item key="logout" onClick={() => handleLogout()}>Đăng xuất</Menu.Item>
    </Menu>
  );

  // ---- ACTION ---- //
  const handleLogout = () => {
    navigate("/")
    localStorage.clear();
  }
  return (
    <Layout style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={"15%"}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" style={{ height: 100 }} />
        <Menu theme="dark" mode="inline" selectedKeys={selectedKey}>
          {items
            .filter((item) => item !== null) // Remove null items
            .map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={`${item.key}`}>{item.label}</Link>
              </Menu.Item>
            ))}
        </Menu>
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
              <div className="logo"></div>
            </Col>
            <Col span={11}>
              <Menu mode="horizontal" selectedKeys={selectedKey}>
                {items
                  .filter((item) => item !== null) // Remove null items
                  .map((item) => (
                    <Menu.Item key={item.key + "1"} icon={item.icon}>
                      <Link to={`${item.key}`}>{item.label}</Link>
                    </Menu.Item>
                  ))}
              </Menu>
            </Col>
            <Col span={4}>
              {/* "" */}
            </Col>
            <Col
              span={5}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "fit-content",
              }}
            >
              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar size="large" icon={<UserOutlined />} />
              </Dropdown>
              <p style={{ margin: 0, paddingLeft: 10 }}>{info ? info.name || info.username : ""}</p>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            height: '100vh'
          }}
        >
          <div
            style={{
              height: '100vh',
              padding: 24,
              background: colorBgContainer,
            }}
          >
            {/* {renderContent()} */}
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Huy Design ©2023 Created by Huy UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Home;
