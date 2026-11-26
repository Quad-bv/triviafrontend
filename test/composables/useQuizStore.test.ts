import type { Question } from '../../src/models/Question'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizStore } from '../../src/composables/useQuizStore'

describe('useQuizStore', () => {
  let quiz: ReturnType<typeof useQuizStore>

  const questions = [
    {
      type: 'multiple',
      difficulty: 'easy',
      category: 'Geography',
      question: 'What is the capital of France?',
      answers: [
        { text: 'Paris', guessed: false, correct: null },
        { text: 'London', guessed: false, correct: null },
      ],
      verificationToken: 'token-1',
      correct: null,
      answered: false,
    },
    {
      type: 'multiple',
      difficulty: 'medium',
      category: 'History',
      question: 'Who was the first president of the United States?',
      answers: [
        { text: 'George Washington', guessed: false, correct: null },
        { text: 'Abraham Lincoln', guessed: false, correct: null },
      ],
      verificationToken: 'token-2',
      correct: null,
      answered: false,
    },
  ] satisfies Question[]

  beforeEach(() => {
    setActivePinia(createPinia())
    quiz = useQuizStore()
  })

  describe('initialization', () => {
    it('initializes the store with an empty question list', () => {
      // Assert
      expect(quiz.questions).toEqual([])
      expect(quiz.currentQuestionIndex).toBe(0)
      expect(quiz.currentQuestion).toBeNull()
      expect(quiz.currentQuestionNumber).toBe(1)
    })
  })

  describe('setQuestions', () => {
    it('sets the questions and selects the first question', () => {
      // Act
      quiz.setQuestions(questions)

      // Assert
      expect(quiz.questions).toEqual(questions)
      expect(quiz.currentQuestionIndex).toBe(0)
      expect(quiz.currentQuestion).toEqual(questions[0])
      expect(quiz.currentQuestionNumber).toBe(1)
    })

    it('resets the current question index when new questions are set', () => {
      // Arrange
      quiz.setQuestions(questions)
      quiz.nextQuestion()

      // Act
      quiz.setQuestions([questions[1]])

      // Assert
      expect(quiz.currentQuestionIndex).toBe(0)
      expect(quiz.currentQuestion).toEqual(questions[1])
      expect(quiz.currentQuestionNumber).toBe(1)
    })

    it('clears the current question when an empty list is set', () => {
      // Arrange
      quiz.setQuestions(questions)

      // Act
      quiz.setQuestions([])

      // Assert
      expect(quiz.questions).toEqual([])
      expect(quiz.currentQuestion).toBeNull()
      expect(quiz.currentQuestionIndex).toBe(0)
    })
  })

  describe('setQuestionResult', () => {
    it.each([
      { correct: true, description: 'a correct answer' },
      { correct: false, description: 'an incorrect answer' },
    ])('records the result of $description', ({ correct }) => {
      // Arrange
      quiz.setQuestions(questions)

      // Act
      quiz.setQuestionResult(correct)

      // Assert
      expect(quiz.currentQuestion?.correct).toBe(correct)
      expect(quiz.currentQuestion?.answered).toBe(true)
    })

    it('does nothing when there is no current question', () => {
      // Act
      quiz.setQuestionResult(true)

      // Assert
      expect(quiz.questions).toEqual([])
      expect(quiz.currentQuestion).toBeNull()
    })
  })

  describe('nextQuestion', () => {
    it('moves to the next question', () => {
      // Arrange
      quiz.setQuestions(questions)

      // Act
      quiz.nextQuestion()

      // Assert
      expect(quiz.currentQuestionIndex).toBe(1)
      expect(quiz.currentQuestion).toEqual(questions[1])
      expect(quiz.currentQuestionNumber).toBe(2)
    })

    it('does not move beyond the last question', () => {
      // Arrange
      quiz.setQuestions(questions)
      quiz.nextQuestion()

      // Act
      quiz.nextQuestion()

      // Assert
      expect(quiz.currentQuestionIndex).toBe(1)
      expect(quiz.currentQuestion).toEqual(questions[1])
    })

    it('does not change the index when there are no questions', () => {
      // Act
      quiz.nextQuestion()

      // Assert
      expect(quiz.currentQuestionIndex).toBe(0)
      expect(quiz.currentQuestion).toBeNull()
    })
  })
})
