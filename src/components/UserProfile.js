import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import toChats from '../images/toChats.png'
import tick from '../images/tick.png'
import profileStyles from '../styles/userProfileStyles.module.scss'
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
      userId: Number(this.props.match.params.userId),
      isTick: false,
    }

    fetch(`http://127.0.0.1:8000/users/profile/?id=${this.state.userId}`)
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
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeTag = this.handleChangeTag.bind(this)
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

    fetch('http://127.0.0.1:8000/users/set_user/', {
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
      })
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

  handleChangeBio(event) {
    event.preventDefault()
    const temp = event.target.value
    this.setState((state) => {
      return { currentUserBio: temp, isTick: state.initialUserBio !== temp }
    })
  }

  render() {
    const nameInputClasses = `${profileStyles.input} ${profileStyles.inputName}`
    const tagInputClasses = `${profileStyles.input} ${profileStyles.inputTag}`
    const bioInputClasses = `${profileStyles.input} ${profileStyles.inputBio}`

    return (
      <div className={profileStyles.container}>
        <Header
          leftImg={toChats}
          rightImg={this.state.isTick ? tick : ''}
          leftLink={`/ChatList/${this.state.userId}`}
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
