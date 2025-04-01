import { Post } from '@/types/post'

export const dummyPosts: Post[] = [
  {
    id: '1',
    status: 'scheduled',
    metadata: {
      page_name: 'Page 1',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 1 - Morning update about our new product launch.'
    },
    ownerID: '1',
    platform: 'facebook',
    publicationTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
    socialCredentialID: '1'
  },
  {
    id: '2',
    status: 'scheduled',
    metadata: {
      page_name: 'Page 1',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 1 - Afternoon tips for better productivity.'
    },
    ownerID: '1',
    platform: 'facebook',
    publicationTime: new Date(new Date().setHours(12, 0, 0)).toISOString(),
    socialCredentialID: '1'
  },
  {
    id: '3',
    status: 'scheduled',
    metadata: {
      page_name: 'Page 1',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 1 - Evening reflections on today’s accomplishments.'
    },
    ownerID: '1',
    platform: 'facebook',
    publicationTime: new Date(new Date().setHours(18, 0, 0)).toISOString(),
    socialCredentialID: '1'
  },

  {
    id: '4',
    status: 'published',
    metadata: {
      page_name: 'Page 2',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 2 - Morning workout routine tips.'
    },
    ownerID: '2',
    platform: 'facebook',
    publicationTime: new Date(new Date().setDate(new Date().getDate() - 1) + 3600000 * 8).toISOString(),
    socialCredentialID: '2'
  },
  {
    id: '5',
    status: 'published',
    metadata: {
      page_name: 'Page 2',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 2 - Recipe of the day: Healthy smoothies.'
    },
    ownerID: '2',
    platform: 'facebook',
    publicationTime: new Date(new Date().setDate(new Date().getDate() - 1) + 3600000 * 12).toISOString(),
    socialCredentialID: '2'
  },
  {
    id: '6',
    status: 'published',
    metadata: {
      page_name: 'Page 2',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 2 - Evening news highlights.'
    },
    ownerID: '2',
    platform: 'facebook',
    publicationTime: new Date(new Date().setDate(new Date().getDate() - 1) + 3600000 * 20).toISOString(),
    socialCredentialID: '2'
  },

  {
    id: '7',
    status: 'scheduled',
    metadata: {
      page_name: 'Page 3',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 3 - Morning inspirational quote.'
    },
    ownerID: '3',
    platform: 'facebook',
    publicationTime: new Date(new Date().setDate(new Date().getDate() + 1) + 3600000 * 8).toISOString(),
    socialCredentialID: '3'
  },
  {
    id: '8',
    status: 'scheduled',
    metadata: {
      page_name: 'Page 3',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 3 - Afternoon announcement of new services.'
    },
    ownerID: '3',
    platform: 'facebook',
    publicationTime: new Date(new Date().setDate(new Date().getDate() + 1) + 3600000 * 12).toISOString(),
    socialCredentialID: '3'
  },
  {
    id: '9',
    status: 'scheduled',
    metadata: {
      page_name: 'Page 3',
      type: 'POST',
      assets: [{ type: 'image', url: 'https://picsum.photos/500/500' }],
      content: 'Day 3 - Evening highlights from today’s events.'
    },
    ownerID: '3',
    platform: 'facebook',
    publicationTime: new Date(new Date().setDate(new Date().getDate() + 1) + 3600000 * 18).toISOString(),
    socialCredentialID: '3'
  }
]

export const dummyPostDetails: Post = {
  id: '1',
  ownerID: '1',
  platform: 'facebook',
  status: 'scheduled',
  publicationTime: '2024-02-01T22:46:00',
  socialCredentialID: '1',
  metadata: {
    page_name: 'Amazing Content Update',
    type: 'post',
    content:
      "This is a sample post description that shows all the details about this particular post. We're adding more content to make it look more realistic and engaging. #Content #SocialMedia",
    assets: [
      {
        type: 'image',
        url: 'https://picsum.photos/500/500'
      },
      {
        type: 'image',
        url: 'https://picsum.photos/500/500'
      },
      {
        type: 'image',
        url: 'https://picsum.photos/500/500'
      },
      {
        type: 'image',
        url: 'https://picsum.photos/500/500'
      }
    ]
  }
}

interface Comment {
  id: string
  author: {
    name: string
    image: string
  }
  content: string
  createdAt: Date
}

export const dummyComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'John Doe',
      image: 'https://picsum.photos/500/500'
    },
    content: 'Great post! Looking forward to more content like this.',
    createdAt: new Date('2024-02-01T23:00:00')
  },
  {
    id: '2',
    author: {
      name: 'Jane Smith',
      image: 'https://picsum.photos/500/500'
    },
    content: 'This is exactly what I needed to read today. Thanks for sharing!',
    createdAt: new Date('2024-02-02T10:15:00')
  }
]
