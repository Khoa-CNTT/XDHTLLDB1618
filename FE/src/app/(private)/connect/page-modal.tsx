// import Link from 'next/link'
// import { Platform, PlatformType } from '@/constants/credentials'
// import { ExternalLink } from 'lucide-react'
// import { FaFacebook, FaInstagram, FaReddit } from 'react-icons/fa'

// import { Credential } from '@/types/credentials'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { ScrollArea } from '@/components/ui/scroll-area'

// export interface PageModalProps {
//   isModalOpen: boolean
//   setIsModalOpen: (isModalOpen: boolean) => void
//   platformId: PlatformType
//   selectedAccount: Credential | null
// }

// const getPlatformIcon = (id: PlatformType) => {
//   switch (id) {
//     case Platform.FACEBOOK:
//       return <FaFacebook className='size-5' />
//     case Platform.INSTAGRAM:
//       return <FaInstagram className='size-5' />
//     case Platform.REDDIT:
//       return <FaReddit className='size-5' />
//     default:
//       return null
//   }
// }

// export default function PageModal({ isModalOpen, setIsModalOpen, platformId, selectedAccount }: PageModalProps) {
//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogContent className='sm:max-w-[500px]'>
//         <DialogHeader>
//           <DialogTitle className='flex items-center gap-2'>
//             {getPlatformIcon(platformId)}
//             Pages for {selectedAccount?.metadata.page_name}
//           </DialogTitle>
//         </DialogHeader>
//         <ScrollArea className='max-h-[400px] mt-4'>
//           <div className='space-y-4'>
//             {selectedAccount?.pages.map((page) => (
//               <Link
//                 key={page.id}
//                 href={page.url}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors'
//               >
//                 <div>
//                   <h4 className='font-semibold'>{page.name}</h4>
//                   <p className='text-sm text-muted-foreground'>{page.type}</p>
//                 </div>
//                 <ExternalLink className='size-4 text-muted-foreground' />
//               </Link>
//             ))}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   )
// }
