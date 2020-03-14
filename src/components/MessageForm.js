import React from 'react'
import PropTypes from 'prop-types'
import autoBind from 'react-autobind'
import Header from './Header'
import { baseServer } from '../settings'
import toChats from '../images/back.png'
import attach from '../images/attachment.png'
import geo from '../images/geolocation.png'
import voice from '../images/voice.png'
import stop from '../images/stopRecording.png'
import messageStyles from '../styles/singleMessageStyles.module.scss'
import formStyles from '../styles/messageFormStyles.module.scss'
import { getCookie } from '../static/getCookie'
import { checkAuth } from '../static/checkAuth'

function singleTextMessage({ userId, content, time, whose, key }) {
  return (
    <div className={whose === userId ? messageStyles.mine : messageStyles.yours} style={{ maxWidth: '75%' }} key={key}>
      <div className={messageStyles.content}>{content}</div>
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

    this.mediaRecorder = null
  }

  componentDidMount() {
    checkAuth(this.state.userId).then((auth) => {
      if (!auth) {
        window.location.hash = '#/'
      } else {
        this.getMessages(this.state.tag)
        setInterval(() => this.getMessages(this.state.tag), 100)
      }
    })
  }

  // ______________messages_________________

  getMessages(tag) {
    fetch(`${baseServer}/chats/chat/?tag=${tag}`)
      .then((res) => res.json())
      .then((data) => {
        const { messages } = data
        const count = messages.length - this.state.messages.length - 1
        for (let i = count; i >= 0; i -= 1) {
          const currProps = {}
          currProps.time = messages[i].time
          currProps.whose = messages[i].whose
          currProps.userId = this.state.userId
          currProps.key = messages.length - i
          let currMessage
          if (messages[i].type === 'text') {
            currProps.content = messages[i].content
            currMessage = singleTextMessage(currProps)
          } else {
            currProps.url = messages[i].url
            if (messages[i].type === 'image') {
              currMessage = singleImageMessage(currProps)
            } else {
              currMessage = singleAudioMessage(currProps)
            }
          }
          this.setState((state) => {
            return { messages: [currMessage, ...state.messages] }
          })
        }
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
    const csrftoken = getCookie('csrftoken')

    fetch(`${baseServer}/chats/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'text', content }),
      headers: {
        'X-CSRFToken': csrftoken,
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
    const csrftoken = getCookie('csrftoken')

    fetch(`${baseServer}/chats/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'image', url }),
      headers: {
        'X-CSRFToken': csrftoken,
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
    const csrftoken = getCookie('csrftoken')

    fetch(`${baseServer}/chats/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'audio', url }),
      headers: {
        'X-CSRFToken': csrftoken,
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

  render() {
    let formInput = null

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
          <img src={attach} alt="attachment" className={formStyles.img} onClick={this.manageFiles} />
          <img src={geo} alt="geolocation" className={formStyles.img} onClick={this.sendGeo} />
          <input
            type="text"
            value={this.state.value}
            placeholder="Your message"
            className={formStyles.input}
            onChange={this.handleTextChange}
          />
          <img
            src={this.state.audioFlag ? stop : voice}
            alt="voice message"
            style={{ maxWidth: '29px' }}
            className={formStyles.img}
            onClick={this.state.audioFlag ? this.handleEndRecording : this.handleStartRecording}
          />
        </div>
      )
    }

    return (
      <form className={formStyles.form} onSubmit={this.handleTextSubmit}>
        <Header
          leftImg={toChats}
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
