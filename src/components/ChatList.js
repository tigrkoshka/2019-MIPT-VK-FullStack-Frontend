import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './Header'
import burger from '../images/burger.png'
import search from '../images/search.png'
import profilePic from '../images/profilePic.jpeg'
import newChat from '../images/new-chat.png'
import chatStyles from '../styles/singleChatStyles.module.scss'
import chatListStyles from '../styles/chatListStyles.module.scss'

const data = [
  'Общество целых бокалов',
  'Дженнифер Эшли',
  'Антон Иванов',
  'Серёга (должен 2000)',
  'Общество разбитых бокалов',
  'Сэм с Нижнего',
  'Айрат работа',
  'Кеша армия',
  'Первый курс ФПМИ-Наука 2019-2020',
]

function SingleChat({ name, lastTime, lastMessage, indicator, key }) {
  return (
    <div key={key}>
      <Link to={`MessageForm/${name}`}>
        <div className={chatStyles.chat}>
          <table>
            <tbody>
              <tr>
                <td rowSpan="2" className={chatStyles.for_pic}>
                  <div className={chatStyles.photo}>
                    <img src={profilePic} alt="" className={chatStyles.pic} height="100px" width="height" />
                  </div>
                </td>
                <td className={chatStyles.first}>
                  <div className={chatStyles.name}>{name}</div>
                  <div className={chatStyles.last_time}>{lastTime}</div>
                </td>
              </tr>
              <tr>
                <td className={chatStyles.second}>
                  <div className={chatStyles.last_message}>{lastMessage}</div>
                  <div className={chatStyles.indicator}>{indicator}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Link>
      <hr />
    </div>
  )
}

SingleChat.propTypes = {
  name: PropTypes.string.isRequired,
  lastTime: PropTypes.string.isRequired,
  lastMessage: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

function setAll(name) {
  const props = {}

  props.name = name

  const messagesOfThisChat = JSON.parse(localStorage.getItem(name)) || []

  if (messagesOfThisChat.length !== 0) {
    const numberOfMessages = messagesOfThisChat.length

    props.lastTime = messagesOfThisChat[numberOfMessages - 1].time

    const preLastMess = messagesOfThisChat[0].content
    const arr = preLastMess.split(' ')
    let i = 0
    let count = arr[i].length
    let res = ''
    while (i < arr.length && count < 100) {
      res += `${arr[i]} `
      i += 1
      if (i < arr.length) {
        count += arr[i].length
      }
    }
    res = res.substr(0, res.length - 1)
    if (i < arr.length) {
      res += '...'
    }

    props.lastMessage = res
    props.indicator = numberOfMessages
  } else {
    props.lastTime = ''
    props.lastMessage = ''
    props.indicator = 0
  }

  return props
}

class ChatList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chats: [],
    }
    data.sort(this.compareNumber)
    for (let i = 0; i < data.length; i += 1) {
      const currProps = setAll(data[i])
      currProps.key = i
      const currChat = SingleChat(currProps)
      this.state.chats.push(currChat)
    }
  }

  compareNumber(a, b) {
    if (localStorage.getItem(a) === null) {
      if (localStorage.getItem(b) === null) {
        return 0
      }
      return 1
    }
    if (localStorage.getItem(b) === null) {
      return -1
    }
    const aLen = JSON.parse(localStorage.getItem(a)).length
    const bLen = JSON.parse(localStorage.getItem(b)).length
    if (aLen > bLen) {
      return -1
    }
    if (aLen === bLen) {
      return 0
    }
    if (aLen < bLen) {
      return 1
    }
    return 0
  }

  render() {
    return (
      <div className={chatListStyles.container}>
        <Header leftImg={burger} rightImg={search} leftLink="/UserProfile" name="Hummingbird" onRightClick={() => {}} />
        <div className={chatListStyles.chats}>{this.state.chats}</div>
        <div className={chatListStyles.new_chat}>
          <img src={newChat} height="70px" alt="" />
        </div>
      </div>
    )
  }
}

export default ChatList
