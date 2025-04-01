import supabase from '@/configs/supabase'
import moment from 'moment'

import { Credential } from '@/types/credentials'

const mediaApis = {
  handleUploadImages: async (files: File[], credential: Credential) => {
    const now = moment().format('YYYY-MM-DD')

    const uploadPromises = files.map(async (file) => {
      const { data, error } = await supabase.storage
        .from('facebook')
        .upload(`${credential.credential.page_id}/${now}_${file.name}`, file, {
          cacheControl: '3600'
        })

      if (error) {
        console.error('Error uploading image:', error)
        return null
      }

      return data?.path
    })

    const uploadedPaths = await Promise.all(uploadPromises)

    return uploadedPaths.filter((path) => path !== null)
  }
}

export default mediaApis
