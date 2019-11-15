import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import toChats from '../images/toChats.png'
import messageStyles from '../styles/singleMessageStyles.module.scss'
import formStyles from '../styles/messageFormStyles.module.scss'

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
    super(props)
    this.state = {
      value: '',
      name: this.props.match.params.name,
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
        <Header leftImg={toChats} rightImg="" leftLink="/ChatList" name={this.state.name} onRightClick={() => {}} />
        <div className={formStyles.the_chat}>{this.state.messages}</div>
        <input
          type="text"
          value={this.state.value}
          placeholder="Your message"
          className={formStyles.input}
          onChange={this.handleChange}
        />
        <div className={formStyles.empty} />
      </form>
    )
  }
}

MessageForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
}

export default MessageForm
