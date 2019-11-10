const template = document.createElement('template')
template.innerHTML = `
    <style>
        table {
            width: 100%;
        }
        tr, td {
            height: 40px;
            padding: 0;
        }
    
        .chat {
            width: 100%;
        }
        
        .chat:hover {
            background-color: #818285;
        }
        
        .for-pic {
            height: 100%;
            width: 8%;
            margin-left: 5px;
        }
        
        .photo {
            width: 100px;
            height: 100px;
            margin: 0 0;
            overflow: hidden;
            border-radius: 50%;
        }
        
        .pic {
            height: 100%;
            width: auto;
            margin: 0 auto;
        }
        
        .first {
            vertical-align: bottom;
            position: relative;
        }
        
        .name {
            position: absolute;
            bottom: 8px;
            left: 10px;
            font-size: 23px;
            right: 20px;
        }
        
        .last-time {
            text-align: right;
            position: absolute;
            bottom: 8px;
            right: 10px;
            font-size: 17px;
            color: #A0A0A0
        }
        
        .second {
            vertical-align: top;
            padding: 4px;
            position: relative;
        }
        
        .last-message {
            position: absolute;
            top: 10px;
            left: 10px;
            margin-right: 50px;
            font-size: 19px;
        }
        
        .indicator {
            background-color: #898989;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 15px;
            text-align: center;
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 3px;
        }
        
        hr {
            background-color: #404040;
            margin: 5px 0;
        }
        
    </style>
    <div class="chat">
        <table>
            <tr>
                <td rowspan="2" class="for-pic">
                    <div class="photo">
                        <img src="../src/images/profilePic.jpeg" alt="" class="pic">
                    </div>
                </td>
                <td class="first">
                    <div class="name"></div>
                    <div class="last-time"></div>
                </td>
            </tr>
            <tr>
                <td class="second">
                    <div class="last-message"></div>
                    <div class="indicator"></div>
                </td>
            </tr>
        </table>
    </div>
    <hr>
`

class Chat extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))

    this.$name = this._shadowRoot.querySelector('.name')
    this.$lastTime = this._shadowRoot.querySelector('.last-time')
    this.$lastMessage = this._shadowRoot.querySelector('.last-message')
    this.$indicator = this._shadowRoot.querySelector('.indicator')
    this.$chat = this._shadowRoot.querySelector('.chat')
  }

  setAll(name) {
    this.$name.innerText = name

    const messagesOfThisChat = JSON.parse(localStorage.getItem(this.$name.innerText)) || []

    if (messagesOfThisChat.length !== 0) {
      const numberOfMessages = messagesOfThisChat.length

      this.$lastTime.innerText = messagesOfThisChat[numberOfMessages - 1].time

      const preLastMess = messagesOfThisChat[numberOfMessages - 1].content
      const arr = preLastMess.split(' ')
      let i = 0
      let count = arr[i].length
      let res = ''
      while (i < arr.length && count < 100) {
        res += `${arr[i]} `
        i += 1
        if (i < arr.length) {
          count += arr[i].length
        }
      }
      res = res.substr(0, res.length - 1)
      if (i < arr.length) {
        res += '...'
      }

      this.$lastMessage.innerText = res
      this.$indicator.innerText = numberOfMessages
    } else {
      this.$lastTime.innerText = ''
      this.$lastMessage.innerText = ''
      this.$indicator.innerText = 0
    }
  }

  get chat() {
    return this.$chat
  }

  get name() {
    return this.$name.innerText
  }

  get lastTime() {
    return this.$lastTime.innerText
  }

  get lastMessage() {
    return this.$lastMessage.innerText
  }

  get indicator() {
    return this.$indicator.innerText
  }
}

customElements.define('one-chat', Chat)
