import React from 'react'
import { Link } from 'react-router-dom'
import welcomePageStyles from '../styles/welcomePageStyles.module.scss'

class WelcomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: (
        <div className={welcomePageStyles.content}>
          Thank you for choosing Hummingbird!
          <br />
          Enter your tag and password.
          <br />
          Then tap anywhere to continue.
        </div>
      ),
      tag: '',
      password: '',
    }

    this.handleTagChange = this.handleTagChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleTagSubmit = this.handleTagSubmit.bind(this)
    this.handleAuth = this.handleAuth.bind(this)
    this.passwordInput = React.createRef()
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
    fetch(`http://127.0.0.1:8000/users/auth/?tag=${this.state.tag}&password=${this.state.password}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ id }) => {
        window.location.hash = `#/ChatList/${id}`
      })
      .catch(() => {
        this.setState({
          message: (
            <div className={welcomePageStyles.content}>
              Incorrect tag of password.
              <br />
              Try again.
            </div>
          ),
        })
      })
  }

  render() {
    return (
      <div className={welcomePageStyles.vert} onClick={this.handleAuth}>
        <div className={welcomePageStyles.horiz}>
          <div className={welcomePageStyles.curr_message}>
            {this.state.message}
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
