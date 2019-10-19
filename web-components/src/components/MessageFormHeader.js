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
            width: 100%;
        }
        
        .to-chats {
            height: 100%;
        }
        
        #chats {
            color: white;
            font-family: "Cambria Math",serif;
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
    </div>
`;

class MessageFormHeader extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$button = this._shadowRoot.querySelector('.button');
  }

  get button() {
    return this.$button;
  }
}

customElements.define('message-form-header', MessageFormHeader);
