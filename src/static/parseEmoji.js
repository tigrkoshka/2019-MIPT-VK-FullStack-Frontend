import React from 'react'
import { emojiList } from '../settings'
import messageStyles from '../styles/singleMessageStyles.module.scss'
import emojiStyles from '../styles/emojiStyles.module.scss'

export default function parseForEmoji(text, mode) {
  const parts = text.split(':')
  let key = 0
  let addStyles
  switch (mode) {
    case 0: {
      addStyles = emojiStyles.in_message
      break
    }
    case 1: {
      addStyles = emojiStyles.in_chat
      break
    }
    default: {
      addStyles = null
    }
  }
  parts.forEach((part, i, arr) => {
    if (emojiList.includes(part)) {
      arr.splice(
        i,
        1,
        // eslint-disable-next-line react/no-array-index-key
        <div key={key} className={messageStyles.content_vert}>
          <div className={`${emojiStyles[part]} ${addStyles}`} />
        </div>,
      )
    } else {
      arr.splice(
        i,
        1,
        <div key={key} className={messageStyles.content_vert}>
          {part}
        </div>,
      )
    }
    key += 1
  })
  return parts
}
