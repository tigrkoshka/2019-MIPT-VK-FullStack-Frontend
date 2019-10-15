const template = document.createElement('template');
template.innerHTML = `
    <style>
        #rectangle {
            background-color: darkred;
            display: flex;
            flex: 1 1 7%;
        }
        
        form {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    
        form-input {
            flex: 0 0 auto;
        }   
        
        .curr-message {
            position: relative;
            max-width: 75%;
            margin-bottom: 10px;
            margin-top: 10px;
            border-radius: .8em;
        }
        
        .mine {
            margin-right: 5px;
            align-self: flex-end;
            background: yellow;
        }

        input[type=submit] {
            visibility: collapse;
        }  
        
        .the-chat {
            overflow-y: scroll;
            display: flex;
            flex-direction: column-reverse;
            width: calc(100% - 10px);
            height: 100%;
        }
    </style>
    <form>
        <div id="rectangle"></div>
        <div class="the-chat"></div>
        <form-input name="message-text" placeholder="Введите сообщение"></form-input>
    </form>
`;

class MessageForm extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.$form = this._shadowRoot.querySelector('form');
    this.$input = this._shadowRoot.querySelector('form-input');
    this.$the_chat = this._shadowRoot.querySelector('.the-chat');

    this.$messages = JSON.parse(localStorage.getItem('message-list')) || [];

    for (let i = 0; i < this.$messages.length; i += 1) {
      const currMessage = document.createElement('one-message');
      currMessage.content = this.$messages[i].content;
      currMessage.time = this.$messages[i].time;
      currMessage.classList.add('curr-message', 'mine');
      this.$the_chat.insertBefore(currMessage, this.$the_chat.firstChild);
    }

    this.$form.addEventListener('submit', this._onSubmit.bind(this));
    this.$form.addEventListener('keypress', this._onKeyPress.bind(this));
  }

  _onSubmit(event) {
    event.preventDefault();
    const currText = this.$input.value.trim();
    if (currText.length !== 0) {
      const currMessage = document.createElement('one-message');
      currMessage.classList.add('curr-message', 'mine');
      currMessage.content = currText;
      currMessage.time = (new Date()).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
      this.$messages.push({ content: currMessage.content, time: currMessage.time });
      this.$the_chat.insertBefore(currMessage, this.$the_chat.firstChild);
      localStorage.removeItem('message-list');
      localStorage.setItem('message-list', JSON.stringify(this.$messages));
      this.$input.clear();
    }
  }

  _onKeyPress(event) {
    if (event.keyCode === 13) {
      this.$form.dispatchEvent(new Event('submit'));
    }
  }
}

customElements.define('message-form', MessageForm);
