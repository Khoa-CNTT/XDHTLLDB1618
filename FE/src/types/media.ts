export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export type ImagePreview = {
  file: File
  preview: string
}

export type UploadImageResponse = {
  type: MediaType.IMAGE
  url: string
}
