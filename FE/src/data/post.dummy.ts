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
