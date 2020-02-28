import types from '../constants/ActionTypes'

export const messagesSuccess = (messages, chatTag) => ({
  type: types.MESSAGES_SUCCESS,
  payload: messages,
  chatTag,
})

export const messagesError = (error) => ({
  type: types.MESSAGES_ERROR,
  payload: {
    error,
  },
})

export const chatSuccess = (chat) => ({
  type: types.CHATS_SUCCESS,
  payload: chat,
})

export const chatError = (error) => ({
  type: types.CHATS_ERROR,
  payload: {
    error,
  },
})

export const userSuccess = (user) => ({
  type: types.USER_SUCCESS,
  payload: user,
})

export const userError = (error) => ({
  type: types.USER_ERROR,
  payload: {
    error,
  },
})

export const typing = (message, chat) => ({
  type: types.CHANGE_MESSAGE,
  payload: message,
  chat,
})
