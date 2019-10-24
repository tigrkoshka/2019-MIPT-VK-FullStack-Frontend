const template = document.createElement('template');
template.innerHTML = `
    <style>
        input {
            border-width: 0;
            outline: none;
            width: calc(100% - 2px);
            height: 50px;
            font-size: 20px;
            background-color: #707172;
            color: #FFFFFF;
            border-radius: 15px;
        }

        :host {
            display: inline-block;
            border: 1px solid rgba(25, 25, 25, 0.32);
        }
        
        ::placeholder {
            color: #DDDDDD;
        }
    </style>
    <input type="text">
`;

class FormInput extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$input = this.shadowRoot.querySelector('input');
  }

  static get observedAttributes() {
    return ['name', 'value', 'placeholder', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.$input.setAttribute(name, newValue);
  }

  get value() {
    return this.$input.value;
  }

  clear() {
    this.$input.value = '';
  }
}

customElements.define('form-input', FormInput);
