import { FaFacebook, FaInstagram, FaReddit } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { RiTwitterXLine } from 'react-icons/ri'

export const toCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateCodeVerifier(): string {
  let randomString = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  for (let i = 0; i < 128; i++) {
    randomString += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return randomString
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  function base64encode(arrayBuffer: ArrayBuffer): string {
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  const hashed = await sha256(codeVerifier)
  return base64encode(hashed)
}

export const generatePkcePair = async (): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  return {
    codeVerifier,
    codeChallenge
  }
}

export const getIconPlatform = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return FaFacebook
    case 'instagram':
      return FaInstagram
    case 'threads':
      return FaThreads
    case 'x':
      return RiTwitterXLine
    case 'reddit':
      return FaReddit
  }
}
