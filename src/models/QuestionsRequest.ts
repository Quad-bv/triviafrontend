import type { Difficulty } from '@/models/enums/Difficulty.ts'
import type { QuestionType } from '@/models/enums/QuestionType.ts'

export interface QuestionsRequest {
  amount: number
  category?: number | null
  difficulty?: Difficulty | null
  type?: QuestionType | null
  token?: string | null
}
