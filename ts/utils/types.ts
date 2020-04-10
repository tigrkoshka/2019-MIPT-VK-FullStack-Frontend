export class SmartText {
  readonly text: string = ''
  readonly to: string = ''
  private readonly encoded: string = ''

  constructor(text: string, to: string) {
    this.text = text
    this.to = to
    this.encoded = `${this.text}\0${this.to}`
  }

  getEncoded(): string {
    return this.encoded
  }
}
