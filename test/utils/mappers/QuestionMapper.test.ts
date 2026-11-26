import type { QuestionsResponse } from '../../../src/models/QuestionsResponse'
import { describe, expect, it } from 'vitest'
import { Difficulty } from '../../../src/models/enums/Difficulty'
import { QuestionType } from '../../../src/models/enums/QuestionType'
import { mapQuestions } from '../../../src/utils/mappers/QuestionMapper'

describe('QuestionMapper', () => {
  it.each(questionScenarios())(
    'maps a question correctly',
    scenario => {
      // Arrange
      const responses = [scenario.response]

      // Act
      const result = mapQuestions(responses)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(scenario.expected)
    },
  )
})

function questionScenarios (): QuestionScenario[] {
  return [
    {
      response: {
        type: QuestionType.MULTIPLE,
        difficulty: Difficulty.HARD,
        category: 'General Knowledge',
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Berlin', 'Madrid'],
        verificationToken: 'verification-token',
      },
      expected: {
        type: QuestionType.MULTIPLE,
        difficulty: Difficulty.HARD,
        category: 'General Knowledge',
        question: 'What is the capital of France?',
        answers: [
          { text: 'Paris', guessed: false, correct: null },
          { text: 'London', guessed: false, correct: null },
          { text: 'Berlin', guessed: false, correct: null },
          { text: 'Madrid', guessed: false, correct: null },
        ],
        verificationToken: 'verification-token',
        correct: null,
        answered: false,
      },
    },
    {
      response: {
        type: QuestionType.BOOLEAN,
        difficulty: Difficulty.EASY,
        category: 'General Knowledge',
        question: 'The Earth is round.',
        answers: ['True', 'False'],
        verificationToken: 'another-token',
      },
      expected: {
        type: QuestionType.BOOLEAN,
        difficulty: Difficulty.EASY,
        category: 'General Knowledge',
        question: 'The Earth is round.',
        answers: [
          { text: 'True', guessed: false, correct: null },
          { text: 'False', guessed: false, correct: null },
        ],
        verificationToken: 'another-token',
        correct: null,
        answered: false,
      },
    },
  ]
}

interface QuestionScenario {
  response: QuestionsResponse
  expected: {
    type: QuestionType
    difficulty: Difficulty
    category: string
    question: string
    answers: {
      text: string
      guessed: boolean
      correct: boolean | null
    }[]
    verificationToken: string
    correct: boolean | null
    answered: boolean
  }
}
