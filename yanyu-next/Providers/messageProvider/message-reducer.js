import {
  MARK_AS_READ,
  ADD,
  SET_UNREAD_COUNT,
  RECEIVE_NEW_MESSAGE,
  REDUCE_UNREAD_COUNT,
} from "./message-actions";

const messageReducer = (state, action) => {
  switch (action.type) {
    case MARK_AS_READ:
      return {
        ...state,
      };
    case ADD:
      return {
        ...state,
        count: state.count + 1,
      };
    case SET_UNREAD_COUNT:
      return {
        ...state,
        count: action.payload,
      };

    case RECEIVE_NEW_MESSAGE:
      return {
        ...state,
        newMessages: [action.payload],
      };

    case REDUCE_UNREAD_COUNT:
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
};

export default messageReducer;
