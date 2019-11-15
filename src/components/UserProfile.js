import React from 'react'
import Header from './Header'
import toChats from '../images/toChats.png'
import tick from '../images/tick.png'
import chatListStyles from '../styles/chatListStyles.module.scss'
import profileStyles from '../styles/userProfileStyles.module.scss'
import profilePic from '../images/profilePic.jpeg'

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialValueName: JSON.parse(localStorage.getItem('userName')) || '',
      initialValueTag: JSON.parse(localStorage.getItem('userTag')) || '',
      initialValueBio: JSON.parse(localStorage.getItem('userBio')) || '',
      valueName: JSON.parse(localStorage.getItem('userName')) || '',
      valueTag: JSON.parse(localStorage.getItem('userTag')) || '',
      valueBio: JSON.parse(localStorage.getItem('userBio')) || '',
      right: '',
      onRightClick: () => {},
      onTickClick: this.onTickClick.bind(this),
    }

    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeTag = this.handleChangeTag.bind(this)
    this.handleChangeBio = this.handleChangeBio.bind(this)
  }

  onTickClick(event) {
    event.preventDefault()
    localStorage.removeItem('userName')
    localStorage.setItem('userName', JSON.stringify(this.state.valueName))

    localStorage.removeItem('userTag')
    localStorage.setItem('userTag', JSON.stringify(this.state.valueTag))

    localStorage.removeItem('userBio')
    localStorage.setItem('userBio', JSON.stringify(this.state.valueBio))
  }

  handleChangeName(event) {
    event.preventDefault()
    const temp = event.target.value
    this.setState((state) => {
      return { valueName: temp, right: state.initialValueName === temp ? '' : tick, onRightClick: state.onTickClick }
    })
  }

  handleChangeTag(event) {
    const temp = event.target.value
    this.setState((state) => {
      return { valueTag: temp, right: state.initialValueTag === temp ? '' : tick, onRightClick: state.onTickClick }
    })
  }

  handleChangeBio(event) {
    const temp = event.target.value
    this.setState((state) => {
      return { valueBio: temp, right: state.initialValueBio === temp ? '' : tick, onRightClick: state.onTickClick }
    })
  }

  render() {
    const nameInputClasses = `${profileStyles.input} ${profileStyles.inputName}`
    const tagInputClasses = `${profileStyles.input} ${profileStyles.inputTag}`
    const bioInputClasses = `${profileStyles.input} ${profileStyles.inputBio}`

    return (
      <div className={chatListStyles.container}>
        <Header
          leftImg={toChats}
          rightImg={this.state.right}
          leftLink="/ChatList"
          name="Edit Profile"
          onRightClick={this.state.onRightClick}
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
              value={this.state.valueName}
              placeholder="Your name"
              className={nameInputClasses}
              onChange={this.handleChangeName}
            />
            <input
              type="text"
              value={this.state.valueTag}
              placeholder="Your tag"
              className={tagInputClasses}
              onChange={this.handleChangeTag}
            />
            <textarea
              value={this.state.valueBio}
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

export default UserProfile
