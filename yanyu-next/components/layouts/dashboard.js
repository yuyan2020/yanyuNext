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
  Badge,
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
import { useState, createElement, useEffect, useContext } from "react";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";
import { TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  getUnReadMessageCount,
  logout,
  messageEvent,
} from "../../lib/api/apiService";
import { getMessage } from "../../lib/api/apiService";
import messageContext from "../../Providers/messageProvider/message-context";
import MessageState from "../../Providers/messageProvider/MessageState";

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
  getItem(<Link href="/message">Message</Link>, "message", <MessageOutlined />),
];

export default function DashboardLayout({ children }) {
  const {
    unReadCount,
    newMessages,
    markAsRead,
    setUnReadCount,
    addUnreadCount,
    receiveNewMessage,
  } = useContext(messageContext);
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState(["manager", "Overview"]);
  const [selectedKey, setSelectedKey] = useState(["Overview"]);
  const [notification, setNotification] = useState();
  const [page, setPage] = useState(1);
  const [totalNotification, setTotalNotification] = useState();

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

  useEffect(() => {
    getUnReadMessageCount().then((res) =>
      setUnReadCount(res.data.data.receive.notification.unread)
    );
  }, []);

  useEffect(() => {
    const sse = messageEvent();
    sse.onmessage = (event) => {
      let { data } = event;

      data = JSON.parse(data || {});

      if (data.type === "message") {
        if (data.content) {
          console.log(
            "%cdashboard.js line:136 newMessage",
            "color: #007acc;",
            data.content
          );
          receiveNewMessage(data.content);
          addUnreadCount();

          // setNotification([newMessage, ...notification]);
          // if (newMessage.length > 0) {
          //   setNewMessage([data.content, ...newMessage]);
          //   addUnreadCount();
          // } else {
          //   setNewMessage(data.content);
          //   addUnreadCount();
          // }
        }
      }
    };

    return () => {
      sse.close();
    };
  }, []);

  useEffect(() => {
    if (newMessages.length > 0) {
      setNotification([...newMessages, ...notification]);
    }
  }, [newMessages]);

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
    let crumb = ["manager", ...e.keyPath.reverse()];
  };

  const loadMoreNotification = () => {
    setPage(page + 1);
    getMessage({ page: page + 1, limit: 20, type: "notification" })
      .then((res) => {
        const moreNotification = res.data.data.messages;
        setNotification([...notification, ...moreNotification]);
        // setTotalNotification(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   loadMoreNotification();
  // }, []);

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
                  style={{
                    width: "400px",
                    height: "500px",
                  }}
                >
                  <TabPane tab="notification" key="1">
                    {notification ? (
                      <div
                        id="scrollableDiv"
                        style={{
                          height: 400,
                          overflow: "auto",
                        }}
                      >
                        <InfiniteScroll
                          dataLength={notification.length}
                          next={loadMoreNotification}
                          hasMore={notification.length < totalNotification}
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
                              <List.Item
                                key={item.id}
                                style={{ opacity: item.status ? 0.6 : 1 }}
                              >
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
                      </div>
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
              <Badge count={unReadCount}>
                <BellOutlined
                  style={{
                    fontSize: "20px",

                    cursor: "pointer",
                  }}
                  className="icon-hover"
                  onClick={() => {
                    if (!notification) {
                      getMessage({
                        limit: 20,
                        page: page,
                        type: "notification",
                      }).then((res) => {
                        setNotification(res.data.data.messages);
                        setTotalNotification(res.data.data.total);
                      });
                    }
                  }}
                />
              </Badge>
            </Popover>

            <LogoutOutlined
              style={{
                fontSize: "20px",
                marginLeft: "35px",
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
