import "./Layout.css";
import React, { useEffect, useState } from "react";
import { ConfigProvider, theme, Layout, Menu, Typography } from "antd";
import { Outlet, Link } from "react-router-dom";
import { PictureOutlined, ExpandAltOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

export const CustomLayout = () => {
  const loc = useLocation();
  const [selectedKey, setSelectedKey] = useState(loc.pathname);
  const menuSelect = (item) => {
    console.log("menu select");
    console.log(item);
  };

  useEffect(() => {
    setSelectedKey(loc.pathname);
    console.log("location", loc);
  }, [loc.pathname, loc]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: "#2a3945",
          colorPrimary: "#1DA57A",
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0" s>
          <div className="logo">
            <Link to="/">
            <Typography.Title
              level={3}
              style={{
                color: "white",
                fontStyle: "italic",
                fontWeight: "bolder",
              }}
            >
              Generative Suite
            </Typography.Title>
            </Link>
          </div>
          <Menu
            onSelect={menuSelect}
            style={{padding: ".5rem"}}
            theme="dark"
            defaultSelectedKeys={[selectedKey]}
          >
            <Menu.Item key="/ImageGenerator" icon={<PictureOutlined />}>
              <Link to="/ImageGenerator">Image Generator</Link>
            </Menu.Item>
            <Menu.Item key="/ImageExtender" icon={<ExpandAltOutlined />}>
            <Link to="/ImageExtender">Image Extender</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="layout">
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
