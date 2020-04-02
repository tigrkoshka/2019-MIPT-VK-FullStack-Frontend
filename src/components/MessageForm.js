import React from 'react'
import PropTypes from 'prop-types'
import autoBind from 'react-autobind'
import Cookies from 'js-cookie'
import Centrifuge from 'centrifuge'
import Header from './Header'
import { baseServer, baseCentrifuge, emojiList } from '../settings'
import messageStyles from '../styles/singleMessageStyles.module.scss'
import formStyles from '../styles/messageFormStyles.module.scss'
import emojiStyles from '../styles/emojiStyles.module.scss'
import imagesStyles from '../styles/imagesStyles.module.scss'
import checkAuth from '../static/checkAuth'
import parseForEmoji from '../static/parseEmoji'

function singleTextMessage({ userId, content, time, whose, key }) {
  return (
    <div className={whose === userId ? messageStyles.mine : messageStyles.yours} style={{ maxWidth: '75%' }} key={key}>
      <div className={messageStyles.content}>{parseForEmoji(content, 0)}</div>
      <div className={messageStyles.time}>{time}</div>
    </div>
  )
}

singleTextMessage.propTypes = {
  userId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  whose: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

function singleImageMessage({ userId, url, time, whose, key }) {
  return (
    <div
      className={whose === userId ? messageStyles.mine : messageStyles.yours}
      style={{ background: 'rgb(40, 40, 40)' }}
      key={key}
    >
      <img src={url} className={messageStyles.image} alt="blob was deleted" />
      <div className={messageStyles.time}>{time}</div>
    </div>
  )
}

singleImageMessage.propTypes = {
  userId: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  whose: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

function singleAudioMessage({ userId, url, time, whose, key }) {
  return (
    <div
      className={whose === userId ? messageStyles.mine : messageStyles.yours}
      style={{ width: '30%', background: 'rgb(40, 40, 40)' }}
      key={key}
    >
      <audio src={url} style={{ width: '100%' }} controls />
      <div className={messageStyles.time}>{time}</div>
    </div>
  )
}

singleAudioMessage.propTypes = {
  userId: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  whose: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

async function getMedia() {
  let stream = null

  const constraints = { audio: true }
  stream = await navigator.mediaDevices.getUserMedia(constraints)

  return stream
}

class MessageForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      name: this.props.match.params.name,
      tag: this.props.match.params.tag,
      userId: Number(this.props.match.params.userId),
      notMyChannel: true,
      emojiOpen: false,
      chatStyle: {},
      messages: [],
      chunks: [],
      audioFlag: false,
    }

    fetch(`${baseServer}/chats/chat_detail/?tag=${this.state.tag}`)
      .then((res) => res.json())
      .then(({ chat }) => {
        if (!chat[0].channel || chat[0].whose === this.state.userId) {
          this.setState({ notMyChannel: false })
        }
      })

    autoBind(this)

    this.fileManager = React.createRef()
    this.messages = React.createRef()
    this.manageFiles = () => this.fileManager.current.click()

    this.emojiWindow = this.makeEmojiWindow()

    this.mediaRecorder = null
    this.centrifuge = null
  }

  componentDidMount() {
    checkAuth(this.state.userId).then((auth) => {
      if (!auth) {
        window.location.hash = '#/'
      } else {
        this.centrifuge = new Centrifuge(baseCentrifuge)
        this.centrifuge.subscribe(`chat:${this.state.tag}`, (resp) => {
          if (resp.data.status === 'ok') {
            this.addMessage(resp.data.message, this.state.messages.length + 1)
          }
        })
        this.centrifuge.connect()
        this.getMessages(this.state.tag)
      }
    })
  }

  componentWillUnmount() {
    this.centrifuge.disconnect()
  }

  // ______________messages_________________

  getMessages(tag) {
    fetch(`${baseServer}/chats/chat/?tag=${tag}`)
      .then((res) => res.json())
      .then((data) => {
        const { messages } = data
        const count = messages.length - this.state.messages.length - 1
        for (let i = count; i >= 0; i -= 1) {
          this.addMessage(messages[i], messages.length - i)
        }
      })
  }

  addMessage(message, key) {
    const currProps = {}
    currProps.time = message.time
    currProps.whose = message.whose
    currProps.userId = this.state.userId
    currProps.key = key
    let currMessage
    if (message.type === 'text') {
      currProps.content = message.content
      currMessage = singleTextMessage(currProps)
    } else {
      currProps.url = message.url
      if (message.type === 'image') {
        currMessage = singleImageMessage(currProps)
      } else {
        currMessage = singleAudioMessage(currProps)
      }
    }
    this.setState((state) => {
      return { messages: [currMessage, ...state.messages] }
    })
  }

  // _____________geolocation_______________

  sendGeo(event) {
    event.preventDefault()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const toSend = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
        this.sendTextMessage(toSend)
      })
    }
  }

  // _______________texts____________________

  sendTextMessage(content) {
    fetch(`${baseServer}/chats/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'text', content }),
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).then(() => {})
  }

  handleTextSubmit(event) {
    event.preventDefault()
    if (this.state.value !== '') {
      this.sendTextMessage(this.state.value)
      this.setState({ value: '' })
    }
  }

  handleTextChange(event) {
    event.preventDefault()
    this.setState({ value: event.target.value })
  }

  // _______________images__________________

  sendImageMessage(url) {
    fetch(`${baseServer}/chats/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'image', url }),
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).then(() => {})
  }

  handleImageSubmit(files) {
    if (files && files.length) {
      for (let i = 0; i < files.length; i += 1) {
        const src = window.URL.createObjectURL(files[i])
        const fileName = files[i].name

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

  // _______________audio____________________

  sendAudioMessage(url) {
    fetch(`${baseServer}/chats/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'audio', url }),
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).then(() => {})
  }

  dataAvailable(event) {
    event.preventDefault()
    const toAssign = this.state.chunks
    toAssign.push(event.data)
    this.setState((state) => {
      return { chunks: toAssign }
    })
  }

  stopRecording(event) {
    this.setState({ audioFlag: false })

    const blob = new Blob(this.state.chunks, { type: 'audio/ogg; codecs=opus' })
    this.setState({ chunks: [] })

    const audioURL = URL.createObjectURL(blob)

    this.sendAudioMessage(audioURL)
    this.messages.current.onload = () => {
      window.URL.revokeObjectURL(audioURL)
    }
  }

  async handleStartRecording(event) {
    event.preventDefault()

    try {
      const stream = await getMedia()
      this.mediaRecorder = new MediaRecorder(stream)
      this.setState({ chunks: [] })
      this.mediaRecorder.ondataavailable = this.dataAvailable
      this.mediaRecorder.onstop = this.stopRecording

      this.setState({ audioFlag: true })
      this.mediaRecorder.start()
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('Unable to record audio')
    }
  }

  handleEndRecording(event) {
    this.mediaRecorder.stop()
  }

  // _______________D&D______________________

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

  // ______________render____________________

  makeEmojiWindow() {
    const outerArray = []
    const n = Math.min(Math.sqrt(emojiList.length), 10)
    for (let i = 0; i < n; i += 1) {
      const innerArray = []
      for (let j = 0; j < n; j += 1) {
        innerArray.push(
          <div
            key={j}
            className={`${emojiStyles[emojiList[i * n + j]]} ${emojiStyles.in_menu}`}
            onClick={(event) => {
              event.stopPropagation()
              this.setState((state) => {
                return { value: state.value.concat(`:${emojiList[i * n + j]}:`) }
              })
              return false
            }}
          />,
        )
      }
      outerArray.push(
        <div key={i} className={emojiStyles.horizontal}>
          {innerArray}
        </div>,
      )
    }
    return <div className={emojiStyles.emoji_window}>{outerArray}</div>
  }

  render() {
    let formInput = null
    let emojiWindow = null

    if (this.state.emojiOpen) {
      emojiWindow = this.emojiWindow
    }

    if (!this.state.notMyChannel) {
      formInput = (
        <div className={formStyles.horizontal}>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            ref={this.fileManager}
            onChange={this.handleImageChange}
          />
          <div
            className={`${imagesStyles.attachment} ${formStyles.img}`}
            style={{ maxWidth: '40px' }}
            onClick={this.manageFiles}
          />
          <div
            className={`${imagesStyles.geolocation} ${formStyles.img}`}
            style={{ maxWidth: '29px' }}
            onClick={this.sendGeo}
          />
          <input
            type="text"
            value={this.state.value}
            placeholder="Your message"
            className={formStyles.input}
            onChange={this.handleTextChange}
          />
          <div
            className={`${imagesStyles.cowboy_hat_face} ${formStyles.img}`}
            onClick={(event) => {
              event.stopPropagation()
              this.setState((state) => {
                return { emojiOpen: !state.emojiOpen }
              })
              return false
            }}
          />
          <div
            className={
              this.state.audioFlag
                ? `${imagesStyles.stopRecording} ${formStyles.img}`
                : `${imagesStyles.voice} ${formStyles.img}`
            }
            style={{ maxWidth: '29px' }}
            onClick={this.state.audioFlag ? this.handleEndRecording : this.handleStartRecording}
          />
        </div>
      )
    }

    return (
      <form
        className={formStyles.form}
        onSubmit={this.handleTextSubmit}
        onClick={() => {
          this.setState({ emojiOpen: false })
        }}
      >
        <Header
          leftImg="back"
          rightImg=""
          rightText=""
          leftLink={`/ChatList/${this.state.userId}`}
          name={this.state.name}
          onRightClick={() => {}}
        />
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
        {emojiWindow}
        {formInput}
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
