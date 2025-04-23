import { useReducer } from 'react'
import { useGenAI } from '@/queries/genAI'
import { GenAISettingSchema } from '@/schema-validations/genAI'
import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowUpWideNarrow,
  RefreshCcw,
  Settings,
  Sparkles,
  SpellCheck
} from 'lucide-react'
import { flushSync } from 'react-dom'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import AiSetting from './ai-setting'

// Types
interface Props {
  onContentChange: (text: string) => void
  text?: string
}

interface State {
  open: boolean
  step: number
  settings: GenAISettingSchema
  generatedContent?: string
}

type Action =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GenAISettingSchema> }
  | { type: 'RESET' }
  | { type: 'UPDATE_GENERATED_CONTENT'; payload: string }

// Custom Hook
const useAIDialog = (onContentChange: (text: string) => void, text?: string) => {
  const initialState: State = {
    open: false,
    step: 1,
    settings: {},
    generatedContent: text
  }

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'SET_OPEN':
        return { ...state, open: action.payload }
      case 'SET_STEP':
        return { ...state, step: action.payload }
      case 'UPDATE_SETTINGS':
        return { ...state, settings: { ...state.settings, ...action.payload } }
      case 'RESET':
        return initialState
      case 'UPDATE_GENERATED_CONTENT':
        return { ...state, generatedContent: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const genAI = useGenAI()

  const generatePrompt = (settings: GenAISettingSchema) => `
    Tone: ${settings.tone}
    Use Emojis: ${settings.isUseEmoji ? 'Yes' : 'No'}
    Use Hashtags: ${settings.isUseHashtags ? 'Yes' : 'No'}
    Specific Hashtags: #Lunaria, #Candle
    User Description: ${settings.userDescription}
    Post Topic: ${settings.responseFormat}
  `

  const generatePromptWithSettings = (action: string, content: string) => `
    Action: ${action}
    Content: ${content}
    Tone: ${state.settings.tone || 'professional'}
    Use Emojis: ${state.settings.isUseEmoji ? 'Yes' : 'No'}
    Use Hashtags: ${state.settings.isUseHashtags ? 'Yes' : 'No'}
    Specific Hashtags: #Lunaria, #Candle
  `

  const handleOpenChange = (isOpen: boolean) => {
    dispatch({ type: 'SET_OPEN', payload: isOpen })
    if (!isOpen) {
      flushSync(() => {
        dispatch({ type: 'RESET' })
      })
    }
  }

  const handleGeneratePost = async () => {
    try {
      const prompt = generatePrompt(state.settings)
      genAI.mutate(
        { data: prompt },
        {
          onSuccess: (data) => {
            const content = String(data)
            dispatch({ type: 'UPDATE_GENERATED_CONTENT', payload: content })
            onContentChange(content)
          }
        }
      )
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const handleRewrite = async () => {
    if (!state.generatedContent) return
    const prompt = generatePromptWithSettings(
      'Rewrite this text in a different way but keep the same meaning',
      state.generatedContent
    )
    genAI.mutate(
      { data: prompt },
      {
        onSuccess: (data) => {
          const content = String(data)
          onContentChange(content)
        }
      }
    )
  }

  const handleMakeLonger = async () => {
    if (!state.generatedContent) return
    const prompt = generatePromptWithSettings('Make this text longer with more details', state.generatedContent)
    genAI.mutate(
      { data: prompt },
      {
        onSuccess: (data) => {
          const content = String(data)
          onContentChange(content)
        }
      }
    )
  }

  const handleMakeShorter = async () => {
    if (!state.generatedContent) return
    const prompt = generatePromptWithSettings('Make this text shorter', state.generatedContent)
    genAI.mutate(
      { data: prompt },
      {
        onSuccess: (data) => {
          const content = String(data)
          onContentChange(content)
        }
      }
    )
  }

  const handleFixGrammar = async () => {
    if (!state.generatedContent) return
    const prompt = generatePromptWithSettings('Fix the grammar and improve the writing', state.generatedContent)
    genAI.mutate(
      { data: prompt },
      {
        onSuccess: (data) => {
          const content = String(data)
          onContentChange(content)
        }
      }
    )
  }

  return {
    state,
    dispatch,
    handleOpenChange,
    handleGeneratePost,
    handleRewrite,
    handleMakeLonger,
    handleMakeShorter,
    handleFixGrammar,
    isGenerating: genAI.isPending
  }
}

// UI Components
const ActionButtons = ({
  onGenerate,
  onRewrite,
  onMakeLonger,
  onMakeShorter,
  onFixGrammar,
  isGenerating,
  hasGeneratedContent
}: {
  onGenerate: () => void
  onRewrite: () => void
  onMakeLonger: () => void
  onMakeShorter: () => void
  onFixGrammar: () => void
  isGenerating: boolean
  hasGeneratedContent: boolean
}) => (
  <div className='space-y-3'>
    {hasGeneratedContent && (
      <div className='flex items-center gap-2'>
        <Button className='rounded-3xl' variant='outline' onClick={onRewrite} disabled={isGenerating}>
          <RefreshCcw />
          Rewrite
        </Button>
        <Button className='rounded-3xl' variant='outline' onClick={onMakeLonger} disabled={isGenerating}>
          <ArrowUpWideNarrow />
          Longer
        </Button>
        <Button className='rounded-3xl' variant='outline' onClick={onMakeShorter} disabled={isGenerating}>
          <ArrowDownWideNarrow />
          Shorter
        </Button>
        <Button className='rounded-3xl' variant='outline' onClick={onFixGrammar} disabled={isGenerating}>
          <SpellCheck />
          Fix grammar
        </Button>
      </div>
    )}
    <Button disabled={isGenerating} className='w-full' onClick={onGenerate}>
      <Sparkles />
      {isGenerating ? 'Generating...' : 'Generate'}
    </Button>
  </div>
)

const Disclaimer = () => (
  <span className='text-gray-500 text-xs italic mt-6 inline-block'>
    AI Assistant can generate inaccurate or misleading information. Always review generated content before posting.
  </span>
)

// Main Component
const AIDialog = ({ onContentChange, text }: Props) => {
  const {
    state,
    dispatch,
    handleOpenChange,
    handleGeneratePost,
    handleRewrite,
    handleMakeLonger,
    handleMakeShorter,
    handleFixGrammar,
    isGenerating
  } = useAIDialog(onContentChange, text)

  return (
    <Popover open={state.open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Sparkles className='text-yellow-400 size-5' />
      </PopoverTrigger>
      <PopoverContent className='w-[600px]' align='start'>
        <div className='flex justify-between items-center w-full mb-4'>
          <ArrowLeft
            onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
            className={`size-4 cursor-pointer ${state.step === 1 && 'opacity-0'}`}
          />
          <span className='text-center'>AI Generator</span>
          <Settings
            onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
            className={`size-4 cursor-pointer ${state.step === 2 && 'opacity-0'}`}
          />
        </div>

        <div className='py-2'>
          {state.step === 1 ? (
            <div className='space-y-3'>
              <p className='font-semibold'>Describe the post you are submitting to generate ideas</p>
              <Textarea
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { userDescription: e.target.value } })}
                placeholder='e.g. Promote my blog post about the best trekking tour'
                value={state.settings.userDescription || ''}
              />
              <ActionButtons
                onGenerate={handleGeneratePost}
                onRewrite={handleRewrite}
                onMakeLonger={handleMakeLonger}
                onMakeShorter={handleMakeShorter}
                onFixGrammar={handleFixGrammar}
                isGenerating={isGenerating}
                hasGeneratedContent={!!state.generatedContent}
              />
              <Disclaimer />
            </div>
          ) : (
            <AiSetting
              setStep={(step) => dispatch({ type: 'SET_STEP', payload: step as number })}
              setSettings={(settings) =>
                dispatch({
                  type: 'UPDATE_SETTINGS',
                  payload: settings as Partial<{
                    tone?: string | undefined
                    isUseEmoji?: boolean | undefined
                    isUseHashtags?: boolean | undefined
                    responseFormat?: string | undefined
                    userDescription?: string | undefined
                  }>
                })
              }
              currentSettings={state.settings}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AIDialog
