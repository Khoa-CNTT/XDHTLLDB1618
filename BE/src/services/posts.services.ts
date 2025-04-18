import { CreatePostRequestBody } from '~/models/request/posts.request'
import database from './database.services'

import { getFbLikes, uploadImageFb } from '~/helpers/facebook'
import { ErrorWithStatus } from '~/models/errors'
import { HTTP_STATUS_CODE } from '~/constants/httpStatusCode'
import { Platform } from '~/constants/enum'
import { createCarouselThreadsMediaContainer, createSingleThreadsMediaContainer } from '~/helpers/threads'
import { uploadImageXFromUrl } from '~/helpers/x'
import { omit } from 'lodash'
import { createCarouselInstagramMediaContainer, createSingleInstagramMediaContainer } from '~/helpers/instagram'

class PostServices {
  async getPosts(ownerId: string, platform: string) {
    const posts = await database.post.findMany({
      where: {
        socialCredential: {
          ownerId
        },
        platform
      },
      include: {
        socialCredential: {
          select: {
            metadata: true
          }
        },
        publishedPost: true
      }
    })

    return posts
  }

  async schedulePost(body: CreatePostRequestBody) {
    const socialCredentialIDs = body.socialPosts.map((socialPost) => socialPost.socialCredentialID)
    const socialCredentials = await database.socialCredential.findMany({
      where: {
        id: {
          in: socialCredentialIDs
        }
      },
      select: { id: true, credentials: true }
    })

    const schedulePostRequestBody = await Promise.all(
      body.socialPosts.map(async (socialPost) => {
        const credential = socialCredentials.find((c) => c.id === socialPost.socialCredentialID)?.credentials as any

        if (!credential) {
          throw new ErrorWithStatus({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: `No credential found with id: ${socialPost.socialCredentialID}`
          })
        }

        // facebook
        if (socialPost.platform === Platform.Facebook) {
          const imageFbIds = await Promise.all(
            socialPost.metadata.assets.map((asset) => {
              return uploadImageFb({
                access_token: credential.access_token,
                page_id: credential.page_id,
                url: asset.url
              })
            })
          )

          return {
            status: 'scheduled',
            publicationTime: body.publicationTime,
            platform: socialPost.platform,
            socialCredentialID: socialPost.socialCredentialID,
            metadata: {
              type: socialPost.metadata.type,
              content: socialPost.metadata.content,
              assets: socialPost.metadata.assets.map((asset) => ({
                type: asset.type,
                url: asset.url
              })),
              media_fbid: imageFbIds
            }
          }
        }

        // threads
        if (socialPost.platform === Platform.Threads) {
          // type: carousel
          let createMediaContainerFunction = null
          let createMediaBody: any = {
            media_type: socialPost.metadata.assets[0].type.toUpperCase() as 'IMAGE' | 'VIDEO',
            text: socialPost.metadata.content
          }
          if (socialPost.metadata.assets.length > 1) {
            createMediaContainerFunction = createCarouselThreadsMediaContainer
            createMediaBody.image_url = socialPost.metadata.assets.map((asset) => asset.url)
          } else {
            createMediaContainerFunction = createSingleThreadsMediaContainer
            createMediaBody.image_url = socialPost.metadata.assets[0].url
          }

          // type: single
          const creation_id = await createMediaContainerFunction(
            credential.access_token,
            credential.user_id,
            createMediaBody
          )

          return {
            status: 'scheduled',
            publicationTime: body.publicationTime,
            platform: socialPost.platform,
            socialCredentialID: socialPost.socialCredentialID,
            metadata: {
              type: socialPost.metadata.type,
              content: socialPost.metadata.content,
              assets: socialPost.metadata.assets.map((asset) => ({
                type: asset.type,
                url: asset.url
              })),
              creation_id
            }
          }
        }

        // x
        if (socialPost.platform === Platform.X) {
          const imageXIds = await Promise.all(
            socialPost.metadata.assets.map((asset) =>
              uploadImageXFromUrl(
                asset.url,
                credential.access_token,
                socialPost.socialCredentialID,
                credential.refresh_token
              )
            )
          )

          return {
            status: 'scheduled',
            publicationTime: body.publicationTime,
            platform: socialPost.platform,
            socialCredentialID: socialPost.socialCredentialID,
            metadata: {
              type: socialPost.metadata.type,
              content: socialPost.metadata.content,
              assets: socialPost.metadata.assets.map((asset) => ({
                type: asset.type,
                url: asset.url
              })),
              media_ids: imageXIds
            }
          }
        }
        // if (socialPost.platform === Platform.Instagram) {
        let createMediaContainerFunction = null
        let createMediaBody: any = {
          caption: socialPost.metadata.content
        }
        if (socialPost.metadata.assets.length > 1) {
          createMediaContainerFunction = createCarouselInstagramMediaContainer
          createMediaBody.image_urls = socialPost.metadata.assets.map((asset) => asset.url)
        } else {
          createMediaContainerFunction = createSingleInstagramMediaContainer
          createMediaBody.image_url = socialPost.metadata.assets[0].url
        }
        const creation_id = await createMediaContainerFunction(
          credential.access_token,
          credential.user_id,
          createMediaBody
        )

        return {
          status: 'scheduled',
          publicationTime: body.publicationTime,
          platform: socialPost.platform,
          socialCredentialID: socialPost.socialCredentialID,
          metadata: {
            type: socialPost.metadata.type,
            content: socialPost.metadata.content,
            assets: socialPost.metadata.assets.map((asset) => ({
              type: asset.type,
              url: asset.url
            })),
            creation_id
          }
        }
        // }
      })
    )

    await database.post.createMany({
      data: schedulePostRequestBody
    })
  }

  async getPostDetails(postId: string) {
    const post = await database.post.findUnique({
      where: {
        id: postId
      },
      include: {
        socialCredential: {
          select: {
            metadata: true,
            credentials: true
          }
        },
        publishedPost: true
      }
    })

    if (post?.publishedPost) {
      let metadata: any = {}

      if (post?.platform === Platform.Facebook) {
        metadata.likes = await getFbLikes(
          post.publishedPost.postId,
          (post.socialCredential.credentials as any).access_token
        )
      }

      post.publishedPost.metadata = metadata
    }

    return omit(post, ['socialCredential.credentials'])
  }
}

const postServices = new PostServices()

export default postServices
