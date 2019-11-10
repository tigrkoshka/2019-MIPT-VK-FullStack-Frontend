const template = document.createElement('template')
template.innerHTML = `
    <style>
        .rectangle {
            width: 100%;
            background-color: #131313;
            display: flex;
            flex-direction: row;
        }
        
        .burger {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-basis: 10%;
            height: 100%;
        }
        
        .vertical {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .horizontal {
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex-basis: 80%;
        }
        
        .hummingbird {
            color: white;
            font-family: "Cambria Math", serif;
            cursor: default;
        }
        
        .search {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            flex-basis: 10%;
            height: 100%;
        }
        
        .empty {
            flex-basis: 20px;
        }
    </style>
    <div class="rectangle"> 
        <div class="empty"></div>
        <div class="burger"> 
            <div class="vertical">
                <img src="../src/images/burger.png" height="45px" width="height" alt="">
            </div>
        </div>
        <div class="horizontal">
            <div class="vertical">
                <div class="hummingbird">Hummingbird</div>
            </div>
        </div>
        <div class="search"> 
            <div class="vertical">
                <img src="../src/images/search.png" height="35px" width="height" alt="">
            </div>
        </div>
        <div class="empty"></div>
    </div>
`

class ChatListHeader extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('chat-list-header', ChatListHeader)
