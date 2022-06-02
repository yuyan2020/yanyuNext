import {
  Layout,
  Menu,
  Breadcrumb,
  Popover,
  Tabs,
  List,
  Avatar,
  Skeleton,
  Divider,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  MessageOutlined,
  ProfileOutlined,
  InboxOutlined,
  BarsOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { useState, createElement, useEffect } from "react";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";
import { TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import { logout } from "../../lib/api/apiService";
import { getMessage } from "../../lib/api/apiService";

const { Header, Sider, Content, Footer } = Layout;
const { TabPane } = Tabs;

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
  const [notification, setNotification] = useState();
  const [page, setPage] = useState(1);

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

  const loadMoreNotification = () => {
    getMessage({ page: page, limit: 20, type: "notification" })
      .then((res) => {
        const moreNotification = res.data.data.messages;
        setNotification([...notification, ...moreNotification]);
        setPage(page + 1);
      })
      .catch((err) => {
        console.log(err);
      });
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
          <div>
            <Popover
              content={
                <Tabs
                  defaultActiveKey="1"
                  centered
                  animated={{ inkBar: true, tabPane: false }}
                  style={{
                    width: "400px",
                    height: "500px",
                    overflow: "auto",
                  }}
                  hideAdd={true}
                >
                  <TabPane tab="notification" key="1">
                    {notification ? (
                      <InfiniteScroll
                        dataLength={66}
                        next={loadMoreNotification}
                        hasMore={true}
                        loader={
                          <Skeleton avatar paragraph={{ rows: 1 }} active />
                        }
                        endMessage={
                          <Divider plain>It is all, nothing more 🤐</Divider>
                        }
                        scrollableTarget="scrollableDiv"
                      >
                        <List
                          dataSource={notification}
                          renderItem={(item) => (
                            <List.Item key={item.createdAt}>
                              <List.Item.Meta
                                avatar={<Avatar />}
                                title={item.from.nickname}
                                description={item.from.nickname}
                              />
                              <div>{item.content}</div>
                            </List.Item>
                          )}
                        />
                      </InfiniteScroll>
                    ) : null}
                  </TabPane>
                  <TabPane tab="message" key="2">
                    Content of Tab Pane 2
                  </TabPane>
                </Tabs>
              }
              trigger="click"
              placement="bottomLeft"
            >
              <BellOutlined
                style={{
                  fontSize: "20px",
                  marginRight: "35px",
                  cursor: "pointer",
                }}
                className="icon-hover"
                onClick={() => {
                  getMessage({
                    limit: 20,
                    page: page,
                    type: "notification",
                  }).then((res) => {
                    setNotification(res.data.data.messages);
                    setPage(page + 1);
                  });
                }}
              />
            </Popover>

            <LogoutOutlined
              style={{
                fontSize: "20px",
                marginRight: "25px",
                cursor: "pointer",
              }}
              onClick={handleLogout}
              className="icon-hover"
            />
          </div>
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
