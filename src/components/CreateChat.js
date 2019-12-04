import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import toChats from '../images/back.png'
import profileStyles from '../styles/profileAndCreateStyles.module.scss'
import profilePic from '../images/profilePic.jpeg'

class CreateChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chatName: '',
      chatTag: '',
      chatBio: '',
      chatMembers: '',
      userId: Number(this.props.match.params.userId),
      isTagForm: 0,
      isNameForm: 0,
      isInfoForm: 0,
      isMembersForm: 0,
    }

    this.onFillInfo = this.onFillInfo.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.openTagForm = this.openTagForm.bind(this)
    this.openNameForm = this.openNameForm.bind(this)
    this.openMemberForm = this.openMemberForm.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeTag = this.handleChangeTag.bind(this)
    this.handleChangeBio = this.handleChangeBio.bind(this)
    this.handleChangeMembers = this.handleChangeMembers.bind(this)
  }

  onFillInfo(event) {
    event.preventDefault()

    if (this.state.chatName === '') {
      this.setState({ isNameForm: 1 })
      return
    }

    if (this.state.chatTag === '') {
      this.setState({ isTagForm: 2 })
      return
    }

    this.setState({ isInfoForm: 1 })
  }

  onCreate(event, isChannel) {
    event.preventDefault()

    if (this.state.chatMembers === '') {
      this.setState({ isMembersForm: 2 })
      return
    }

    const toSend = {
      name: this.state.chatName,
      tag: this.state.chatTag,
      bio: this.state.chatBio,
      creator: this.state.userId,
      members: this.state.chatMembers,
      is_channel: isChannel,
    }

    fetch('http://127.0.0.1:8000/chats/create_chat/', {
      method: 'POST',
      body: JSON.stringify(toSend),
    }).then((res) => {
      if (res.ok) {
        let realTag = this.state.chatTag.replace(' ', '')
        if (realTag[0] !== '@') {
          realTag = `@${realTag}`
        }

        window.location.hash = `#/MessageForm/${realTag}/${this.state.chatName}/${this.state.userId}`
      } else {
        this.setState({ isTagForm: 1 })
      }
    })
  }

  openTagForm(event) {
    event.preventDefault()
    this.setState({ chatTag: '', isTagForm: 0 })
  }

  openNameForm(event) {
    event.preventDefault()
    this.setState({ isNameForm: 0 })
  }

  openMemberForm(event) {
    event.preventDefault()
    this.setState({ isMembersForm: 0 })
  }

  handleChangeName(event) {
    event.preventDefault()
    this.setState({ chatName: event.target.value })
  }

  handleChangeTag(event) {
    event.preventDefault()
    this.setState({ chatTag: event.target.value })
  }

  handleChangeBio(event) {
    event.preventDefault()
    this.setState({ chatBio: event.target.value })
  }

  handleChangeMembers(event) {
    event.preventDefault()
    this.setState({ chatMembers: event.target.value })
  }

  render() {
    const containerStyles = `${profileStyles.container} ${profileStyles.createChatAnim}`
    const nameInputClasses = `${profileStyles.input} ${profileStyles.inputName}`
    const tagInputClasses = `${profileStyles.input} ${profileStyles.inputTag}`
    const bioInputClasses = `${profileStyles.input} ${profileStyles.inputBio}`
    const textClasses = `${profileStyles.horizontal} ${profileStyles.interactiveText}`

    let tagForm

    if (this.state.isTagForm === 0) {
      tagForm = (
        <input
          type="text"
          value={this.state.chatTag}
          placeholder="Chat tag"
          className={tagInputClasses}
          onChange={this.handleChangeTag}
        />
      )
    } else if (this.state.isTagForm === 1) {
      tagForm = (
        <div className={textClasses} style={{ margin: '30px 0', flexGrow: 0 }} onClick={this.openTagForm}>
          This tag already exists. Tap to choose another tag.
        </div>
      )
    } else {
      tagForm = (
        <div className={textClasses} style={{ margin: '30px 0', flexGrow: 0 }} onClick={this.openTagForm}>
          Your chat must have a tag. Tap to choose one.
        </div>
      )
    }

    let nameForm

    if (this.state.isNameForm === 0) {
      nameForm = (
        <input
          type="text"
          value={this.state.chatName}
          placeholder="Chat name"
          className={nameInputClasses}
          onChange={this.handleChangeName}
        />
      )
    } else {
      nameForm = (
        <div className={textClasses} style={{ marginBottom: '40px', flexGrow: 0 }} onClick={this.openNameForm}>
          Your chat must have a name. Tap to choose one.
        </div>
      )
    }

    let membersForm

    if (this.state.isMembersForm === 0) {
      membersForm = (
        <input
          type="text"
          value={this.state.chatMembers}
          placeholder="Enter chat members"
          className={profileStyles.input}
          onChange={this.handleChangeMembers}
        />
      )
    } else if (this.state.isMembersForm === 1) {
      membersForm = (
        <div className={textClasses} style={{ marginBottom: '30px', flexGrow: 0 }} onClick={this.openTagForm}>
          {"Some users don't exist. Tap to try again."}
        </div>
      )
    } else {
      membersForm = (
        <div className={textClasses} style={{ marginBottom: '30px', flexGrow: 0 }} onClick={this.openMemberForm}>
          Your chat must have members. Tap to choose.
        </div>
      )
    }

    let mainPart

    if (this.state.isInfoForm === 0) {
      mainPart = (
        <div className={profileStyles.vertical}>
          <div className={profileStyles.horizontalPhoto}>
            <div className={profileStyles.photo}>
              <img src={profilePic} alt="" className="pic" height="130px" width="height" />
            </div>
          </div>
          {nameForm}
          {tagForm}
          <textarea
            value={this.state.chatBio}
            placeholder="Tell something about your chat"
            className={bioInputClasses}
            onChange={this.handleChangeBio}
          />
          <div className={profileStyles.horizontal} style={{ flexGrow: 0 }}>
            <div className={textClasses} onClick={this.onFillInfo}>
              Proceed to adding members
            </div>
          </div>
        </div>
      )
    } else {
      mainPart = (
        <div className={profileStyles.vertical} style={{ alignSelf: 'center' }}>
          {membersForm}
          <div className={profileStyles.horizontal} style={{ flexGrow: 0, marginTop: '15px' }}>
            <div className={textClasses} onClick={(event) => this.onCreate(event, false)}>
              Create a chat
            </div>
            <div className={profileStyles.empty} />
            <div className={textClasses} onClick={(event) => this.onCreate(event, true)}>
              Create a channel
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={containerStyles}>
        <Header
          leftImg={toChats}
          leftLink={`/ChatList/${this.state.userId}`}
          rightImg=""
          rightText=""
          name="Create a chat"
          onRightClick={() => {}}
        />
        <div className={profileStyles.horizontal}>{mainPart}</div>
      </div>
    )
  }
}

CreateChat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
}

export default CreateChat
