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

function singleTextMessage({ content, time, whose, key }) {
  return (
    <div className={messageStyles.mine} style={{ maxWidth: '75%' }} key={key}>
      <div className={messageStyles.content}>{content}</div>
      <div className={messageStyles.time}>{time}</div>
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
    <div className={messageStyles.mine} style={{ background: 'rgb(40, 40, 40)' }} key={key}>
      <img src={url} className={messageStyles.image} alt="blob was deleted" />
      <div className={messageStyles.time}>{time}</div>
    </div>
  )
}

singleImageMessage.propTypes = {
  url: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  whose: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
}

function singleAudioMessage({ url, time, whose, key }) {
  return (
    <div className={messageStyles.mine} style={{ width: '30%', background: 'rgb(40, 40, 40)' }} key={key}>
      <audio src={url} style={{ width: '100%' }} controls />
      <div className={messageStyles.time}>{time}</div>
    </div>
  )
}

singleAudioMessage.propTypes = {
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
      chatStyle: {},
      messages: [],
      chunks: [],
      audioIcon: voice,
      audioClick: null,
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
      } else if (allMessages[i].type === 'audio') {
        currProps.url = allMessages[i].url
        currMessage = singleAudioMessage(currProps)
      }
      this.state.messages.push(currMessage)
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

  // _____________geoposition_______________

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

  // _______________texts____________________

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

  handleImageSubmit(files) {
    if (files && files.length) {
      for (let i = 0; i < files.length; i += 1) {
        const src = window.URL.createObjectURL(files[i])
        const fileName = files[i].name

        const data = new FormData()
        data.append('image', files[i])
        fetch('https://tt-front.now.sh', {
          method: 'POST',
          body: data,
        }).then(() => {})

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

  sendAudioMessage(url, name) {
    const currProps = {}
    currProps.url = url
    currProps.time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    currProps.whose = 'mine'
    currProps.type = 'audio'
    currProps.name = name

    const allMessages = JSON.parse(localStorage.getItem(this.state.name)) || []
    currProps.key = allMessages.length
    allMessages.unshift(currProps)
    localStorage.removeItem(this.state.name)
    localStorage.setItem(this.state.name, JSON.stringify(allMessages))

    const currMessage = singleAudioMessage(currProps)

    const currStateMess = this.state.messages
    currStateMess.unshift(currMessage)

    this.setState((state) => {
      return { messages: currStateMess, value: '' }
    })
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
    this.setState({ audioIcon: voice, audioClick: this.handleStartRecording })

    const blob = new Blob(this.state.chunks, { type: 'audio/ogg; codecs=opus' })
    this.setState({ chunks: [] })

    const data = new FormData()
    data.append('audio', blob)
    fetch('https://tt-front.now.sh', {
      method: 'POST',
      body: data,
    }).then(() => {})

    const audioURL = URL.createObjectURL(blob)
    localStorage.setItem('audio', JSON.stringify(audioURL))

    this.sendAudioMessage(audioURL)
    this.messages.current.onload = () => {
      window.URL.revokeObjectURL(audioURL)
    }
  }

  async handleStartRecording(event) {
    event.preventDefault()
    this.setState({ audioIcon: stop, audioClick: this.handleEndRecording })

    const stream = await getMedia()
    this.mediaRecorder = new MediaRecorder(stream)
    this.setState({ chunks: [] })
    this.mediaRecorder.ondataavailable = this.dataAvailable
    this.mediaRecorder.onstop = this.stopRecording

    this.mediaRecorder.start()
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
            src={this.state.audioIcon}
            alt="voice message"
            style={{ maxWidth: '29px' }}
            className={formStyles.img}
            onClick={this.state.audioClick || this.handleStartRecording}
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
