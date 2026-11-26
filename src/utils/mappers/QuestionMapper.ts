import type { Answer } from '@/models/Answer.ts'
import type { Question } from '@/models/Question.ts'
import type { QuestionsResponse } from '@/models/QuestionsResponse.ts'

export function mapQuestions (responses: QuestionsResponse[]): Question[] {
  return responses.map(response => ({
    type: response.type,
    difficulty: response.difficulty,
    category: response.category,
    question: response.question,
    answers: response.answers.map((text): Answer => ({
      text,
      guessed: false,
      correct: null,
    })),
    verificationToken: response.verificationToken,
    correct: null,
    answered: false,
  }))
}
