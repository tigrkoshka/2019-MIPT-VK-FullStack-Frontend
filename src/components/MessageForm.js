import React from 'react'
import PropTypes from 'prop-types'
import headerStyles from '../styles/messageFormHeaderStyles.module.scss'
import messageStyles from '../styles/singleMessageStyles.module.scss'
import formStyles from '../styles/messageFormStyles.module.scss'

function Header(props) {
  return (
    <div className={headerStyles.rectangle}>
      <div className={headerStyles.button}>
        <div className={headerStyles.vertical}>
          <img src="../images/toChats.png" height="30px" alt="" />
        </div>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.text}>Chats</div>
        </div>
      </div>
      <div className={headerStyles.horizontal}>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.name}>{props.name}</div>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
}

function singleMessage({ content, time, type, key }) {
  return (
    <div className={messageStyles.mine} key={key}>
      <div className={messageStyles.content}>{content}</div>
      <div className={messageStyles.time}>{time}</div>
    </div>
  )
}

singleMessage.propTypes = {
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

class MessageForm extends React.Component {
  constructor(props) {
    localStorage.clear()
    super(props)
    this.state = {
      value: '',
      name: props.name,
      messages: [],
    }
    const allMessages = JSON.parse(localStorage.getItem(this.state.name)) || []
    for (let i = 0; i < allMessages.length; i += 1) {
      const currProps = {}
      currProps.content = allMessages[i].content
      currProps.time = allMessages[i].time
      currProps.type = allMessages[i].type
      currProps.key = i
      const currMessage = singleMessage(currProps)
      this.state.messages.push(currMessage)
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    const currProps = {}
    currProps.content = this.state.value
    currProps.time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    currProps.type = 'mine'

    const allMessages = JSON.parse(localStorage.getItem(this.state.name)) || []
    currProps.key = allMessages.length
    allMessages.unshift(currProps)
    localStorage.removeItem(this.state.name)
    localStorage.setItem(this.state.name, JSON.stringify(allMessages))

    const currMessage = singleMessage(currProps)

    const currStateMess = this.state.messages
    currStateMess.unshift(currMessage)

    this.setState((state) => {
      return { messages: currStateMess, value: '' }
    })
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  render() {
    return (
      <form className={formStyles.form} onSubmit={this.handleSubmit}>
        <Header name={this.state.name} className={formStyles.header} />
        <div className={formStyles.the_chat}>{this.state.messages}</div>
        <input
          type="text"
          value={this.state.value}
          placeholder="Введите сообщение"
          className={formStyles.input}
          onChange={this.handleChange}
        />
        <div className={formStyles.empty} />
      </form>
    )
  }
}

MessageForm.propTypes = {
  name: PropTypes.string.isRequired,
}

export default MessageForm
