export type PainLevel = 'none' | 'light' | 'moderate' | 'intense' | 'severe'

export type HeadRegion = 
  | 'frontal'
  | 'temporal-right'
  | 'temporal-left'
  | 'behind-eyes'
  | 'top'
  | 'nape'
  | 'unilateral'
  | 'generalized'

export type Symptom =
  | 'nausea'
  | 'light-sensitivity'
  | 'sound-sensitivity'
  | 'aura'
  | 'dizziness'
  | 'blurred-vision'
  | 'eye-pressure'
  | 'tingling'
  | 'fatigue'
  | 'mental-confusion'
  | 'irritability'
  | 'insomnia'
  | 'vomiting'
  | 'neck-stiffness'
  | 'pulsating'

export type TriggerCategory = 'hormonal' | 'sleep' | 'environmental' | 'psychological' | 'physical' | 'other'

export interface Trigger {
  id: string
  label: string
  category: TriggerCategory
}

export type Mood = 
  | 'calm'
  | 'anxious'
  | 'irritated'
  | 'sad'
  | 'tired'
  | 'sensitive'
  | 'discouraged'
  | 'well'
  | 'overwhelmed'

export interface Medication {
  id: string
  name: string
  time: string
  dosage: string
  relievedPain: boolean
}

export interface CrisisEntry {
  id: string
  date: string
  painLevel: PainLevel
  painIntensity: number
  headRegions: HeadRegion[]
  symptoms: Symptom[]
  triggers: string[]
  medications: Medication[]
  startTime: string
  endTime: string
  mood: Mood[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface DiaryState {
  entries: CrisisEntry[]
  currentEntry: Partial<CrisisEntry>
}
