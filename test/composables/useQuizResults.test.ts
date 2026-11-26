import type { Question } from '../../src/models/Question'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { useQuizResult } from '../../src/composables/useQuizResult'
import { useQuizStore } from '../../src/composables/useQuizStore'

describe('useQuizResult', () => {
  let quiz: ReturnType<typeof useQuizStore>
  let wrappers: VueWrapper[]

  function mountComposable () {
    let result!: ReturnType<typeof useQuizResult>

    const TestComponent = defineComponent({
      setup () {
        result = useQuizResult()
        return () => null
      },
    })

    const wrapper = mount(TestComponent)
    wrappers.push(wrapper)

    return result
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    quiz = useQuizStore()
    wrappers = []
  })

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
  })

  it('returns zero results when there are no questions', () => {
    // Arrange
    const result = mountComposable()

    // Assert
    expect(result.totalQuestions.value).toBe(0)
    expect(result.correctAnswers.value).toBe(0)
    expect(result.incorrectAnswers.value).toBe(0)
    expect(result.scorePercentage.value).toBe(0)
  })

  it.each([
    {
      description: 'all answers are correct',
      results: [true, true, true],
      expectedCorrect: 3,
      expectedIncorrect: 0,
      expectedPercentage: 100,
    },
    {
      description: 'all answers are incorrect',
      results: [false, false, false],
      expectedCorrect: 0,
      expectedIncorrect: 3,
      expectedPercentage: 0,
    },
    {
      description: 'answers contain both correct and incorrect results',
      results: [true, false, true],
      expectedCorrect: 2,
      expectedIncorrect: 1,
      expectedPercentage: 67,
    },
    {
      description: 'some questions have not been answered',
      results: [true, false, null],
      expectedCorrect: 1,
      expectedIncorrect: 1,
      expectedPercentage: 33,
    },
  ])('calculates quiz results when $description', ({
    results,
    expectedCorrect,
    expectedIncorrect,
    expectedPercentage,
  }) => {
    // Arrange
    const questions = results.map(correct => ({
      correct,
      answered: correct !== null,
    })) as Question[]

    quiz.setQuestions(questions)

    const result = mountComposable()

    // Assert
    expect(result.totalQuestions.value).toBe(3)
    expect(result.correctAnswers.value).toBe(expectedCorrect)
    expect(result.incorrectAnswers.value).toBe(expectedIncorrect)
    expect(result.scorePercentage.value).toBe(expectedPercentage)
  })

  it('updates the results when the quiz questions change', () => {
    // Arrange
    quiz.setQuestions([
      { correct: true, answered: true },
      { correct: false, answered: true },
    ] as Question[])

    const result = mountComposable()

    // Act
    quiz.questions[1].correct = true

    // Assert
    expect(result.correctAnswers.value).toBe(2)
    expect(result.incorrectAnswers.value).toBe(0)
    expect(result.scorePercentage.value).toBe(100)
  })
})
