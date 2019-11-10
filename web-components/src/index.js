import './index.css'

import './components/ChatListHeader'
import './components/ChatList'
import './components/Chat'
import './components/MessageFormHeader'
import './components/Message'
import './components/FormInput'
import './components/MessageForm'
import './components/FirstPage'

const template = document.createElement('template')
template.innerHTML = `
    <style>
        .container {
            height: 100%;
            width: 100%;
        }
    </style>
    <div class="container">
        <first-page action="/"></first-page>
    </div>
`

class Page extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))

    this.$container = this._shadowRoot.querySelector('.container')
    this.$firstPage = this._shadowRoot.querySelector('first-page')

    this.$firstPage.addEventListener('click', this._onClickToChats.bind(this))
  }

  _onClickToMessages(name, event) {
    event.preventDefault()
    this.$container.innerHTML = `<message-form action="/" name='${name}'></message-form>`

    this.$messageForm = this._shadowRoot.querySelector('message-form')
    this.$messageFormHeader = this.$messageForm.header
    this.$buttonToChats = this.$messageFormHeader.button
    this.$buttonToChats.addEventListener('click', this._onClickToChats.bind(this))
  }

  _onClickToChats(event) {
    event.preventDefault()
    this.$container.innerHTML = '<chat-list action="/"></chat-list>'
    this.$chatList = this._shadowRoot.querySelector('chat-list')
    this.$chats = this.$chatList.chats
    for (let i = 0; i < this.$chats.length; i += 1) {
      this.$chats[i].addEventListener('click', this._onClickToMessages.bind(this, this.$chats[i].$name.innerText))
    }
  }
}

customElements.define('my-page', Page)
