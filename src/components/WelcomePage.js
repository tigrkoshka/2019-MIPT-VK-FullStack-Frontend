import React from 'react'
import autoBind from 'react-autobind'
import { Link } from 'react-router-dom'
import { baseServer } from '../settings'
import welcomePageStyles from '../styles/welcomePageStyles.module.scss'

class WelcomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messageType: 0,
      tag: '',
      password: '',
    }

    autoBind(this)

    this.passwordInput = React.createRef()
  }

  getMessage() {
    if (this.state.messageType === 0) {
      return (
        <div className={welcomePageStyles.content}>
          Thank you for choosing Hummingbird!
          <br />
          Enter your tag and password.
          <br />
          Then tap anywhere to continue.
        </div>
      )
    }

    return (
      <div className={welcomePageStyles.content}>
        Incorrect tag of password.
        <br />
        Try again.
      </div>
    )
  }

  handleTagChange(event) {
    event.preventDefault()
    this.setState({ tag: event.target.value })
  }

  handlePasswordChange(event) {
    event.preventDefault()
    this.setState({ password: event.target.value })
  }

  handleTagSubmit(event) {
    event.preventDefault()
    if (this.state.password === '') {
      this.passwordInput.current.focus()
    } else {
      this.handleAuth(event)
    }
  }

  handleAuth(event) {
    event.preventDefault()
    fetch(`${baseServer}/users/auth/?tag=${this.state.tag}&password=${this.state.password}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ id }) => {
        window.location.hash = `#/ChatList/${id}`
      })
      .catch(() => {
        this.setState({ messageType: 1 })
      })
  }

  render() {
    return (
      <div className={welcomePageStyles.vert} onClick={this.handleAuth}>
        <div className={welcomePageStyles.horiz}>
          <div className={welcomePageStyles.curr_message}>
            {this.getMessage()}
            <div className={welcomePageStyles.time}>2:39</div>
          </div>
        </div>
        <div className={welcomePageStyles.empty} />
        <div className={welcomePageStyles.horiz}>
          <form onSubmit={this.handleTagSubmit} className={welcomePageStyles.form}>
            <input
              type="text"
              value={this.state.tag}
              placeholder="Enter your tag"
              className={welcomePageStyles.input}
              onChange={this.handleTagChange}
              onClick={(event) => {
                event.stopPropagation()
                return false
              }}
            />
          </form>
        </div>
        <div
          className={welcomePageStyles.empty}
          onClick={(event) => {
            event.stopPropagation()
            return false
          }}
        />
        <div className={welcomePageStyles.horiz}>
          <form onSubmit={this.handleAuth} className={welcomePageStyles.form}>
            <input
              type="password"
              value={this.state.password}
              placeholder="Enter your password"
              className={welcomePageStyles.input}
              onChange={this.handlePasswordChange}
              onClick={(event) => {
                event.stopPropagation()
                return false
              }}
              ref={this.passwordInput}
            />
          </form>
        </div>
        <div
          className={welcomePageStyles.empty}
          onClick={(event) => {
            event.stopPropagation()
            return false
          }}
        />
        <Link
          to="/CreateUser"
          className={welcomePageStyles.create}
          onClick={(event) => {
            event.stopPropagation()
            return false
          }}
        >
          Don&apos;t have an account? Become a hummingbird!
        </Link>
      </div>
    )
  }
}

export default WelcomePage
