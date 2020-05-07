import React from 'react'
import headerStyles from '../styles/headerStyles.module.scss'
import appStyles from '../styles/app.module.scss'
import { TranslateState } from '../types/types'
import TranslateUtil from '../utils'

function Header(name: string): React.ReactElement {
  return (
    <div className={headerStyles.rectangle}>
      <div className={headerStyles.horizontal}>
        <div className={headerStyles.vertical}>
          <div className={headerStyles.name}>{name}</div>
        </div>
      </div>
    </div>
  )
}

class App extends React.Component<{}, TranslateState> {
  constructor(props: Readonly<{}>) {
    super(props)

    this.handleChangeUserText = this.handleChangeUserText.bind(this)
    this.handleTranslate = this.handleTranslate.bind(this)
    this.handleLangChange = this.handleLangChange.bind(this)
  }

  componentWillMount() {
    this.setState({
      userText: '',
      translated: '',
      unknown: true,
    })
  }

  handleChangeUserText(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    event.preventDefault()
    this.setState({ userText: event.currentTarget.value })
  }

  handleTranslate(event: React.MouseEvent<HTMLDivElement>): void {
    event.preventDefault()

    if (this.state.unknown) {
      TranslateUtil.translate(this.state.userText, 'en').then((str) => this.setState({ translated: str }))
    } else {
      TranslateUtil.translate(this.state.userText, 'en', 'ru').then((str) => this.setState({ translated: str }))
    }
  }

  handleLangChange(event: React.MouseEvent<HTMLDivElement>): void {
    event.preventDefault()
    this.setState({ unknown: !this.state.unknown })
  }

  render(): React.ReactElement {
    return (
      <div className={appStyles.container}>
        {Header('TechnoTrack Translator')}
        <div className={appStyles.horizontalSmall}>
          <div className={appStyles.verticalSmall}>
            <div className={appStyles.button} onClick={this.handleLangChange}>
              {`From: ${this.state.unknown ? 'Unknown' : 'Russian'} (click to change)`}
            </div>
          </div>
        </div>
        <div className={appStyles.horizontalBig}>
          <div className={appStyles.verticalBig}>
            <textarea
              value={this.state.userText}
              placeholder="Text to translate"
              className={appStyles.textField}
              onChange={this.handleChangeUserText}
            />
          </div>
          <div className={appStyles.verticalBig}>
            <textarea
              value={this.state.translated}
              placeholder="Text to translate"
              className={appStyles.textField}
              onChange={this.handleChangeUserText}
            />
          </div>
        </div>
        <div className={appStyles.horizontalSmall}>
          <div className={appStyles.verticalSmall}>
            <div className={appStyles.button} onClick={this.handleTranslate}>
              Translate
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
