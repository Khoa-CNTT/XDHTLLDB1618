const configs = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL as string,
  nextServerUrl: process.env.NEXT_PUBLIC_NEXT_SERVER as string,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
  fbAppId: (process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string) || '',
  fbAppVer: (process.env.NEXT_PUBLIC_FACEBOOK_VERSION as string) || 'v22.0',
  redditAppId: (process.env.NEXT_PUBLIC_REDDIT_ID as string) || '',
  redditSecret: (process.env.NEXT_PUBLIC_REDDIT_SECRET as string) || '',
  returnUrl: (process.env.NEXT_PUBLIC_RETURN_URL as string) || '',
  threadAppId: (process.env.NEXT_PUBLIC_THREADS_APP_ID as string) || '',
  geminiApiKey: (process.env.NEXT_PUBLIC_GEMINI_API_KEY as string) || '',
  xClientId: (process.env.NEXT_PUBLIC_X_CLIENT_ID as string) || '',
  xClientSecret: (process.env.NEXT_PUBLIC_X_CLIENT_SECRET as string) || '',
  xCodeVerifierString: (process.env.NEXT_PUBLIC_X_CODE_VERIFIER_STRING as string) || ''
}

export default configs
