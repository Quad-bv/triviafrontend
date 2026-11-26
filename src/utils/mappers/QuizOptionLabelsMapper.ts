import { Difficulty } from '@/models/enums/Difficulty'
import { QuestionType } from '@/models/enums/QuestionType'

export const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'Easy',
  [Difficulty.MEDIUM]: 'Medium',
  [Difficulty.HARD]: 'Hard',
}

export const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.MULTIPLE]: 'Multiple choice',
  [QuestionType.BOOLEAN]: 'True / False',
}
