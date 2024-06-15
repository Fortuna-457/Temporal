import { useState, useEffect } from 'react'

export default function useTruncatedText(text, maxLength = 200) {
  const [truncatedText, setTruncatedText] = useState('')

  useEffect(() => {
    if (text.length <= maxLength) {
      setTruncatedText(text)
    } else {
      setTruncatedText(text.slice(0, maxLength) + '...')
    }
  }, [text, maxLength])

  return truncatedText
}
