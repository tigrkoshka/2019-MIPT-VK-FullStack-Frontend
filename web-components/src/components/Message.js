const template = document.createElement('template');
template.innerHTML = `
    <style>
        .content {
            margin: 10px 15px 5px;
            color: blue;
            word-break: normal;
        }
        
        .time {
            margin-right: 10px;
            margin-bottom: 5px;
            margin-left: 2px;
            font-size: medium;
            text-align: right;
            color: blue;
        }
    </style>
    <div class="content"></div>
    <div class="time"></div>
`;

class Message extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.$content = this._shadowRoot.querySelector('.content');
    this.$time = this._shadowRoot.querySelector('.time');
  }

  get time() {
    return this.$time.innerText;
  }

  get content() {
    return this.$content.innerText;
  }

  set time(time) {
    this.$time.innerText = time;
  }

  set content(text) {
    this.$content.innerText = text;
  }
}

customElements.define('one-message', Message);
