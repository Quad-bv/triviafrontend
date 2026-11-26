import {
  mapDifficultyOptions,
  mapQuestionTypeOptions,
} from '@/utils/mappers/QuizOptionsMapper'

export function useQuizOptions () {
  return {
    difficultyOptions: mapDifficultyOptions(),
    questionTypeOptions: mapQuestionTypeOptions(),
  }
}
