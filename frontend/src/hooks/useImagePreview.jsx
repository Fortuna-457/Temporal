import { useEffect, useState } from 'react'
import defaultImage from '../assets/img/default-image.png'
import defaultAvatar from '../assets/img/default-avatar.jpg'

export const usePostThumbnailPreview = (thumbnail, noImage = null) => {
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (thumbnail) {
      if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
        setPreview(thumbnail)
      } else {
        setPreview(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/images/post-thumbnails/${thumbnail}`
        )
      }
    } else {
      setPreview(noImage || defaultImage)
    }
  }, [thumbnail, noImage])

  return preview
}

export const useAvatarPreview = (avatar, noImage = null) => {
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (avatar) {
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        setPreview(avatar)
      } else {
        setPreview(
          `${import.meta.env.VITE_API_BASE_URL}/images/avatars/${avatar}`
        )
      }
    } else {
      setPreview(noImage || defaultAvatar)
    }
  }, [avatar, noImage])

  return preview
}
