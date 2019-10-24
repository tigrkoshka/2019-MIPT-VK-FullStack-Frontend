const template = document.createElement('template');
template.innerHTML = `
    <style>
        .rectangle {
            width: 100%;
            background-color: #131313;
            display: flex;
            flex-direction: row;
        }
        
        .button {
            display: flex;
            flex-direction: row;
            flex-basis: 6%;
            height: 100%;
            cursor: pointer;
        }
        
        .vertical {
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 20px;
        }
        
        .horizontal {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 86%;
        }
        
        .text {
            color: white;
            font-family: "Cambria Math",serif;
        }
        
        #name {
            cursor: default;
            font-size: 23px;
        }
    </style>
    <div class="rectangle"> 
        <div class="button"> 
            <div class="vertical">
                <img src="/src/components/images/toChats.png" height="30px" alt="">
            </div>
            <div class="vertical">
                <div class="text">Chats</div>
            </div>  
        </div>
        <div class="horizontal">
            <div class="vertical">
                <div class="text" id="name"></div>
            </div>
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
