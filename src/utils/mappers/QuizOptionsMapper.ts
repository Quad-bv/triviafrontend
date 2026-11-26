import { Difficulty } from '@/models/enums/Difficulty'
import { QuestionType } from '@/models/enums/QuestionType'
import { difficultyLabels, questionTypeLabels } from '@/utils/mappers/QuizOptionLabelsMapper.ts'

export function mapDifficultyOptions () {
  return [
    { title: 'Any', value: 'any' },
    ...Object.values(Difficulty).map(value => ({
      title: difficultyLabels[value],
      value,
    })),
  ]
}

export function mapQuestionTypeOptions () {
  return [
    { title: 'Random', value: 'random' },
    ...Object.values(QuestionType).map(value => ({
      title: questionTypeLabels[value],
      value,
    })),
  ]
}
