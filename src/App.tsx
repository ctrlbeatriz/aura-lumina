import { useState, useMemo, useEffect } from 'react'
import { DiaryProvider, useDiary } from './DiaryContext'
import { 
  PAIN_LEVELS, HEAD_REGIONS, SYMPTOMS, TRIGGERS, TRIGGER_CATEGORIES, 
  MOODS, SYMPTOM_ICONS 
} from './constants'
import { 
  formatDatePtBR, getGreeting, calculateDuration, cn, isSameDay, 
  eachDayOfMonth, getFirstDayOfMonth, getMonthName 
} from './utils'
import { PainLevel, HeadRegion, Symptom, Mood, Medication } from './types'
import {
  SunIcon, MoonIcon, CalendarIcon, ClockIcon, PlusIcon, TrashIcon, CheckIcon,
  ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, PillIcon,
  PenIcon, TrendingUpIcon, TrendingDownIcon, ActivityIcon, SaveIcon, RefreshIcon,
  XIcon, CheckCircleIcon, SparklesIcon, BrainIcon, MinusIcon
} from './Icons'

// ============================================
// TEMA
// ============================================
function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark(!dark) }
}

// ============================================
// COMPONENTES UI BASE
// ============================================
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-700', className)}>
    {children}
  </div>
)

const Button = ({ 
  children, onClick, disabled, variant = 'primary', className = '', size = 'md' 
}: { 
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
  className?: string
  size?: 'sm' | 'md' | 'icon'
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-4 py-2.5 rounded-xl',
    icon: 'w-10 h-10 rounded-full'
  }
  const variants = {
    primary: 'bg-violet-500 text-white hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500',
    outline: 'border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
  }
  
  return (
    <button onClick={onClick} disabled={disabled} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </button>
  )
}

