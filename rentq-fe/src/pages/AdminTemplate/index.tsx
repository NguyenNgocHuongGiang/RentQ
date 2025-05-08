import React from "react";
import { Layout, Menu, theme } from "antd";
import "./style.css";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  backgroundColor: "#c2bdb5",
};

import {
  HomeOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const menuItems = [
  {
    key: "/manage/dashboard",
    icon: <HomeOutlined />,
    label: "Dashboard",
  },
  {
    key: "/manage/properties",
    icon: <ApartmentOutlined />,
    label: "Properties",
  },
  {
    key: "/manage/tenants",
    icon: <TeamOutlined />,
    label: "Tenants",
  },
  {
    key: "/manage/bills",
    icon: <DollarOutlined />,
    label: "Bills",
  },
  {
    key: "/manage/contracts",
    icon: <FileTextOutlined />,
    label: "Contracts",
  },
  {
    key: "/manage/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
  {
    key: "/",
    icon: <ArrowLeftOutlined />,
    label: "Back to User Site",
  },
];

const AdminTemplate = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <div className="text-center mt-10 mb-5 flex justify-center items-center">
          <img width={100} height={100} src="/images/logo.png" alt="" />
        </div>
        <Menu
          className="!bg-[#c2bdb5] !border-none"
          mode="inline"
          onClick={({ key }) => navigate(key)}
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee text-[#483507] font-semibold text-[18px]">
              🚀📢 Welcome to RentQ System ! Stay up-to-date with the latest
              announcements, system updates, and task alerts to manage
              everything smoothly 🚀📢
            </div>
          </div>
        </Header>

        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="h-full"
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          RentQ ©{new Date().getFullYear()} Created by Giang Ne
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;
