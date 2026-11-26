import type { AnswerInput } from '../../src/models/Answer'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useQuizQuestion } from '../../src/composables/useQuizQuestion'
import { answersServiceKey } from '../../src/services/ServiceKeys'

describe('useQuizQuestion', () => {
  const answers: AnswerInput[] = [
    { text: 'Paris' },
    { text: 'London' },
    { text: 'Berlin' },
  ]

  const defaultOptions = {
    question: 'What is the capital of France?',
    answers,
    verificationToken: 'test-token',
  }

  let wrappers: VueWrapper[]

  function mountComposable (
    options: Parameters<typeof useQuizQuestion>[0],
    checkAnswer = vi.fn().mockResolvedValue({ correct: false }),
  ) {
    let result!: ReturnType<typeof useQuizQuestion>

    const TestComponent = defineComponent({
      setup () {
        result = useQuizQuestion(options)
        return () => null
      },
    })

    const wrapper = mount(TestComponent, {
      global: {
        provide: {
          [answersServiceKey as symbol]: { checkAnswer },
        },
      },
    })

    wrappers.push(wrapper)

    return { result, checkAnswer }
  }

  beforeEach(() => {
    wrappers = []
  })

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('initializes answer state correctly', () => {
      // Arrange
      const { result } = mountComposable(defaultOptions)

      // Assert
      expect(result.answers.value).toEqual([
        { text: 'Paris', guessed: false, correct: null },
        { text: 'London', guessed: false, correct: null },
        { text: 'Berlin', guessed: false, correct: null },
      ])
      expect(result.attempts.value).toBe(0)
      expect(result.isChecking.value).toBe(false)
      expect(result.selectedAnswer.value).toBeNull()
      expect(result.error.value).toBeNull()
    })

    it.each([
      { maxAttempts: undefined, expected: 2 },
      { maxAttempts: 1, expected: 1 },
      { maxAttempts: 5, expected: 5 },
      { maxAttempts: 0, expected: 0 },
    ])(
      'uses attempt limit $expected when maxAttempts is $maxAttempts',
      ({ maxAttempts, expected }) => {
        // Arrange
        const { result } = mountComposable({
          ...defaultOptions,
          maxAttempts,
        })

        // Assert
        expect(result.attemptLimit.value).toBe(expected)
      },
    )
  })

  describe('submitAnswer', () => {
    it('submits an answer and updates state when the answer is correct', async () => {
      // Arrange
      const checkAnswer = vi.fn().mockResolvedValue({ correct: true })
      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      const response = await result.submitAnswer('Paris')

      // Assert
      expect(checkAnswer).toHaveBeenCalledWith({
        question: defaultOptions.question,
        selectedAnswer: 'Paris',
        verificationToken: 'test-token',
      })
      expect(response).toBe(true)
      expect(result.answers.value[0].correct).toBe(true)
      expect(result.answers.value[0].guessed).toBe(true)
      expect(result.attempts.value).toBe(1)
      expect(result.isFinished.value).toBe(true)
      expect(result.isChecking.value).toBe(false)
    })

    it('updates state when the answer is incorrect', async () => {
      // Arrange
      const checkAnswer = vi.fn().mockResolvedValue({ correct: false })
      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      const response = await result.submitAnswer('London')

      // Assert
      expect(response).toBe(false)
      expect(result.answers.value[1].correct).toBe(false)
      expect(result.answers.value[1].guessed).toBe(true)
      expect(result.attempts.value).toBe(1)
      expect(result.isFinished.value).toBe(false)
    })

    it.each([
      { answer: null, description: 'null answer' },
      { answer: 'Rome', description: 'unknown answer' },
      { answer: '', description: 'empty answer' },
    ])('does not submit a $description', async ({ answer }) => {
      // Arrange
      const checkAnswer = vi.fn()
      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      const response = await result.submitAnswer(answer)

      // Assert
      expect(response).toBeNull()
      expect(checkAnswer).not.toHaveBeenCalled()
      expect(result.attempts.value).toBe(0)
    })

    it('does not submit an answer that has already been guessed', async () => {
      // Arrange
      const checkAnswer = vi.fn().mockResolvedValue({ correct: false })
      const { result } = mountComposable(defaultOptions, checkAnswer)

      await result.submitAnswer('London')
      checkAnswer.mockClear()

      // Act
      const response = await result.submitAnswer('London')

      // Assert
      expect(response).toBeNull()
      expect(checkAnswer).not.toHaveBeenCalled()
      expect(result.attempts.value).toBe(1)
    })

    it('does not submit another answer while a request is in progress', async () => {
      // Arrange
      let resolveRequest!: (response: { correct: boolean }) => void

      const checkAnswer = vi.fn(
        () => new Promise<{ correct: boolean }>(resolve => {
          resolveRequest = resolve
        }),
      )

      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      const firstSubmission = result.submitAnswer('Paris')
      const secondResponse = await result.submitAnswer('London')

      // Assert
      expect(result.isChecking.value).toBe(true)
      expect(secondResponse).toBeNull()
      expect(checkAnswer).toHaveBeenCalledOnce()

      resolveRequest({ correct: false })
      await firstSubmission

      expect(result.isChecking.value).toBe(false)
    })
  })

  describe('attempt limit', () => {
    it('reveals the correct answer when the attempt limit is reached', async () => {
      // Arrange
      const checkAnswer = vi.fn()
        .mockResolvedValueOnce({ correct: false })
        .mockResolvedValueOnce({ correct: false })
        .mockResolvedValueOnce({ correct: true })

      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      await result.submitAnswer('Paris')
      await result.submitAnswer('London')

      // Assert
      expect(checkAnswer).toHaveBeenCalledTimes(3)
      expect(checkAnswer).toHaveBeenNthCalledWith(3, {
        question: defaultOptions.question,
        selectedAnswer: 'Berlin',
        verificationToken: 'test-token',
      })
      expect(result.answers.value[2].correct).toBe(true)
      expect(result.isFinished.value).toBe(true)
    })
  })

  describe('error handling', () => {
    it('sets an error when answer verification fails', async () => {
      // Arrange
      const error = new Error('Request failed')
      const checkAnswer = vi.fn().mockRejectedValue(error)
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      const response = await result.submitAnswer('Paris')

      // Assert
      expect(response).toBeNull()
      expect(result.error.value).toBe(error)
      expect(result.isFinished.value).toBe(false)
      expect(consoleError).toHaveBeenCalledOnce()
    })

    it('clears the previous error when another submission is made', async () => {
      // Arrange
      const error = new Error('Request failed')
      const checkAnswer = vi.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ correct: false })

      vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = mountComposable(defaultOptions, checkAnswer)

      await result.submitAnswer('Paris')
      expect(result.error.value).toBe(error)

      // Act
      await result.submitAnswer('Paris')

      // Assert
      expect(result.error.value).toBeNull()
      expect(result.attempts.value).toBe(1)
    })

    it('sets an error when revealing the correct answer fails', async () => {
      // Arrange
      const error = new Error('Reveal request failed')
      const checkAnswer = vi.fn()
        .mockResolvedValueOnce({ correct: false })
        .mockResolvedValueOnce({ correct: false })
        .mockRejectedValueOnce(error)

      vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = mountComposable(defaultOptions, checkAnswer)

      // Act
      await result.submitAnswer('Paris')
      const response = await result.submitAnswer('London')

      // Assert
      expect(response).toBe(false)
      expect(result.error.value).toBe(error)
      expect(result.isFinished.value).toBe(true)
      expect(consoleError).toHaveBeenCalledOnce()
    })
  })
})
