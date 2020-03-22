import React from 'react'
import autoBind from 'react-autobind'
import Cookies from 'js-cookie'
import Header from './Header'
import { baseServer } from '../settings'
import profileStyles from '../styles/profileAndCreateStyles.module.scss'
import imagesStyles from '../styles/imagesStyles.module.scss'

class CreateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userTag: '',
      userBio: '',
      firstPassword: '',
      secondPassword: '',
      isPasswordForm: 0,
      isTagForm: 0,
      isTick: false,
    }

    autoBind(this)
  }

  onTickClick(event) {
    event.preventDefault()

    if (this.state.firstPassword !== this.state.secondPassword) {
      this.setState({ isPasswordForm: 1 })
      return
    }

    const toSend = {
      name: this.state.userName,
      tag: this.state.userTag,
      bio: this.state.userBio,
      password: this.state.firstPassword,
    }

    fetch(`${baseServer}/users/create_user/`, {
      method: 'POST',
      body: JSON.stringify(toSend),
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then(({ id }) => {
          window.location.hash = `#/ChatList/${id[0].id}`
        })
      } else {
        this.setState({ isTagForm: 1 })
      }
    })
  }

  setTick(string) {
    if (string === '') {
      this.setState({ isTick: false })
    } else {
      this.setState((state) => {
        const f = state.userTag !== '' && state.firstPassword !== '' && state.secondPassword !== ''
        return { isTick: f }
      })
    }
  }

  getPasswordForm() {
    const textClasses = `${profileStyles.horizontal} ${profileStyles.interactiveText}`

    if (this.state.isPasswordForm === 0) {
      return (
        <div className={profileStyles.horizontal} style={{ flexGrow: 0 }}>
          <input
            type="text"
            value={this.state.firstPassword}
            placeholder="Enter password"
            className={`${profileStyles.input} ${profileStyles.inputPassword}`}
            onChange={this.handleChangeFirstPassword.bind(this)}
          />
          <div className={profileStyles.empty} />
          <input
            type="text"
            value={this.state.secondPassword}
            placeholder="Repeat password"
            className={`${profileStyles.input} ${profileStyles.inputPassword}`}
            onChange={this.handleChangeSecondPassword.bind(this)}
          />
        </div>
      )
    }
    return (
      <div className={textClasses} onClick={this.openPasswordForm}>
        Passwords don&apos;t match. Tap to try again.
      </div>
    )
  }

  getTagForm() {
    const tagInputClasses = `${profileStyles.input} ${profileStyles.inputTag}`
    const textClasses = `${profileStyles.horizontal} ${profileStyles.interactiveText}`

    if (this.state.isTagForm === 0) {
      return (
        <input
          type="text"
          value={this.state.userTag}
          placeholder="Your tag"
          className={tagInputClasses}
          onChange={this.handleChangeTag}
        />
      )
    }
    return (
      <div className={textClasses} style={{ margin: '30px 0', flexGrow: 0 }} onClick={this.openTagForm}>
        This tag already exists. Tap to choose another tag.
      </div>
    )
  }

  openPasswordForm(event) {
    event.preventDefault()
    this.setState({ firstPassword: '', secondPassword: '', isPasswordForm: 0, isTick: false })
  }

  openTagForm(event) {
    event.preventDefault()
    this.setState({ userTag: '', isTagForm: 0, isTick: false })
  }

  handleChangeName(event) {
    event.preventDefault()
    this.setState({ userName: event.target.value })
    this.setTick(event.target.value)
  }

  handleChangeTag(event) {
    event.preventDefault()
    this.setState({ userTag: event.target.value })
    this.setTick(event.target.value)
  }

  handleChangeBio(event) {
    event.preventDefault()
    this.setState({ userBio: event.target.value })
  }

  handleChangeFirstPassword(event) {
    event.preventDefault()
    this.setState({ firstPassword: event.target.value })
    this.setTick(event.target.value)
  }

  handleChangeSecondPassword(event) {
    event.preventDefault()
    this.setState({ secondPassword: event.target.value })
    this.setTick(event.target.value)
  }

  render() {
    const containerStyles = `${profileStyles.container} ${profileStyles.createUserAnim}`
    const nameInputClasses = `${profileStyles.input} ${profileStyles.inputName}`
    const bioInputClasses = `${profileStyles.input} ${profileStyles.inputBio}`

    return (
      <div className={containerStyles}>
        <Header
          leftImg="back"
          rightImg={this.state.isTick ? 'tick' : ''}
          rightText=""
          leftLink="/"
          name="Create an account"
          onRightClick={this.state.isTick ? this.onTickClick : () => {}}
        />
        <div className={profileStyles.horizontal}>
          <div className={profileStyles.vertical}>
            <div className={profileStyles.horizontalPhoto}>
              <div className={profileStyles.photo}>
                <div className={`${imagesStyles.profilePic} ${imagesStyles.profilePicSizeChatList} pic`} />
              </div>
            </div>
            <input
              type="text"
              value={this.state.userName}
              placeholder="Your name"
              className={nameInputClasses}
              onChange={this.handleChangeName}
            />
            {this.getTagForm()}
            <textarea
              value={this.state.userBio}
              placeholder="Tell something about yourself"
              className={bioInputClasses}
              onChange={this.handleChangeBio}
            />
            {this.getPasswordForm()}
          </div>
        </div>
      </div>
    )
  }
}

export default CreateUser
