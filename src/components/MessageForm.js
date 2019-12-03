import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import toChats from '../images/toChats.png'
import attach from '../images/attachment.png'
import geo from '../images/geolocation.png'
import voice from '../images/voice.png'
import stop from '../images/stopRecording.png'
import messageStyles from '../styles/singleMessageStyles.module.scss'
import formStyles from '../styles/messageFormStyles.module.scss'

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
      chatStyle: {},
      messages: [],
      chunks: [],
      audioFlag: false,
    }

    this.handleTextSubmit = this.handleTextSubmit.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleImageSubmit = this.handleImageSubmit.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.sendTextMessage = this.sendTextMessage.bind(this)
    this.sendImageMessage = this.sendImageMessage.bind(this)
    this.sendAudioMessage = this.sendAudioMessage.bind(this)
    this.sendGeo = this.sendGeo.bind(this)
    this.handleDragEnter = this.handleDragEnter.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleStartRecording = this.handleStartRecording.bind(this)
    this.handleEndRecording = this.handleEndRecording.bind(this)
    this.dataAvailable = this.dataAvailable.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.fileManager = React.createRef()
    this.messages = React.createRef()
    this.manageFiles = () => this.fileManager.current.click()

    this.mediaRecorder = null
  }

  componentDidMount() {
    this.getMessages(this.state.tag)
    setInterval(() => this.getMessages(this.state.tag), 100)
  }

  // ______________messages_________________

  getMessages(tag) {
    fetch(`http://127.0.0.1:8000/chats/chat/?tag=${tag}`)
      .then((res) => res.json())
      .then((data) => {
        const { messages } = data
        const count = messages.length - this.state.messages.length - 1
        for (let i = count; i >= 0; i -= 1) {
          const currProps = {}
          currProps.time = messages[i].time
          currProps.whose = messages[i].whose
          currProps.userId = this.state.userId
          currProps.key = i
          let currMessage = null
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
    fetch('http://127.0.0.1:8000/chats/send_message/', {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'text', content }),
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
    fetch('http://127.0.0.1:8000/chats/send_message/', {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'image', url }),
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
    fetch('http://127.0.0.1:8000/chats/send_message/', {
      method: 'POST',
      body: JSON.stringify({ chat_tag: this.state.tag, user_id: this.state.userId, type: 'audio', url }),
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
    return (
      <form className={formStyles.form} onSubmit={this.handleTextSubmit}>
        <Header
          leftImg={toChats}
          rightImg=""
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
