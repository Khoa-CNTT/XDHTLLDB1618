import { redirect } from 'next/navigation'
import path from '@/constants/path'

export default function Post() {
  return redirect(path.posts_facebook)
}
