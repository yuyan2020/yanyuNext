import DashboardLayout from "../../components/layouts/dashboard";
import messageContext from "../../Providers/messageProvider/message-context";
import { useContext, useEffect, useState, createElement } from "react";
import { Divider, List, Avatar, Skeleton, Space } from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import { getMessage, updateMessage } from "../../lib/api/apiService";
import InfiniteScroll from "react-infinite-scroll-component";

const IconText = ({ icon, text }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

const listItemStyleUnread = {
  opacity: 1,
};

const listItemStyleReaded = {
  opacity: 0.6,
};

const Message = () => {
  const {
    unReadCount,
    newMessages,
    markAsRead,
    setUnReadCount,
    addUnreadCount,
    receiveNewMessage,
    reduceUnreadCount,
  } = useContext(messageContext);
  const [notification, setNotification] = useState();
  const [page, setPage] = useState(1);
  const [totalNotification, setTotalNotification] = useState();

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

  useEffect(() => {
    getMessage({
      limit: 20,
      page: page,
      userId: 3,
    }).then((res) => {
      setNotification(res.data.data.messages);
      setTotalNotification(res.data.data.total);
    });
  }, []);

  useEffect(() => {
    if (newMessages.length > 0) {
      setNotification([...newMessages, ...notification]);
    }
  }, [newMessages]);

  // useEffect(() => {
  //   console.log(
  //     "%cindex.js line:8 newMessages",
  //     "color: #007acc;",
  //     newMessages
  //   );
  // }, [newMessages]);

  return (
    <div style={{ width: "100%" }}>
      <h1>Recent Messages</h1>
      {notification ? (
        <InfiniteScroll
          dataLength={notification.length}
          next={loadMoreNotification}
          hasMore={notification.length < totalNotification}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={notification}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{ opacity: item.status ? 0.6 : 1 }}
                onClick={() => {
                  if (!item.status) {
                    updateMessage({ ids: [item.id], status: 1 }).then((res) => {
                      // const deepCopyNotification = [...notification]
                      setNotification((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, status: 1 } : i
                        )
                      );
                      reduceUnreadCount();
                    });
                  }
                }}
                actions={[
                  <IconText
                    icon={FieldTimeOutlined}
                    text={item.createdAt}
                    key={item.id}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar />}
                  title={item.from.nickname}
                  description={item.content}
                />
                {/* <div>{item.content}</div> */}
              </List.Item>
            )}
          />
        </InfiniteScroll>
      ) : null}
    </div>
  );
};

Message.Layout = DashboardLayout;

export default Message;
