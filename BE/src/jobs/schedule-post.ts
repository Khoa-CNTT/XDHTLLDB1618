import database from '~/services/database.services'
import { addPostToPublishQueue } from '~/services/queue.services'

export const schedulePosts = async () => {
  try {
    const now = new Date()
    const posts = await database.post.findMany({
      where: {
        status: 'scheduled',
        publicationTime: {
          lte: now
        }
      },
      include: {
        socialCredential: {
          include: {
            user: true
          }
        }
      }
    })

    // add to publish queue
    if (posts.length > 0) {
      for (const post of posts) {
        await addPostToPublishQueue({
          id: post.id,
          status: post.status,
          publicationTime: post.publicationTime.toISOString(),
          platform: post.platform,
          socialCredentialID: post.socialCredentialID,
          metadata: post.metadata as any
        })
      }
    }
  } catch (error) {
    console.log('Error when scheduling posts', error)
  }
}
