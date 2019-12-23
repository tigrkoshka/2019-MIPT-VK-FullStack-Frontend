import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import { baseServer } from '../settings'
import toChats from '../images/back.png'
import tick from '../images/tick.png'
import profileStyles from '../styles/profileAndCreateStyles.module.scss'
import profilePic from '../images/profilePic.jpeg'

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialUserName: '',
      initialUserTag: '',
      initialUserBio: '',
      currentUserName: '',
      currentUserTag: '',
      currentUserBio: '',
      oldPassword: '',
      newPassword: '',
      changePassword: 0,
      userId: Number(this.props.match.params.userId),
      isTick: false,
    }

    fetch(`${baseServer}/users/profile/?id=${this.state.userId}`)
      .then((res) => res.json())
      .then((user) => {
        this.setState({
          initialUserName: user.name,
          initialUserTag: user.tag,
          initialUserBio: user.bio,
          currentUserName: user.name,
          currentUserTag: user.tag,
          currentUserBio: user.bio,
        })
      })

    this.onTickClick = this.onTickClick.bind(this)
    this.openPasswordForm = this.openPasswordForm.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeTag = this.handleChangeTag.bind(this)
    this.handleChangOldPassword = this.handleChangOldPassword.bind(this)
    this.handleChangNewPassword = this.handleChangNewPassword.bind(this)
    this.handleChangeBio = this.handleChangeBio.bind(this)
  }

  onTickClick(event) {
    event.preventDefault()

    const toSend = {
      name: this.state.currentUserName,
      tag: this.state.currentUserTag,
      bio: this.state.currentUserBio,
      old_tag: this.state.initialUserTag,
    }

    fetch(`${baseServer}/users/set_user/`, {
      method: 'POST',
      body: JSON.stringify(toSend),
    })
      .then((res) => res.ok)
      .then((accept) => {
        if (accept) {
          this.setState((state) => {
            return {
              initialUserName: state.currentUserName,
              initialUserTag: state.currentUserTag,
              initialUserBio: state.currentUserBio,
              isTick: false,
            }
          })
        } else {
          this.setState((state) => {
            return {
              currentUserName: state.initialUserName,
              currentUserTag: state.initialUserTag,
              currentUserBio: state.initialUserBio,
              isTick: false,
            }
          })
        }
        return this.state.initialUserTag
      })
      .then((tag) => {
        if (this.state.newPassword !== '') {
          const forPassChange = {
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
            tag,
          }
          fetch(`${baseServer}/users/change_password/`, {
            method: 'POST',
            body: JSON.stringify(forPassChange),
          }).then((result) => {
            this.setState({ newPassword: '', oldPassword: '', changePassword: result.ok ? 1 : 2 })
          })
        }
      })
  }

  openPasswordForm(event) {
    event.preventDefault()
    this.setState({ changePassword: 0 })
  }

  handleChangeName(event) {
    event.preventDefault()
    const temp = event.target.value
    this.setState((state) => {
      return { currentUserName: temp, isTick: state.initialUserName !== temp }
    })
  }

  handleChangeTag(event) {
    event.preventDefault()
    const temp = event.target.value
    this.setState((state) => {
      return { currentUserTag: temp, isTick: state.initialUserTag !== temp }
    })
  }

  handleChangOldPassword(event) {
    event.preventDefault()
    this.setState({ oldPassword: event.target.value })
  }

  handleChangNewPassword(event) {
    event.preventDefault()
    this.setState({ newPassword: event.target.value, isTick: true })
  }

  handleChangeBio(event) {
    event.preventDefault()
    const temp = event.target.value
    this.setState((state) => {
      return { currentUserBio: temp, isTick: state.initialUserBio !== temp }
    })
  }

  render() {
    const containerStyles = `${profileStyles.container} ${profileStyles.profileAnim}`
    const nameInputClasses = `${profileStyles.input} ${profileStyles.inputName}`
    const tagInputClasses = `${profileStyles.input} ${profileStyles.inputTag}`
    const bioInputClasses = `${profileStyles.input} ${profileStyles.inputBio}`
    const passwordTextClasses = `${profileStyles.horizontal} ${profileStyles.interactiveText}`

    let passwordForm

    if (this.state.changePassword === 0) {
      passwordForm = (
        <div className={profileStyles.horizontal} style={{ flexGrow: 0 }}>
          <input
            type="text"
            value={this.state.oldPassword}
            placeholder="Old password"
            className={`${profileStyles.input} ${profileStyles.inputPassword}`}
            onChange={this.handleChangOldPassword.bind(this)}
          />
          <div className={profileStyles.empty} />
          <input
            type="text"
            value={this.state.newPassword}
            placeholder="New password"
            className={`${profileStyles.input} ${profileStyles.inputPassword}`}
            onChange={this.handleChangNewPassword.bind(this)}
          />
        </div>
      )
    } else if (this.state.changePassword === 1) {
      passwordForm = (
        <div className={passwordTextClasses} onClick={this.openPasswordForm}>
          Password successfully changed!
        </div>
      )
    } else {
      passwordForm = (
        <div className={passwordTextClasses} onClick={this.openPasswordForm}>
          Could not change password. Tap to try again.
        </div>
      )
    }

    return (
      <div className={containerStyles}>
        <Header
          leftImg={toChats}
          leftLink={`/ChatList/${this.state.userId}`}
          rightImg={this.state.isTick ? tick : ''}
          rightText=""
          name="Edit Profile"
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
              value={this.state.currentUserName}
              placeholder="Your name"
              className={nameInputClasses}
              onChange={this.handleChangeName}
            />
            <input
              type="text"
              value={this.state.currentUserTag}
              placeholder="Your tag"
              className={tagInputClasses}
              onChange={this.handleChangeTag}
            />
            <textarea
              value={this.state.currentUserBio}
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

UserProfile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
}

export default UserProfile
