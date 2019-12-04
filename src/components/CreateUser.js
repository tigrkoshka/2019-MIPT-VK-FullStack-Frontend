import React from 'react'
import Header from './Header'
import toWelcome from '../images/back.png'
import tick from '../images/tick.png'
import profileStyles from '../styles/profileAndCreateStyles.module.scss'
import profilePic from '../images/profilePic.jpeg'

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

    this.onTickClick = this.onTickClick.bind(this)
    this.openPasswordForm = this.openPasswordForm.bind(this)
    this.openTagForm = this.openTagForm.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeTag = this.handleChangeTag.bind(this)
    this.handleChangeFirstPassword = this.handleChangeFirstPassword.bind(this)
    this.handleChangeSecondPassword = this.handleChangeSecondPassword.bind(this)
    this.handleChangeBio = this.handleChangeBio.bind(this)
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

    fetch('http://127.0.0.1:8000/users/create_user/', {
      method: 'POST',
      body: JSON.stringify(toSend),
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
    if (event.target.value === '') {
      this.setState({ isTick: false })
    } else {
      this.setState((state) => {
        const f = state.userTag !== '' && state.firstPassword !== '' && state.secondPassword !== ''
        return { isTick: f }
      })
    }
  }

  handleChangeTag(event) {
    event.preventDefault()
    this.setState({ userTag: event.target.value })
    if (event.target.value === '') {
      this.setState({ isTick: false })
    } else {
      this.setState((state) => {
        const f = state.userName !== '' && state.firstPassword !== '' && state.secondPassword !== ''
        return { isTick: f }
      })
    }
  }

  handleChangeBio(event) {
    event.preventDefault()
    this.setState({ userBio: event.target.value })
  }

  handleChangeFirstPassword(event) {
    event.preventDefault()
    this.setState({ firstPassword: event.target.value })
    if (event.target.value === '') {
      this.setState({ isTick: false })
    } else {
      this.setState((state) => {
        const f = state.userName !== '' && state.userTag !== '' && state.secondPassword !== ''
        return { isTick: f }
      })
    }
  }

  handleChangeSecondPassword(event) {
    event.preventDefault()
    this.setState({ secondPassword: event.target.value })
    if (event.target.value === '') {
      this.setState({ isTick: false })
    } else {
      this.setState((state) => {
        const f = state.userName !== '' && state.userTag !== '' && state.firstPassword !== ''
        return { isTick: f }
      })
    }
  }

  render() {
    const containerStyles = `${profileStyles.container} ${profileStyles.createUserAnim}`
    const nameInputClasses = `${profileStyles.input} ${profileStyles.inputName}`
    const tagInputClasses = `${profileStyles.input} ${profileStyles.inputTag}`
    const bioInputClasses = `${profileStyles.input} ${profileStyles.inputBio}`
    const textClasses = `${profileStyles.horizontal} ${profileStyles.interactiveText}`

    let passwordForm

    if (this.state.isPasswordForm === 0) {
      passwordForm = (
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
    } else {
      passwordForm = (
        <div className={textClasses} onClick={this.openPasswordForm}>
          Passwords don&apos;t match. Tap to try again.
        </div>
      )
    }

    let tagForm

    if (this.state.isTagForm === 0) {
      tagForm = (
        <input
          type="text"
          value={this.state.userTag}
          placeholder="Your tag"
          className={tagInputClasses}
          onChange={this.handleChangeTag}
        />
      )
    } else {
      tagForm = (
        <div className={textClasses} style={{ margin: '30px 0', flexGrow: 0 }} onClick={this.openTagForm}>
          This tag already exists. Tap to choose another tag.
        </div>
      )
    }

    return (
      <div className={containerStyles}>
        <Header
          leftImg={toWelcome}
          rightImg={this.state.isTick ? tick : ''}
          rightText=""
          leftLink="/"
          name="Create an account"
          onRightClick={this.state.isTick ? this.onTickClick : () => {}}
        />
        <div className={profileStyles.horizontal}>
          <div className={profileStyles.vertical}>
            <div className={profileStyles.horizontalPhoto}>
              <div className={profileStyles.photo}>
                <img src={profilePic} alt="" className="pic" height="130px" width="height" />
              </div>
            </div>
            <input
              type="text"
              value={this.state.userName}
              placeholder="Your name"
              className={nameInputClasses}
              onChange={this.handleChangeName}
            />
            {tagForm}
            <textarea
              value={this.state.userBio}
              placeholder="Tell something about yourself"
              className={bioInputClasses}
              onChange={this.handleChangeBio}
            />
            {passwordForm}
          </div>
        </div>
      </div>
    )
  }
}

export default CreateUser
