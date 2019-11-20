import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import toChats from '../images/toChats.png'
import attach from '../images/attachment.png'
import geo from '../images/geolocation.png'
import voice from '../images/voice.png'
import textMessageStyles from '../styles/singleTextMessageStyles.module.scss'
import imageMessageStyles from '../styles/singleImageMessageStyles.module.scss'
import formStyles from '../styles/messageFormStyles.module.scss'

function singleTextMessage({ content, time, whose, key }) {
  return (
    <div className={textMessageStyles.mine} key={key}>
      <div className={textMessageStyles.content}>{content}</div>
      <div className={textMessageStyles.time}>{time}</div>
    </div>
  )
}

singleTextMessage.propTypes = {
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  whose: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

function singleImageMessage({ url, time, whose, key }) {
  return (
    <div className={imageMessageStyles.mine} key={key}>
      <img src={url} className={imageMessageStyles.image} alt="blob was deleted" />
      <div className={textMessageStyles.time}>{time}</div>
    </div>
  )
}

singleImageMessage.propTypes = {
  url: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  whose: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

class MessageForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      name: this.props.match.params.name,
      chatStyle: {},
      messages: [],
    }
    const allMessages = JSON.parse(localStorage.getItem(this.state.name)) || []
    for (let i = 0; i < allMessages.length; i += 1) {
      const currProps = {}
      currProps.time = allMessages[i].time
      currProps.whose = allMessages[i].whose
      currProps.key = i
      let currMessage = null
      if (allMessages[i].type === 'text') {
        currProps.content = allMessages[i].content
        currMessage = singleTextMessage(currProps)
      } else if (allMessages[i].type === 'image') {
        currProps.url = allMessages[i].url
        currMessage = singleImageMessage(currProps)
      }
      this.state.messages.push(currMessage)
    }

    this.handleTextSubmit = this.handleTextSubmit.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleImageSubmit = this.handleImageSubmit.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.sendTextMessage = this.sendTextMessage.bind(this)
    this.sendImageMessage = this.sendImageMessage.bind(this)
    this.sendGeo = this.sendGeo.bind(this)
    this.handleDragEnter = this.handleDragEnter.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.fileManager = React.createRef()
    this.messages = React.createRef()
    this.manageFiles = () => this.fileManager.current.click()
  }

  sendImageMessage(url, name) {
    const currProps = {}
    currProps.url = url
    currProps.time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    currProps.whose = 'mine'
    currProps.type = 'image'
    currProps.name = name

    const allMessages = JSON.parse(localStorage.getItem(this.state.name)) || []
    currProps.key = allMessages.length
    allMessages.unshift(currProps)
    localStorage.removeItem(this.state.name)
    localStorage.setItem(this.state.name, JSON.stringify(allMessages))

    const currMessage = singleImageMessage(currProps)

    const currStateMess = this.state.messages
    currStateMess.unshift(currMessage)

    this.setState((state) => {
      return { messages: currStateMess, value: '' }
    })
  }

  sendTextMessage(content) {
    const currProps = {}
    currProps.content = content
    currProps.time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    currProps.whose = 'mine'
    currProps.type = 'text'

    const allMessages = JSON.parse(localStorage.getItem(this.state.name)) || []
    currProps.key = allMessages.length
    allMessages.unshift(currProps)
    localStorage.removeItem(this.state.name)
    localStorage.setItem(this.state.name, JSON.stringify(allMessages))

    const currMessage = singleTextMessage(currProps)

    const currStateMess = this.state.messages
    currStateMess.unshift(currMessage)

    this.setState((state) => {
      return { messages: currStateMess }
    })
  }

  sendGeo(event) {
    event.preventDefault()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude } = position.coords
        const { longitude } = position.coords
        const toSend = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
        this.sendTextMessage(toSend)
      })
    }
  }

  handleImageSubmit(files) {
    if (files && files.length) {
      for (let i = 0; i < files.length; i += 1) {
        const src = window.URL.createObjectURL(files[i])
        const fileName = files[i].name
        const data = new FormData()
        data.append('image', files[i])
        this.sendImageMessage(src, fileName)
        this.messages.current.onload = () => {
          window.URL.revokeObjectURL(src)
        }
      }
    }
  }

  handleImageChange(event) {
    event.preventDefault()
    const upload = this.fileManager.current.files
    this.handleImageSubmit(upload)
  }

  handleTextSubmit(event) {
    event.preventDefault()
    this.sendTextMessage(this.state.value)
    this.setState({ value: '' })
  }

  handleTextChange(event) {
    event.preventDefault()
    this.setState({ value: event.target.value })
  }

  handleDragEnter(event) {
    event.preventDefault()
    this.setState({
      chatStyle: {
        border: '2px dashed rgb(255, 255, 255)',
      },
    })
  }

  handleDragLeave(event) {
    event.preventDefault()
    this.setState({ chatStyle: {} })
  }

  handleDragOver(event) {
    event.preventDefault()
  }

  handleDrop(event) {
    event.preventDefault()
    const upload = event.dataTransfer.files
    this.handleImageSubmit(upload)
    this.setState({ chatStyle: {} })
  }

  render() {
    return (
      <form className={formStyles.form} onSubmit={this.handleTextSubmit}>
        <Header leftImg={toChats} rightImg="" leftLink="/ChatList" name={this.state.name} onRightClick={() => {}} />
        <div
          className={formStyles.the_chat}
          style={this.state.chatStyle}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
          ref={this.messages}
        >
          {this.state.messages}
        </div>
        <div className={formStyles.horizontal}>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            ref={this.fileManager}
            onChange={this.handleImageChange}
          />
          <img
            src={attach}
            height="80%"
            width="height"
            alt="attachment"
            className={formStyles.img}
            onClick={this.manageFiles}
          />
          <img
            src={geo}
            height="80%"
            width="height"
            alt="geolocation"
            className={formStyles.img}
            onClick={this.sendGeo}
          />
          <input
            type="text"
            value={this.state.value}
            placeholder="Your message"
            className={formStyles.input}
            onChange={this.handleTextChange}
          />
          <img src={voice} height="80%" width="height" alt="voice message" className={formStyles.img} />
        </div>
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