const Input = ({ 
  type = 'text', value, onChange, placeholder, className = '' 
}: { 
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={cn(
      'w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600',
      'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500',
      'transition-all duration-200',
      className
    )}
  />
)

const Textarea = ({ 
  value, onChange, placeholder, className = '' 
}: { 
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={cn(
      'w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600',
      'bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-white dark:focus:bg-slate-700',
      'transition-all duration-200 resize-none min-h-[120px]',
      className
    )}
  />
)

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={cn(
      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
      checked 
        ? 'bg-violet-500 border-violet-500' 
        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
    )}
  >
    {checked && <CheckIcon className="w-3 h-3 text-white" />}
  </button>
)

const Chip = ({ 
  selected, onClick, children, className = '' 
}: { 
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) => (
  <button
    onClick={onClick}
    className={cn(
      'px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 border',
      selected
        ? 'bg-violet-500 text-white border-violet-500 shadow-md'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600',
      className
    )}
  >
    {children}
  </button>
)

// ============================================
// HEADER
// ============================================
function Header() {
  const { state } = useDiary()
  const { dark, toggle } = useTheme()
  const today = new Date()

  const last7Days = state.entries.filter(entry => {
    const entryDate = new Date(entry.date)
    const diffDays = Math.ceil(Math.abs(today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && entry.painLevel !== 'none'
  })

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{getGreeting()}</p>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Aura Lumina</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <CalendarIcon className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatDatePtBR(today)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className={cn(
              'h-2.5 w-2.5 rounded-full',
              last7Days.length > 3 ? 'bg-orange-500' : last7Days.length > 1 ? 'bg-yellow-500' : 'bg-green-500'
            )} />
            <span className="text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{last7Days.length}</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">crises esta semana</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

// ============================================
// PAIN SELECTOR
// ============================================
const painColors: Record<PainLevel, string> = {
  none: 'bg-green-400 border-green-500',
  light: 'bg-yellow-400 border-yellow-500',
  moderate: 'bg-orange-400 border-orange-500',
  intense: 'bg-orange-600 border-orange-700',
  severe: 'bg-red-500 border-red-600',
}

function PainSelector() {
  const { state, dispatch } = useDiary()
  const current = state.currentEntry.painLevel || 'none'

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Como está sua dor hoje?</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Selecione a intensidade da sua dor atual</p>
      <div className="grid grid-cols-5 gap-2">
        {PAIN_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => dispatch({ type: 'SET_PAIN_LEVEL', payload: level.value })}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95',
              current === level.value
                ? `${painColors[level.value]} text-white ring-2 ring-violet-500/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-900`
                : 'bg-slate-100 dark:bg-slate-700 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            <span className="text-2xl">{level.icon}</span>
            <span className="text-[10px] font-medium text-center leading-tight">
              {level.label.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}

// ============================================
// PAIN INTENSITY SLIDER
// ============================================
function PainIntensitySlider() {
  const { state, dispatch } = useDiary()
  const intensity = state.currentEntry.painIntensity || 0

  const getColor = (v: number) => {
    if (v <= 2) return 'from-green-400 to-green-500'
    if (v <= 4) return 'from-yellow-400 to-yellow-500'
    if (v <= 6) return 'from-orange-400 to-orange-500'
    if (v <= 8) return 'from-orange-600 to-red-500'
    return 'from-red-500 to-red-600'
  }

  const getLabel = (v: number) => {
    if (v === 0) return 'Sem dor'
    if (v <= 2) return 'Muito leve'
    if (v <= 4) return 'Leve a moderada'
    if (v <= 6) return 'Moderada'
    if (v <= 8) return 'Intensa'
    return 'Insuportável'
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Intensidade da dor</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">De 0 a 10, qual a intensidade?</p>
      
      <div className="flex flex-col items-center gap-4">
        <div className={cn('w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg', getColor(intensity))}>
          <span className="text-4xl font-bold text-white drop-shadow-md">{intensity}</span>
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{getLabel(intensity)}</p>
        
        <div className="w-full px-2">
          <input
            type="range"
            min="0"
            max="10"
            value={intensity}
            onChange={(e) => dispatch({ type: 'SET_PAIN_INTENSITY', payload: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>0</span><span>5</span><span>10</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================
// HEAD REGION SELECTOR
// ============================================
const regionPositions: Record<HeadRegion, { top: string; left: string }> = {
  'frontal': { top: '15%', left: '50%' },
  'temporal-left': { top: '40%', left: '15%' },
  'temporal-right': { top: '40%', left: '85%' },
  'behind-eyes': { top: '35%', left: '50%' },
  'top': { top: '5%', left: '50%' },
  'nape': { top: '75%', left: '50%' },
  'unilateral': { top: '55%', left: '20%' },
  'generalized': { top: '55%', left: '80%' },
}

function HeadRegionSelector() {
  const { state, dispatch } = useDiary()
  const selected = state.currentEntry.headRegions || []

  const toggle = (r: HeadRegion) => dispatch({ type: 'TOGGLE_HEAD_REGION', payload: r })

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Onde está a dor?</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Toque nas regiões afetadas</p>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative w-48 h-56 flex-shrink-0">
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            <ellipse cx="50" cy="45" rx="35" ry="40" className="fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
            <path d="M35 80 L35 100 Q35 110 50 110 Q65 110 65 100 L65 80" className="fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
            <ellipse cx="15" cy="45" rx="5" ry="10" className="fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
            <ellipse cx="85" cy="45" rx="5" ry="10" className="fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
            <circle cx="35" cy="40" r="4" className="fill-slate-400/30" />
            <circle cx="65" cy="40" r="4" className="fill-slate-400/30" />
            <path d="M50 45 L50 55 L45 60" className="stroke-slate-400/30" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>

          {Object.entries(regionPositions).map(([region, pos]) => {
            const isSelected = selected.includes(region as HeadRegion)
            return (
              <button
                key={region}
                onClick={() => toggle(region as HeadRegion)}
                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                className={cn(
                  'absolute w-6 h-6 rounded-full border-2 transition-all duration-200 active:scale-90',
                  isSelected
                    ? 'bg-violet-500 border-violet-500 shadow-lg shadow-violet-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-violet-500/50'
                )}
              />
            )
          })}
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-wrap gap-2">
            {HEAD_REGIONS.map((region) => (
              <Chip key={region.value} selected={selected.includes(region.value)} onClick={() => toggle(region.value)}>
                {region.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================
// SYMPTOMS SELECTOR
// ============================================
function SymptomsSelector() {
  const { state, dispatch } = useDiary()
  const selected = state.currentEntry.symptoms || []

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Sintomas associados</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Selecione todos os sintomas que está sentindo</p>

      <div className="flex flex-wrap gap-2">
        {SYMPTOMS.map((symptom) => (
          <Chip 
            key={symptom.value} 
            selected={selected.includes(symptom.value)} 
            onClick={() => dispatch({ type: 'TOGGLE_SYMPTOM', payload: symptom.value })}
          >
            <span className="mr-1.5">{SYMPTOM_ICONS[symptom.value]}</span>
            {symptom.label}
          </Chip>
        ))}
      </div>
    </Card>
  )
}

// ============================================
// TRIGGERS SELECTOR
// ============================================
function TriggersSelector() {
  const { state, dispatch } = useDiary()
  const selected = state.currentEntry.triggers || []
  const [expanded, setExpanded] = useState<string[]>(['hormonal', 'sleep'])

  const toggleCategory = (cat: string) => {
    setExpanded(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Fatores desencadeantes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">O que pode ter causado sua dor?</p>

      <div className="space-y-3">
        {TRIGGER_CATEGORIES.map((cat) => {
          const isExpanded = expanded.includes(cat.value)
          const triggers = TRIGGERS.filter(t => t.category === cat.value)
          const selectedCount = triggers.filter(t => selected.includes(t.id)).length

          return (
            <div key={cat.value} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.value)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{cat.label}</span>
                  {selectedCount > 0 && (
                    <span className="bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">{selectedCount}</span>
                  )}
                </div>
                <ChevronDownIcon className={cn('w-5 h-5 text-slate-500 transition-transform duration-200', isExpanded && 'rotate-180')} />
              </button>

              {isExpanded && (
                <div className="p-3 flex flex-wrap gap-2">
                  {triggers.map((trigger) => (
                    <Chip 
                      key={trigger.id} 
                      selected={selected.includes(trigger.id)}
                      onClick={() => dispatch({ type: 'TOGGLE_TRIGGER', payload: trigger.id })}
                      className="text-xs"
                    >
                      {trigger.label}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ============================================
// CRISIS TIMELINE
// ============================================
function CrisisTimeline() {
  const { state, dispatch } = useDiary()
  const startTime = state.currentEntry.startTime || ''
  const endTime = state.currentEntry.endTime || ''
  const duration = useMemo(() => calculateDuration(startTime, endTime), [startTime, endTime])

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Duração da crise</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Quando começou e terminou?</p>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Início</label>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => dispatch({ type: 'SET_TIME', payload: { field: 'startTime', value: e.target.value } })}
              className="pl-10"
            />
          </div>
        </div>

        <ArrowRightIcon className="w-5 h-5 text-slate-400 mt-5" />

        <div className="flex-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Fim</label>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => dispatch({ type: 'SET_TIME', payload: { field: 'endTime', value: e.target.value } })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {duration && (
        <div className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-violet-500/10 rounded-xl">
          <ClockIcon className="w-4 h-4 text-violet-500" />
          <span className="font-semibold text-violet-600 dark:text-violet-400">Duração: {duration}</span>
        </div>
      )}
    </Card>
  )
}

// ============================================
// MEDICATION TRACKER
// ============================================
function MedicationTracker() {
  const { state, dispatch } = useDiary()
  const medications = state.currentEntry.medications || []
  const [isAdding, setIsAdding] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', time: '', dosage: '' })

  const addMedication = () => {
    if (newMed.name.trim()) {
      const med: Medication = {
        id: Math.random().toString(36).substring(2),
        name: newMed.name,
        time: newMed.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dosage: newMed.dosage,
        relievedPain: false,
      }
      dispatch({ type: 'ADD_MEDICATION', payload: med })
      setNewMed({ name: '', time: '', dosage: '' })
      setIsAdding(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Medicação</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Registre os medicamentos tomados</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
          <PlusIcon className="w-4 h-4 mr-1" /> Adicionar
        </Button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600">
          <div className="space-y-3">
            <Input
              placeholder="Nome do medicamento"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                type="time"
                value={newMed.time}
                onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              />
              <Input
                placeholder="Dosagem"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancelar</Button>
              <Button size="sm" onClick={addMedication}><CheckIcon className="w-4 h-4 mr-1" /> Salvar</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {medications.map((med) => (
          <div
            key={med.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border transition-colors',
              med.relievedPain ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30">
              <PillIcon className="w-5 h-5 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{med.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{med.time} {med.dosage && `• ${med.dosage}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={med.relievedPain} 
                  onChange={() => dispatch({ type: 'UPDATE_MEDICATION', payload: { ...med, relievedPain: !med.relievedPain } })} 
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">Aliviou</span>
              </label>
              <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'REMOVE_MEDICATION', payload: med.id })} className="w-8 h-8 text-slate-400 hover:text-red-500">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {medications.length === 0 && !isAdding && (
          <div className="text-center py-6 text-slate-400">
            <PillIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum medicamento registrado</p>
          </div>
        )}
      </div>
    </Card>
  )
}

// ============================================
// MOOD SELECTOR
// ============================================
function MoodSelector() {
  const { state, dispatch } = useDiary()
  const selected = state.currentEntry.mood || []

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Como você está se sentindo?</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Selecione seu estado emocional</p>

      <div className="grid grid-cols-3 gap-2">
        {MOODS.map((mood) => {
          const isSelected = selected.includes(mood.value)
          return (
            <button
              key={mood.value}
              onClick={() => dispatch({ type: 'TOGGLE_MOOD', payload: mood.value })}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95',
                isSelected
                  ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{mood.label}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

// ============================================
// PERSONAL NOTES
// ============================================
function PersonalNotes() {
  const { state, dispatch } = useDiary()
  const notes = state.currentEntry.notes || ''

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <PenIcon className="w-5 h-5 text-violet-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Seu relato</h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Escreva mais sobre como foi sua crise hoje...</p>

      <Textarea
        placeholder="Hoje acordei com uma leve pressão na cabeça que foi aumentando ao longo da manhã..."
        value={notes}
        onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
      />
      <p className="text-xs text-slate-400 mt-2 text-right">{notes.length} caracteres</p>
    </Card>
  )
}

// ============================================
// INSIGHTS PANEL
// ============================================
function InsightsPanel() {
  const { state } = useDiary()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const entries = state.entries

  const stats = useMemo(() => {
    const now = new Date()
    const last30Days = entries.filter(e => {
      const d = new Date(e.date)
      const diff = Math.ceil(Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      return diff <= 30 && e.painLevel !== 'none'
    })
    const last7Days = entries.filter(e => {
      const d = new Date(e.date)
      const diff = Math.ceil(Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      return diff <= 7 && e.painLevel !== 'none'
    })

    const triggerCounts: Record<string, number> = {}
    last30Days.forEach(e => e.triggers.forEach(t => { triggerCounts[t] = (triggerCounts[t] || 0) + 1 }))
    const topTriggers = Object.entries(triggerCounts).sort(([,a],[,b]) => b - a).slice(0, 3).map(([id]) => TRIGGERS.find(t => t.id === id)?.label || id)

    const symptomCounts: Record<string, number> = {}
    last30Days.forEach(e => e.symptoms.forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1 }))
    const topSymptoms = Object.entries(symptomCounts).sort(([,a],[,b]) => b - a).slice(0, 3).map(([id]) => SYMPTOMS.find(s => s.value === id)?.label || id)

    const avgIntensity = last30Days.length > 0 ? Math.round(last30Days.reduce((s, e) => s + e.painIntensity, 0) / last30Days.length) : 0

    return { monthly: last30Days.length, weekly: last7Days.length, topTriggers, topSymptoms, avgIntensity }
  }, [entries])

  const calendarDays = useMemo(() => eachDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()), [currentMonth])
  const firstDayOfWeek = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())

  const getEntryForDay = (day: Date) => entries.find(e => isSameDay(new Date(e.date), day))

  const getPainColor = (level: PainLevel) => {
    const colors: Record<PainLevel, string> = {
      none: 'bg-green-400', light: 'bg-yellow-400', moderate: 'bg-orange-400', intense: 'bg-orange-600', severe: 'bg-red-500'
    }
    return colors[level]
  }

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + (dir === 'prev' ? -1 : 1))
      return d
    })
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUpIcon className="w-5 h-5 text-violet-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Insights</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3 text-center">
          <CalendarIcon className="w-4 h-4 text-violet-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.weekly}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Esta semana</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3 text-center">
          <ActivityIcon className="w-4 h-4 text-violet-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.monthly}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Este mês</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3 text-center">
          <ClockIcon className="w-4 h-4 text-violet-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.avgIntensity}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Intensidade média</p>
        </div>
      </div>

      {/* Calendário */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="w-8 h-8">
            <ChevronLeftIcon />
          </Button>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize">
            {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
          </h3>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="w-8 h-8">
            <ChevronRightIcon />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-xs font-medium text-slate-500 dark:text-slate-400 py-1">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
          {calendarDays.map((day) => {
            const entry = getEntryForDay(day)
            const isToday = isSameDay(day, new Date())
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-lg text-xs font-medium relative',
                  isToday && 'ring-2 ring-violet-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-800'
                )}
              >
                <span className="z-10 text-slate-700 dark:text-slate-200">{day.getDate()}</span>
                {entry && entry.painLevel !== 'none' && (
                  <div className={cn('absolute inset-1 rounded-md opacity-40', getPainColor(entry.painLevel))} />
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          {PAIN_LEVELS.filter(l => l.value !== 'none').map(l => (
            <div key={l.value} className="flex items-center gap-1">
              <div className={cn('w-3 h-3 rounded', painColors[l.value].split(' ')[0])} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {(stats.topTriggers.length > 0 || stats.topSymptoms.length > 0) && (
        <div className="space-y-3">
          {stats.topTriggers.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Gatilhos mais frequentes</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.topTriggers.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}
          {stats.topSymptoms.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Sintomas mais comuns</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.topSymptoms.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-6 text-slate-400">
          <ActivityIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Comece a registrar suas crises para ver insights</p>
        </div>
      )}
    </Card>
  )
}

// ============================================
// SUCCESS SCREEN
// ============================================
function SuccessScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state } = useDiary()
  
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  const monthEntries = state.entries.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  
  const crisesThisMonth = monthEntries.filter(e => e.painLevel !== 'none').length
  const daysPassed = today.getDate()
  const freeDays = daysPassed - crisesThisMonth
  const freePercentage = daysPassed > 0 ? Math.round((freeDays / daysPassed) * 100) : 100
  
  const avgIntensity = monthEntries.length > 0 
    ? Math.round(monthEntries.reduce((s, e) => s + (e.painIntensity || 0), 0) / monthEntries.length)
    : 0
  
  const medicationsUsed = monthEntries.reduce((c, e) => c + (e.medications?.length || 0), 0)
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const lastMonthCrises = state.entries.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear && e.painLevel !== 'none'
  }).length
  
  const trend = lastMonthCrises === 0 ? 'stable' : crisesThisMonth < lastMonthCrises ? 'improving' : crisesThisMonth > lastMonthCrises ? 'worsening' : 'stable'
  
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const freeOffset = circumference - (freePercentage / 100) * circumference

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <Button variant="ghost" size="icon" onClick={onClose}><XIcon /></Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4">
            <CheckCircleIcon className="w-10 h-10 text-violet-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Registro Salvo!</h2>
          <p className="text-slate-500 dark:text-slate-400">Seu check-in foi adicionado ao histórico</p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="w-5 h-5 text-violet-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resumo de {getMonthName(currentMonth)}</h3>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg width="180" height="180" className="transform -rotate-90">
                <circle cx="90" cy="90" r={radius} fill="none" stroke="currentColor" strokeWidth="16" className="text-slate-200 dark:text-slate-700" />
                <circle
                  cx="90" cy="90" r={radius} fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round"
                  className="text-violet-500 transition-all duration-1000"
                  strokeDasharray={circumference}
                  strokeDashoffset={freeOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{freePercentage}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">dias livres</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{freeDays}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Dias sem crise</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{crisesThisMonth}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Crises registradas</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <BrainIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Intensidade média</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{avgIntensity}/10</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <PillIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Medicações usadas</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{medicationsUsed}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Tendência</span>
              </div>
              <div className="flex items-center gap-1">
                {trend === 'improving' && <><TrendingDownIcon className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-500">Melhorando</span></>}
                {trend === 'worsening' && <><TrendingUpIcon className="w-4 h-4 text-orange-500" /><span className="text-sm font-semibold text-orange-500">Piorando</span></>}
                {trend === 'stable' && <><MinusIcon className="w-4 h-4 text-slate-400" /><span className="text-sm font-semibold text-slate-500">Estável</span></>}
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-8 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {freePercentage >= 70 
              ? "Excelente! Você está tendo mais dias livres de crise. Continue assim!"
              : freePercentage >= 50 
                ? "Bom trabalho mantendo o registro! Cada anotação ajuda a identificar padrões."
                : "Força! Manter o diário é o primeiro passo para entender suas crises."
            }
          </p>
        </Card>

        <Button onClick={onClose} className="w-full py-6 text-base font-semibold">
          Continuar
        </Button>
      </div>
    </div>
  )
}

// ============================================
// SAVE BUTTON
// ============================================
function SaveButton() {
  const { state, saveEntry, clearCurrent } = useDiary()
  const [showSuccess, setShowSuccess] = useState(false)
  
  const hasData = state.currentEntry.painLevel !== 'none' || 
    (state.currentEntry.symptoms && state.currentEntry.symptoms.length > 0) ||
    (state.currentEntry.triggers && state.currentEntry.triggers.length > 0) ||
    state.currentEntry.notes

  const handleSave = () => {
    saveEntry()
    setShowSuccess(true)
  }

  return (
    <>
      <div className="sticky bottom-4 flex gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <Button variant="outline" onClick={clearCurrent} disabled={!hasData} className="flex-1">
          <RefreshIcon className="w-4 h-4 mr-2" /> Limpar
        </Button>
        <Button onClick={handleSave} disabled={!hasData} className="flex-1">
          <SaveIcon className="w-4 h-4 mr-2" /> Salvar registro
        </Button>
      </div>
      <SuccessScreen isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  )
}

// ============================================
// APP PRINCIPAL
// ============================================
function DiaryApp() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="max-w-lg mx-auto px-4 pb-28">
        <div className="space-y-4 py-6">
          <PainSelector />
          <PainIntensitySlider />
          <HeadRegionSelector />
          <SymptomsSelector />
          <TriggersSelector />
          <CrisisTimeline />
          <MedicationTracker />
          <MoodSelector />
          <PersonalNotes />
          <InsightsPanel />
        </div>
        <SaveButton />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <DiaryProvider>
      <DiaryApp />
    </DiaryProvider>
  )
}
