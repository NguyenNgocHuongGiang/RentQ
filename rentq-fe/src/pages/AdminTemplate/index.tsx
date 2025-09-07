import React, { useState } from "react";
import { Layout, Menu, theme, Avatar, Badge, Button } from "antd";

const { Header, Content, Footer, Sider } = Layout;

import {
  HomeOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
    key: "/manage/contracts",
    icon: <FileTextOutlined />,
    label: "Contracts",
  },
  {
    key: "/manage/bills",
    icon: <DollarOutlined />,
    label: "Bills",
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
  const [collapsed, setCollapsed] = useState(false);

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    width: collapsed ? 80 : 280,
  };

  return (
    <Layout hasSider className="min-h-screen">
      <Sider 
        style={siderStyle}
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={280}
        collapsedWidth={80}
        className="!bg-[#0A2E50] border-r border-slate-600 shadow-2xl"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center py-6 border-b border-slate-600/50">
          
          {!collapsed && (
            <div className="text-center">
              <h2 className="font-bold text-xl mb-1  text-white">
                RentQ
              </h2>
              <p className="text-slate-300 text-sm font-medium">Management System</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="py-4">
          <Menu
            className="!border-none !bg-[#0A2E50] [&_.ant-menu-item-selected]:!bg-[#E07B39] 
             [&_.ant-menu-item-selected]:!text-white
             [&_.ant-menu-item-selected]:!shadow-md
             [&_.ant-menu-item-selected]:!scale-105"
            mode="inline"
            onClick={({ key }) => navigate(key)}
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
              ...item,
              className: "group !text-slate-200 !mx-3 !rounded-xl !mb-2 !h-12 !leading-12 hover:!bg-white/10 hover:!text-white hover:!shadow-lg hover:!scale-105 !transition-all !duration-300 !font-medium",
              style: {
                fontSize: '15px',
                fontWeight: '500',
              }
            }))}
            theme="dark"
          />
        </div>

        {/* User Profile Section */}
        {!collapsed && (
          <div className="absolute bottom-6 left-0 right-0 mx-3">
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar 
                    size={40} 
                    icon={<UserOutlined />} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">Admin User</p>
                  <p className="text-slate-300 text-xs">Super Administrator</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sider>

      <Layout className="bg-gray-50">
        {/* Modern Header */}
        <Header className="!p-0 !bg-[#0A2E50] shadow-xl sticky top-0 z-50 border-b border-white/20">
          <div className="flex items-center justify-between h-full px-6">
            {/* Left Side */}
            <div className="flex items-center space-x-6">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined className="text-lg" /> : <MenuFoldOutlined className="text-lg" />}
                onClick={() => setCollapsed(!collapsed)}
                className="!text-white hover:!bg-white/20 !border-none !w-10 !h-10 !rounded-lg !flex !items-center !justify-center hover:!scale-110 !transition-all !duration-300"
                size="large"
              />
              
              <div className="hidden md:block">
                <div className="overflow-hidden whitespace-nowrap max-w-md lg:max-w-4xl">
                  <div className="inline-block animate-marquee text-white font-medium text-base">
                    🚀 Welcome to RentQ Management System! Stay updated with the latest features and improvements 🚀
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">              
              <div className="flex items-center space-x-3 pl-4 border-l border-white/30">
                <div className="hidden sm:block text-right">
                  <p className="text-white text-sm font-medium">Welcome back!</p>
                  <p className="text-white/70 text-xs">Landlord Site</p>
                </div>
                <Avatar 
                  size={36} 
                  icon={<UserOutlined />} 
                  className="bg-white/20 cursor-pointer hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-lg"
                />
                <Button
                  type="text"
                  icon={<LogoutOutlined className="text-lg" />}
                  className="!text-white hover:!bg-white/20 !border-none !w-10 !h-10 !rounded-lg !flex !items-center !justify-center hover:!scale-110 !transition-all !duration-300"
                  size="large"
                  title="Logout"
                />
              </div>
            </div>
          </div>
        </Header>

        {/* Content Area */}
        <Content className="m-6 min-h-[calc(100vh-200px)]">
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="h-full overflow-hidden shadow-xl border border-slate-200/50 bg-white backdrop-blur-sm"
          >
            <Outlet />
          </div>
        </Content>

        {/* Modern Footer */}
        <Footer className="!text-center !bg-gradient-to-r from-slate-50 to-slate-100 !border-t !border-slate-200 !py-4">
          <div className="flex items-center justify-center space-x-2 text-slate-600">
            <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              RentQ Management System
            </span>
            <span className="text-slate-400">©{new Date().getFullYear()}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 flex items-center">
              Created with luv by Giang Ne
            </span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;