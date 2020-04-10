export const cacheableErrors = [413, 422, 501]

export function buildResponse(code: number): {} {
  switch (code) {
    case 401:
      return { status: 'error', message: 'API key troubles. Report or try later.' }
    case 402:
      return { status: 'error', message: 'API key troubles. Report or try later.' }
    case 404:
      return { status: 'error', message: 'Daily limit exceeded. Try tomorrow.' }
    case 413:
      return { status: 'error', message: 'Text is too long. Try translating part by part.' }
    case 422:
      return { status: 'error', message: 'Untranslatable text.' }
    case 501:
      return { status: 'error', message: 'Translation direction is not supported.' }
    default:
      return { status: 'ok' }
  }
}
