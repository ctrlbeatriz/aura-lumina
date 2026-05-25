import { Symptom, Trigger, Mood, HeadRegion, PainLevel } from './types'

export const PAIN_LEVELS: { value: PainLevel; label: string; color: string; icon: string }[] = [
  { value: 'none', label: 'Sem dor', color: 'bg-green-400', icon: '😌' },
  { value: 'light', label: 'Dor leve', color: 'bg-yellow-400', icon: '😐' },
  { value: 'moderate', label: 'Dor moderada', color: 'bg-orange-400', icon: '😣' },
  { value: 'intense', label: 'Dor intensa', color: 'bg-orange-600', icon: '😫' },
  { value: 'severe', label: 'Crise severa', color: 'bg-red-500', icon: '😭' },
]

export const HEAD_REGIONS: { value: HeadRegion; label: string }[] = [
  { value: 'frontal', label: 'Frontal' },
  { value: 'temporal-right', label: 'Temporal direita' },
  { value: 'temporal-left', label: 'Temporal esquerda' },
  { value: 'behind-eyes', label: 'Atrás dos olhos' },
  { value: 'top', label: 'Topo da cabeça' },
  { value: 'nape', label: 'Nuca' },
  { value: 'unilateral', label: 'Unilateral' },
  { value: 'generalized', label: 'Generalizada' },
]

export const SYMPTOMS: { value: Symptom; label: string }[] = [
  { value: 'nausea', label: 'Náusea' },
  { value: 'light-sensitivity', label: 'Sensibilidade à luz' },
  { value: 'sound-sensitivity', label: 'Sensibilidade ao som' },
  { value: 'aura', label: 'Aura' },
  { value: 'dizziness', label: 'Tontura' },
  { value: 'blurred-vision', label: 'Visão embaçada' },
  { value: 'eye-pressure', label: 'Pressão ocular' },
  { value: 'tingling', label: 'Formigamento' },
  { value: 'fatigue', label: 'Fadiga' },
  { value: 'mental-confusion', label: 'Confusão mental' },
  { value: 'irritability', label: 'Irritabilidade' },
  { value: 'insomnia', label: 'Insônia' },
  { value: 'vomiting', label: 'Vômito' },
  { value: 'neck-stiffness', label: 'Rigidez no pescoço' },
  { value: 'pulsating', label: 'Sensação pulsante' },
]

export const TRIGGERS: Trigger[] = [
  { id: 'pms', label: 'TPM', category: 'hormonal' },
  { id: 'menstruation', label: 'Menstruação', category: 'hormonal' },
  { id: 'ovulation', label: 'Ovulação', category: 'hormonal' },
  { id: 'hormonal-changes', label: 'Alterações hormonais', category: 'hormonal' },
  { id: 'slept-little', label: 'Dormi pouco', category: 'sleep' },
  { id: 'slept-too-much', label: 'Dormi demais', category: 'sleep' },
  { id: 'irregular-sleep', label: 'Sono irregular', category: 'sleep' },
  { id: 'insomnia-trigger', label: 'Insônia', category: 'sleep' },
  { id: 'bright-light', label: 'Luz forte', category: 'environmental' },
  { id: 'heat', label: 'Calor', category: 'environmental' },
  { id: 'cold', label: 'Frio', category: 'environmental' },
  { id: 'strong-smell', label: 'Cheiro forte', category: 'environmental' },
  { id: 'noise', label: 'Barulho', category: 'environmental' },
  { id: 'screen-time', label: 'Tela excessiva', category: 'environmental' },
  { id: 'weather-change', label: 'Mudança climática', category: 'environmental' },
  { id: 'anxiety', label: 'Ansiedade', category: 'psychological' },
  { id: 'stress', label: 'Estresse', category: 'psychological' },
  { id: 'mental-overload', label: 'Sobrecarga mental', category: 'psychological' },
  { id: 'emotional-crisis', label: 'Crise emocional', category: 'psychological' },
  { id: 'intense-exercise', label: 'Exercício intenso', category: 'physical' },
  { id: 'bad-posture', label: 'Má postura', category: 'physical' },
  { id: 'fasting', label: 'Jejum', category: 'physical' },
  { id: 'dehydration', label: 'Desidratação', category: 'physical' },
  { id: 'food', label: 'Alimentação', category: 'other' },
  { id: 'caffeine', label: 'Cafeína', category: 'other' },
  { id: 'alcohol', label: 'Álcool', category: 'other' },
  { id: 'medication', label: 'Medicamentos', category: 'other' },
  { id: 'other', label: 'Outro fator', category: 'other' },
]

export const TRIGGER_CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'hormonal', label: 'Hormonal', icon: '🌸' },
  { value: 'sleep', label: 'Sono', icon: '😴' },
  { value: 'environmental', label: 'Ambiental', icon: '🌍' },
  { value: 'psychological', label: 'Psicológico', icon: '🧠' },
  { value: 'physical', label: 'Físico', icon: '💪' },
  { value: 'other', label: 'Outros', icon: '📝' },
]

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'calm', label: 'Calma', emoji: '😌' },
  { value: 'anxious', label: 'Ansiosa', emoji: '😰' },
  { value: 'irritated', label: 'Irritada', emoji: '😤' },
  { value: 'sad', label: 'Triste', emoji: '😢' },
  { value: 'tired', label: 'Cansada', emoji: '😴' },
  { value: 'sensitive', label: 'Sensível', emoji: '🥺' },
  { value: 'discouraged', label: 'Desanimada', emoji: '😔' },
  { value: 'well', label: 'Bem', emoji: '😊' },
  { value: 'overwhelmed', label: 'Sobrecarregada', emoji: '😵' },
]

export const SYMPTOM_ICONS: Record<Symptom, string> = {
  'nausea': '🤢',
  'light-sensitivity': '💡',
  'sound-sensitivity': '🔊',
  'aura': '✨',
  'dizziness': '😵‍💫',
  'blurred-vision': '👁️',
  'eye-pressure': '👀',
  'tingling': '⚡',
  'fatigue': '😴',
  'mental-confusion': '🌀',
  'irritability': '😤',
  'insomnia': '🌙',
  'vomiting': '🤮',
  'neck-stiffness': '🦴',
  'pulsating': '💗',
}
