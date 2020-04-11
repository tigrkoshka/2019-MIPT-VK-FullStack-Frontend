export class SmartText {
  private readonly encoded: string = ''

  constructor(public readonly text: string = '', public readonly to: string = '') {
    this.encoded = `${this.text}\0${this.to}`
  }

  getEncoded(): string {
    return this.encoded
  }
}

export type TErrorResponse = {
  status: 'error' | 'ok'
  message: string
}

export type APIResponse = {
  code: number
  lang: string
  text: string[]
}
