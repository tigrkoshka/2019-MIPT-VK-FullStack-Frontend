import { combineReducers } from 'redux'
import { chats } from './chats'
import { messages } from './messages'
// eslint-disable-next-line import/named
import { userInfo } from './userInfo'
// eslint-disable-next-line import/named
import { inputText } from './typing'

const rootReducer = combineReducers({
  chats,
  messages,
  userInfo,
  inputText,
})

export default rootReducer
