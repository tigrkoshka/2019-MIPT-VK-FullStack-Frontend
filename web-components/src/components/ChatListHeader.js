const template = document.createElement('template');
template.innerHTML = `
    <style>
        .rectangle {
            width: 100%;
            background-color: darkred;
            position: relative;
        }
        
        .burger {
            position: absolute;
            height: 100%;
            width: auto;
            left: 10px;
        }
        
        .messenger {
            position: absolute;
            color: white;
            top: 30%;
            left: 47%;
        }
        .search {
            position: absolute;
            height: 100%;
            width: auto;
            right: 10px;
            top: 5px;
        }
    </style>
    <div class="rectangle"> 
        <div class="burger"><img src="/src/components/images/burger.png" height="100%" width="height" alt=""></div>
        <div class="messenger">Messenger</div>
        <div class="search"><img src="/src/components/images/search.png" height="80%" width="height" alt=""></div>
    </div>
`;

class ChatListHeader extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('chat-list-header', ChatListHeader);
