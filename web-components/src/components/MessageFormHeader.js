const template = document.createElement('template');
template.innerHTML = `
    <style>
        .rectangle {
            width: 100%;
            background-color: darkred;
            display: flex;
            flex-direction: row;
        }
        
        .button {
            display: flex;
            flex-direction: row;
            flex: 0 0 7%;
            height: 100%;
        }
        
        .to-chats {
            height: 100%;
        }
        
        #chats {
            color: white;
            font-family: "Cambria Math",serif;
        }       
        
        .chat-name {
            display: flex;
            flex-direction: row;
            flex: 0 0 100%;
        }
        
        .for-chat-name {
            width: 86%;
        }
        
        #name {
            position: relative;
            top: 4px;
            color: white;
            font-family: "Cambria Math", serif;
            text-align: center;
            vertical-align: center;
        }
    </style>
    <div class="rectangle"> 
        <div class="button"> 
            <table class="to-chats">
                <tr>
                    <td class="chats-button">
                        <img src="/src/components/images/toChats.png" height="30px" alt="">
                    </td>
                    <td id="chats">
                        Chats
                    </td>
                </tr>
            </table>
        </div>
        <div class="chat-name">
            <table class="for-chat-name">
                <tr>
                    <td id="name"></td>
                </tr>
            </table>
        </div>
    </div>
`;

class MessageFormHeader extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$chat_name = this._shadowRoot.querySelector('#name');
    this.$button = this._shadowRoot.querySelector('.button');
  }

  get button() {
    return this.$button;
  }

  set name(name) {
    this.$chat_name.innerText = name;
  }
}

customElements.define('message-form-header', MessageFormHeader);
