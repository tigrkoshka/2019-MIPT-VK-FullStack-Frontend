import React from 'react'
import PropTypes from 'prop-types'
import headerStyles from '../styles/chatListHeaderStyles.module.scss'
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

function Header(props) {
  return (
    <div className={headerStyles.rectangle}>
      <div className={headerStyles.empty} />
      <div className={headerStyles.burger}>
        <div className={headerStyles.vertical}>
          <img src="../images/burger.png" height="45px" width="height" alt="" />
        </div>
      </div>
      <div className={headerStyles.horizontal}>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.hummingbird}>Hummingbird</div>
        </div>
      </div>
      <div className={headerStyles.search}>
        <div className={headerStyles.vertical}>
          <img src="../images/search.png" height="35px" width="height" alt="" />
        </div>
      </div>
      <div className={headerStyles.empty} />
    </div>
  )
}

function SingleChat({ name, lastTime, lastMessage, indicator, key }) {
  return (
    <div key={key}>
      <div className={chatStyles.chat}>
        <table>
          <tbody>
            <tr>
              <td rowSpan="2" className={chatStyles.for_pic}>
                <div className={chatStyles.photo}>
                  <img src="/src/images/profilePic.jpeg" alt="" className="pic" />
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

    const preLastMess = messagesOfThisChat[numberOfMessages - 1].content
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
      <div className={chatListStyles}>
        <Header className={chatListStyles.header} />
        <div className={chatListStyles.chats}>{this.state.chats}</div>
        <div className={chatListStyles.new_chat}>
          <img src="../images/new-chat.png" height="70px" alt="" />
        </div>
      </div>
    )
  }
}

export default ChatList
