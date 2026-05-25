import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react'
import { supabase } from './supabaseClient'
import { CrisisEntry, DiaryState, PainLevel, HeadRegion, Symptom, Mood, Medication } from './types'

type DiaryAction =
  | { type: 'LOAD_ENTRIES'; payload: CrisisEntry[] }
  | { type: 'SET_PAIN_LEVEL'; payload: PainLevel }
  | { type: 'SET_PAIN_INTENSITY'; payload: number }
  | { type: 'TOGGLE_HEAD_REGION'; payload: HeadRegion }
  | { type: 'TOGGLE_SYMPTOM'; payload: Symptom }
  | { type: 'TOGGLE_TRIGGER'; payload: string }
  | { type: 'TOGGLE_MOOD'; payload: Mood }
  | { type: 'ADD_MEDICATION'; payload: Medication }
  | { type: 'REMOVE_MEDICATION'; payload: string }
  | { type: 'UPDATE_MEDICATION'; payload: Medication }
  | { type: 'SET_TIME'; payload: { field: 'startTime' | 'endTime'; value: string } }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SAVE_ENTRY' }
  | { type: 'CLEAR_CURRENT' }
  | { type: 'DELETE_ENTRY'; payload: string }

const initialState: DiaryState = {
  entries: [],
  currentEntry: {
    painLevel: 'none',
    painIntensity: 0,
    headRegions: [],
    symptoms: [],
    triggers: [],
    medications: [],
    mood: [],
    notes: '',
    startTime: '',
    endTime: '',
  },
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function diaryReducer(state: DiaryState, action: DiaryAction): DiaryState {
  switch (action.type) {
    case 'LOAD_ENTRIES':
      return { ...state, entries: action.payload }
    
    case 'SET_PAIN_LEVEL':
      return { ...state, currentEntry: { ...state.currentEntry, painLevel: action.payload } }
    
    case 'SET_PAIN_INTENSITY':
      return { ...state, currentEntry: { ...state.currentEntry, painIntensity: action.payload } }
    
    case 'TOGGLE_HEAD_REGION': {
      const regions = state.currentEntry.headRegions || []
      const newRegions = regions.includes(action.payload)
        ? regions.filter(r => r !== action.payload)
        : [...regions, action.payload]
      return { ...state, currentEntry: { ...state.currentEntry, headRegions: newRegions } }
    }
    
    case 'TOGGLE_SYMPTOM': {
      const symptoms = state.currentEntry.symptoms || []
      const newSymptoms = symptoms.includes(action.payload)
        ? symptoms.filter(s => s !== action.payload)
        : [...symptoms, action.payload]
      return { ...state, currentEntry: { ...state.currentEntry, symptoms: newSymptoms } }
    }
    
    case 'TOGGLE_TRIGGER': {
      const triggers = state.currentEntry.triggers || []
      const newTriggers = triggers.includes(action.payload)
        ? triggers.filter(t => t !== action.payload)
        : [...triggers, action.payload]
      return { ...state, currentEntry: { ...state.currentEntry, triggers: newTriggers } }
    }
    
    case 'TOGGLE_MOOD': {
      const moods = state.currentEntry.mood || []
      const newMoods = moods.includes(action.payload)
        ? moods.filter(m => m !== action.payload)
        : [...moods, action.payload]
      return { ...state, currentEntry: { ...state.currentEntry, mood: newMoods } }
    }
    
    case 'ADD_MEDICATION':
      return {
        ...state,
        currentEntry: {
          ...state.currentEntry,
          medications: [...(state.currentEntry.medications || []), action.payload],
        },
      }
    
    case 'REMOVE_MEDICATION':
      return {
        ...state,
        currentEntry: {
          ...state.currentEntry,
          medications: (state.currentEntry.medications || []).filter(m => m.id !== action.payload),
        },
      }
    
    case 'UPDATE_MEDICATION':
      return {
        ...state,
        currentEntry: {
          ...state.currentEntry,
          medications: (state.currentEntry.medications || []).map(m =>
            m.id === action.payload.id ? action.payload : m
          ),
        },
      }
    
    case 'SET_TIME':
      return { ...state, currentEntry: { ...state.currentEntry, [action.payload.field]: action.payload.value } }
    
    case 'SET_NOTES':
      return { ...state, currentEntry: { ...state.currentEntry, notes: action.payload } }
    
    case 'SAVE_ENTRY': {
      // Salva no Supabase de forma assíncrona
      (async () => {
        const now = new Date().toISOString()
        const newEntry: CrisisEntry = {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          painLevel: state.currentEntry.painLevel || 'none',
          painIntensity: state.currentEntry.painIntensity || 0,
          headRegions: state.currentEntry.headRegions || [],
          symptoms: state.currentEntry.symptoms || [],
          triggers: state.currentEntry.triggers || [],
          medications: state.currentEntry.medications || [],
          startTime: state.currentEntry.startTime || '',
          endTime: state.currentEntry.endTime || '',
          mood: state.currentEntry.mood || [],
          notes: state.currentEntry.notes || '',
          createdAt: now,
          updatedAt: now,
        }
        await supabase.from('diar').insert([
          {
            date: newEntry.date,
            pain_level: newEntry.painLevel,
            pain_intensity: newEntry.painIntensity,
            head_regions: newEntry.headRegions,
            symptoms: newEntry.symptoms,
            triggers: newEntry.triggers,
            medications: newEntry.medications,
            start_time: newEntry.startTime,
            end_time: newEntry.endTime,
            mood: newEntry.mood,
            notes: newEntry.notes
          }
        ])
      })()
      // Atualiza o estado local imediatamente
      const now = new Date().toISOString()
      const newEntry: CrisisEntry = {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        painLevel: state.currentEntry.painLevel || 'none',
        painIntensity: state.currentEntry.painIntensity || 0,
        headRegions: state.currentEntry.headRegions || [],
        symptoms: state.currentEntry.symptoms || [],
        triggers: state.currentEntry.triggers || [],
        medications: state.currentEntry.medications || [],
        startTime: state.currentEntry.startTime || '',
        endTime: state.currentEntry.endTime || '',
        mood: state.currentEntry.mood || [],
        notes: state.currentEntry.notes || '',
        createdAt: now,
        updatedAt: now,
      }
      const newEntries = [newEntry, ...state.entries]
      return { ...state, entries: newEntries, currentEntry: initialState.currentEntry }
    }
    
    case 'CLEAR_CURRENT':
      return { ...state, currentEntry: initialState.currentEntry }
    
    case 'DELETE_ENTRY': {
      // Remove do Supabase de forma assíncrona
      (async () => {
        await supabase.from('diar').delete().eq('id', action.payload)
      })()
      const newEntries = state.entries.filter(e => e.id !== action.payload)
      return { ...state, entries: newEntries }
    }
    
    default:
      return state
  }
}

interface DiaryContextType {
  state: DiaryState
  dispatch: React.Dispatch<DiaryAction>
  saveEntry: () => void
  clearCurrent: () => void
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined)

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(diaryReducer, initialState)

  useEffect(() => {
    // Busca os registros do Supabase ao iniciar
    (async () => {
      const { data, error } = await supabase
        .from('diar')
        .select('*')
        .order('date', { ascending: false })
      if (error) {
        console.error('Erro ao carregar entradas do Supabase:', error)
        return
      }
      if (data) {
        dispatch({ type: 'LOAD_ENTRIES', payload: data })
      }
    })()
  }, [])

  const saveEntry = useCallback(() => dispatch({ type: 'SAVE_ENTRY' }), [])
  const clearCurrent = useCallback(() => dispatch({ type: 'CLEAR_CURRENT' }), [])

  return (
    <DiaryContext.Provider value={{ state, dispatch, saveEntry, clearCurrent }}>
      {children}
    </DiaryContext.Provider>
  )
}

export function useDiary() {
  const context = useContext(DiaryContext)
  if (!context) throw new Error('useDiary must be used within DiaryProvider')
  return context
}
