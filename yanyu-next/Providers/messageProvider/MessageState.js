import React, { useReducer, useEffect, useState } from "react";
import MessageContext from "./message-context";
import messageReducer from "./message-reducer";

import {
  MARK_AS_READ,
  ADD,
  SET_UNREAD_COUNT,
  RECEIVE_NEW_MESSAGE,
} from "./message-actions";
import { getUnReadMessageCount } from "../../lib/api/apiService";

const MessageState = (props) => {
  const initialState = {
    count: 1,
    newMessages: [],
  };

  const [state, dispatch] = useReducer(messageReducer, initialState);

  const markAsRead = (messageId) => {
    dispatch({
      type: MARK_AS_READ,
      payload: messageId,
    });
  };

  const addUnreadCount = () => {
    dispatch({
      type: ADD,
    });
  };

  const setUnReadCount = (count) => {
    dispatch({
      type: SET_UNREAD_COUNT,
      payload: count,
    });
  };

  const receiveNewMessage = (newMessage) => {
    dispatch({
      type: RECEIVE_NEW_MESSAGE,
      payload: newMessage,
    });
  };

  return (
    <MessageContext.Provider
      value={{
        unReadCount: state.count,
        newMessages: state.newMessages,
        markAsRead,
        addUnreadCount,
        setUnReadCount,
        receiveNewMessage,
      }}
    >
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageState;
