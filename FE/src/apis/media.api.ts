import http from '@/utils/http'
import axios from 'axios'
import moment from 'moment'

import { UploadImageResponse } from '@/types/media'
import { SuccessResponse } from '@/types/utils'

const MEDIA_URI = '/media'

const mediaApis = {
  handleUploadImages: async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })
    return http.post<SuccessResponse<UploadImageResponse[]>>(`${MEDIA_URI}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default mediaApis
