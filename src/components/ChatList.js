import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './Header'
import burger from '../images/burger.png'
import profilePic from '../images/profilePic.jpeg'
import newChat from '../images/new-chat.png'
import chatStyles from '../styles/singleChatStyles.module.scss'
import chatListStyles from '../styles/chatListStyles.module.scss'

const baseServer = 'https://herokuhummingbird.herokuapp.com'

function SingleChat({ name, tag, userId, lastTime, lastMessage, indicator, key }) {
  return (
    <div key={key}>
      <Link to={`/MessageForm/${tag}/${name}/${userId}`}>
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
  tag: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  lastTime: PropTypes.string.isRequired,
  lastMessage: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

function getLastMessage({ lastMessage, lastType }) {
  let res = ''
  if (lastType === 'text') {
    const arr = lastMessage.split(' ')
    let i = 0
    let count = arr[i].length
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
  } else {
    res = lastType
  }

  return res
}

class ChatList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chats: [],
      userId: Number(this.props.match.params.userId),
    }
  }

  componentDidMount() {
    this.getChats()
  }

  getChats() {
    fetch(`${baseServer}/chats/chat_list/?id=${this.state.userId}`)
      .then((res) => res.json())
      .then((data) => {
        const { chats } = data
        chats.sort(this.compareNumber)
        for (let i = 0; i < chats.length; i += 1) {
          chats[i].key = i
          chats[i].lastMessage = getLastMessage(chats[i])
          chats[i].userId = this.state.userId
          const currChat = SingleChat(chats[i])
          this.setState((state) => {
            return { chats: [...state.chats, currChat] }
          })
        }
      })
  }

  compareNumber(a, b) {
    const aLen = a.indicator
    const bLen = b.indicator
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
        <Header
          leftImg={burger}
          leftLink={`/UserProfile/${this.state.userId}`}
          rightImg=""
          rightText="Exit"
          name="Hummingbird"
          onRightClick={(event) => {
            event.preventDefault()
            window.location.hash = '#/'
          }}
        />
        <div className={chatListStyles.chats}>{this.state.chats}</div>
        <Link to={`/CreateChat/${this.state.userId}`} className={chatListStyles.new_chat}>
          <img src={newChat} height="70px" alt="" />
        </Link>
      </div>
    )
  }
}

ChatList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
}

export default ChatList
