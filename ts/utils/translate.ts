import fetch from 'node-fetch'
import { Caches } from './caches'
import { SmartText } from './types'

const API_KEY = 'trnsl.1.1.20200409T160333Z.290a8b263dd428ba.1a8a9b6ff2f5f0d509800d3409ce8172e31818f8'

const cache = new Caches()

async function guessLang(text: string): Promise<string> {
  return fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${API_KEY}&text=${encodeURIComponent(text)}`)
    .then((response) => response.json())
    .then(({ lang }) => {
      return lang
    })
}

export async function translate(text: string, to: string, from?: string): Promise<string | undefined> {
  const req = new SmartText(text, to)

  if (cache.has(req.getEncoded())) return cache.get(req.getEncoded())

  if (!from) {
    const lang = await guessLang(text)
    return translate(text, to, lang)
  }

  return fetch(
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&text=${encodeURIComponent(
      text,
    )}&lang=${from}-${to}&format=plain`,
  )
    .then((response) => response.json())
    .then((data) => {
      cache.add(req.getEncoded(), data.text[0])
      return data.text[0]
    })
}
