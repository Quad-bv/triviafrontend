import type { Difficulty } from '@/models/enums/Difficulty.ts'
import type { QuestionType } from '@/models/enums/QuestionType.ts'

export interface QuestionsResponse {
  type: QuestionType
  difficulty: Difficulty
  category: string
  question: string
  verificationToken: string
  answers: string[]
}
