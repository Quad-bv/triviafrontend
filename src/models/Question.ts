import type { Answer } from '@/models/Answer'
import type { Difficulty } from '@/models/enums/Difficulty.ts'
import type { QuestionType } from '@/models/enums/QuestionType.ts'

export interface Question {
  type: QuestionType
  difficulty: Difficulty
  category: string
  question: string
  answers: Answer[]
  verificationToken: string
  correct: boolean | null
  answered: boolean
}
