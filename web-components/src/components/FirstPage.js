const template = document.createElement('template')
template.innerHTML = `
    <style>
        .content {
              margin: 10px 15px 5px;
              color: #FFFFFF;
              word-break: normal;
              text-align: center;
              line-height: 28px;
          }

          .time {
              margin-right: 10px;
              margin-bottom: 5px;
              font-size: medium;
              text-align: right;
              color: #CCCCCC;
          }

          .vert {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .horiz {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
          }

          .curr-message {
            border-radius: .8em;
            background: #606163;
          }
    </style>
    <div class="vert">
        <div class="horiz">
            <div class="curr-message">
              <div class="content">Thank you for choosing Hummingbird!<br>Tap anywhere to continue.</div>
                <div class="time">2:39</div>
            </div>
        </div>
    </div>
`

class FirstPage extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))

    this.$container = this._shadowRoot.querySelector('.vert')
  }

  get container() {
    return this.$container
  }
}

customElements.define('first-page', FirstPage)
