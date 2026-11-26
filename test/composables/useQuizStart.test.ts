import type { QuizStartData } from '../../src/models/QuizStartData'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useQuizStart } from '../../src/composables/useQuizStart'
import { useQuizStore } from '../../src/composables/useQuizStore'
import { questionsServiceKey } from '../../src/services/ServiceKeys'

describe('useQuizStart', () => {
  let quiz: ReturnType<typeof useQuizStore>
  let getQuestions: ReturnType<typeof vi.fn>
  let wrappers: VueWrapper[]

  const startData: QuizStartData = {
    amount: 10,
    difficulty: 'easy',
    type: 'multiple',
  }

  function mountComposable () {
    let result!: ReturnType<typeof useQuizStart>

    const TestComponent = defineComponent({
      setup () {
        result = useQuizStart()
        return () => null
      },
    })

    const wrapper = mount(TestComponent, {
      global: {
        provide: {
          [questionsServiceKey as symbol]: { getQuestions },
        },
      },
    })

    wrappers.push(wrapper)

    return result
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    quiz = useQuizStore()
    getQuestions = vi.fn()
    wrappers = []
  })

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
  })

  describe('initialization', () => {
    it('initializes loading and error state', () => {
      // Arrange
      const result = mountComposable()

      // Assert
      expect(result.loading.value).toBe(false)
      expect(result.error.value).toBeNull()
    })
  })

  describe('startQuiz', () => {
    it('requests questions with the provided quiz options', async () => {
      // Arrange
      getQuestions.mockResolvedValue([])
      const result = mountComposable()

      // Act
      await result.startQuiz(startData)

      // Assert
      expect(getQuestions).toHaveBeenCalledWith({
        amount: 10,
        difficulty: 'easy',
        type: 'multiple',
      })
    })

    it('stores the mapped questions when the request succeeds', async () => {
      // Arrange
      const questionsResponse = [
        {
          type: 'multiple',
          difficulty: 'easy',
          category: 'Geography',
          question: 'What is the capital of France?',
          answers: ['Paris', 'London', 'Berlin', 'Rome'],
          verificationToken: 'test-token',
        },
      ]

      getQuestions.mockResolvedValue(questionsResponse)
      const result = mountComposable()

      // Act
      await result.startQuiz(startData)

      // Assert
      expect(quiz.questions).toEqual([
        {
          type: 'multiple',
          difficulty: 'easy',
          category: 'Geography',
          question: 'What is the capital of France?',
          answers: [
            { text: 'Paris', guessed: false, correct: null },
            { text: 'London', guessed: false, correct: null },
            { text: 'Berlin', guessed: false, correct: null },
            { text: 'Rome', guessed: false, correct: null },
          ],
          verificationToken: 'test-token',
          correct: null,
          answered: false,
        },
      ])

      expect(result.error.value).toBeNull()
      expect(result.loading.value).toBe(false)
    })

    it('sets the error when the request fails', async () => {
      // Arrange
      const requestError = new Error('Request failed')
      getQuestions.mockRejectedValue(requestError)
      const result = mountComposable()

      // Act
      await result.startQuiz(startData)

      // Assert
      expect(result.error.value).toBe(requestError)
      expect(result.loading.value).toBe(false)
      expect(quiz.questions).toEqual([])
    })

    it.each([
      {
        description: 'a string',
        rejection: 'Network unavailable',
      },
      {
        description: 'null',
        rejection: null,
      },
      {
        description: 'an undefined value',
        rejection: undefined,
      },
    ])('handles a rejected request with $description', async ({
      rejection,
    }) => {
      // Arrange
      getQuestions.mockRejectedValue(rejection)
      const result = mountComposable()

      // Act
      await result.startQuiz(startData)

      // Assert
      expect(result.error.value).toEqual(
        new Error('Failed to retrieve questions.'),
      )
      expect(result.loading.value).toBe(false)
    })

    it('clears a previous error when starting another request', async () => {
      // Arrange
      getQuestions
        .mockRejectedValueOnce(new Error('Request failed'))
        .mockResolvedValueOnce([])

      const result = mountComposable()

      await result.startQuiz(startData)
      expect(result.error.value).toBeInstanceOf(Error)

      // Act
      await result.startQuiz(startData)

      // Assert
      expect(result.error.value).toBeNull()
      expect(result.loading.value).toBe(false)
    })

    it('sets loading while questions are being retrieved', async () => {
      // Arrange
      let resolveRequest!: (questions: never[]) => void

      getQuestions.mockImplementation(() =>
        new Promise(resolve => {
          resolveRequest = resolve
        }),
      )

      const result = mountComposable()

      // Act
      const request = result.startQuiz(startData)

      // Assert
      expect(result.loading.value).toBe(true)

      resolveRequest([])
      await request

      expect(result.loading.value).toBe(false)
    })
  })
})
