import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './Header'
import { baseServer } from '../settings'
import burger from '../images/burger.png'
import profilePic from '../images/profilePic.jpeg'
import newChat from '../images/new-chat.png'
import chatStyles from '../styles/singleChatStyles.module.scss'
import chatListStyles from '../styles/chatListStyles.module.scss'

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

function getDisplayOfLastMessage({ lastMessage, lastType }) {
  // what to display as last message (may be too long or not text)
  let res = ''
  if (lastType === 'text') {
    const arr = lastMessage.split(' ')
    let count = arr[0].length
    let flag = false
    for (const elem of arr) {
      if (count >= 100) {
        flag = true
        break
      }
      res += `${elem} `
      count += elem.length
    }
    res = res.substr(0, res.length - 1)
    if (flag) {
      res += '...' // last message too long to fully be displayed
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
      userId: Number(this.props.match.params.userId),
      chats: [],
    }
  }

  componentDidMount() {
    this.getChats()
  }

  getChats() {
    fetch(`${baseServer}/chats/chat_list/?id=${this.state.userId}`)
      .then((res) => res.json())
      .then(({ chats }) => {
        chats.sort(this.compareNumber)
        this.setState({ chats })
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
    let chatsToDisplay = []
    let i = 0
    for (const chat of this.state.chats) {
      chat.key = i
      i += 1
      chat.lastMessage = getDisplayOfLastMessage(chat)
      chat.userId = this.state.userId
      const currChat = SingleChat(chat)
      chatsToDisplay = [...chatsToDisplay, currChat]
    }

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
        <div className={chatListStyles.chats}>{chatsToDisplay}</div>
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
