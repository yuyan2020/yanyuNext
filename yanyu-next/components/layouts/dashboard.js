import { Layout, Menu, Breadcrumb } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  MessageOutlined,
  ProfileOutlined,
  InboxOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { useState, createElement } from "react";
import axios from "axios";
import { router } from "next/router";
import { TeamOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Header, Sider, Content, Footer } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const push = () => {
  router.push("/student/studentList");
};

const items = [
  getItem(
    <Link href="/dashboard">Overview</Link>,
    "Overview",
    <InboxOutlined />
  ),

  getItem("Student", "Student", <UserOutlined />, [
    getItem(
      <Link href="/student/studentList">StudentList</Link>,
      "Student List",
      <ProfileOutlined />
    ),
  ]),
  getItem("Teacher", "sub2", <TeamOutlined />, [
    getItem("Team 1", "3"),
    getItem("Team 2", "4"),
  ]),
  getItem("Course", "sub3", <BarsOutlined />, [
    getItem("Team 1", "5"),
    getItem("Team 2", "6"),
  ]),
  getItem("Message", "7", <MessageOutlined />),
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState(["manager", "Dashboard"]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const logout = async () => {
    axios.post(
      "http://cms.chtoma.com/api/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      }
    );
    localStorage.clear();
    router.push("/");
  };

  const onClick = (e) => {
    console.log(e.keyPath);
    let crumb = ["manager", ...e.keyPath.reverse()];
    setBreadcrumb(crumb);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={onClick}
        />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: toggle,
          })}
          <LogoutOutlined
            style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }}
            onClick={logout}
          />
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumb.map((b) => {
              return <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>;
            })}
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>CMS ©2022 Created by yy</Footer>
      </Layout>
    </Layout>
  );
}
