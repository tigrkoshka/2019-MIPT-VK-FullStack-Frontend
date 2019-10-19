const template = document.createElement('template');
template.innerHTML = `
    <style>
        .container {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        
        #header {
            display: flex;
            flex: 0 1 7%;
        }
        
        .chats {
            overflow-y: scroll;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }
        .new-chat {
            position: absolute;
            bottom: 30px;
            right: 30px;
        }
    </style>
    <div class="container"> 
        <chat-list-header id="header"></chat-list-header>
        <div class="chats"></div>
        <div class="new-chat"><img src="/src/components/images/new-chat.png" height="70px" alt=""></div>
    </div>
`;

class ChatList extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$chatsList = this._shadowRoot.querySelector('.chats');
    this.$header = this._shadowRoot.querySelector('chat-list-header');

    this.$messages = JSON.parse(localStorage.getItem('message-list')) || [];

    this.$chats = JSON.parse(localStorage.getItem('chats-list')) || [];

    let data = ["Общество целых бокалов",
      "Дженнифер Эшли",
      "Антон Иванов",
      "Серёга (должен 2000)",
      "Общество разбитых бокалов",
      "Сэм с Нижнего",
      "Айрат работа",
      "Кеша армия",
      "Первый курс ФПМИ-Наука 2019-2020"];

    for(let i = data.length - 1; i >= 0; i -= 1){
      const currChat = document.createElement('one-chat');
      currChat.name = data[i];
      currChat.lastTime = this.$messages[this.$messages.length - 1].time;
      currChat.lastMessage = this.$messages[this.$messages.length - 1].content;
      currChat.indicator = this.$messages.length;
      this.$chats.push({
        name: currChat.name,
        lastTime: currChat.lastTime,
        lastMessage: currChat.lastMessage,
        indicator: currChat.indicator,
      });
      this.$chatsList.insertBefore(currChat, this.$chatsList.firstChild);
      localStorage.removeItem('chats-list');
      localStorage.setItem('chats-list', JSON.stringify(this.$chats));
    }




  }

  get header() {
    return this.$header;
  }

  get chats() {
    return this.$chatsList;
  }
}

customElements.define('chat-list', ChatList);
