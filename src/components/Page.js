import React from 'react'
import ChatList from './ChatList'
import MessageForm from './MessageForm'

class MyPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentClass: new ChatList(this._onClickToMessages()),
    }

    for (let i = 0; i < this.state.currentClass.state.chats.length; i += 1) {
      this._onClickToMessages = this._onClickToMessages.bind(this, this.state.currentClass.state.chats[i].props.name)
    }
  }

  _onClickToMessages(name, event) {
    event.preventDefault()
    this.setState({ currentClass: new MessageForm({ name }) })
  }

  _onClickToChats(event) {
    event.preventDefault()
    this.setState({ currentClass: new ChatList() })

    for (let i = 0; i < this.state.currentClass.state.chats.length; i += 1) {
      this._onClickToMessages = this._onClickToMessages.bind(this, this.state.currentClass.state.chats[i].props.name)
    }
  }

  render() {
    return this.state.currentClass.render()
  }
}

export default MyPage
