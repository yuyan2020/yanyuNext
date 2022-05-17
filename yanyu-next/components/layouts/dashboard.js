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
import { useState, createElement, useEffect } from "react";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";
import { TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import { logout } from "../../lib/api/apiService";

const { Header, Sider, Content, Footer } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <Link href="/dashboard">Overview</Link>,
    "Overview",
    <InboxOutlined />
  ),

  getItem("Student", "student", <UserOutlined />, [
    getItem(
      <Link href="/student/studentList">StudentList</Link>,
      "studentList",
      <ProfileOutlined />
    ),
  ]),
  getItem("Teacher", "teacher", <TeamOutlined />, [
    getItem(
      <Link href="/teacher/teacherList">Teacher List</Link>,
      "teacherList",
      <ProfileOutlined />
    ),
  ]),
  getItem("Course", "course", <BarsOutlined />, [
    getItem(
      <Link href="/course/allCourse">All Course</Link>,
      "allCourse",
      <ProfileOutlined />
    ),
    getItem(
      <Link href="/course/addCourse">Add Course</Link>,
      "addCourse",
      <ProfileOutlined />
    ),
    getItem(
      <Link href="/course/editCourse">Edit Course</Link>,
      "editCourse",
      <ProfileOutlined />
    ),
  ]),
  getItem("Message", "message", <MessageOutlined />),
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState(["manager", "Overview"]);
  const [selectedKey, setSelectedKey] = useState(["Overview"]);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      if (linkPath[0] === "dashboard") {
        setBreadcrumb(["manager", "Overview"]);
        setSelectedKey(["Overview"]);
      } else {
        setBreadcrumb(["manager", ...linkPath]);
        setSelectedKey([...linkPath]);
        console.log(selectedKey);
      }
    }
  }, [router]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout()
      .then((res) => {
        localStorage.clear();
        router.push("/");
      })
      .catch((err) => console.log(err));
  };

  const onClick = (e) => {
    // console.log(e.keyPath);
    let crumb = ["manager", ...e.keyPath.reverse()];
    // setBreadcrumb(crumb);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={[selectedKey[0]]}
          selectedKeys={selectedKey}
          // openKeys={selectedKey}
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
            onClick={handleLogout}
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
