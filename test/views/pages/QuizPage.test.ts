import type { Question } from '../../../src/models/Question'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import QuizPage from '../../../src/views/pages/QuizPage.vue'

// Mock store state
const questions = ref<Question[]>([])
const currentQuestion = ref<Question | null>(null)
const currentQuestionNumber = ref(1)

// Mock functions
const submitQuestionResult = vi.fn()

vi.mock('@/composables/useQuizStore', () => ({
  useQuizStore: () => ({
    questions,
    currentQuestion,
    currentQuestionNumber,
  }),
}))

vi.mock('@/composables/useQuizFlow', () => ({
  useQuizFlow: () => ({
    submitQuestionResult,
  }),
}))

// Component stubs
const QuizQuestionCardStub = defineComponent({
  props: {
    question: String,
    category: String,
    difficulty: String,
    questionNumber: Number,
    totalQuestions: Number,
  },
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const MultipleChoiceQuestionStub = defineComponent({
  props: {
    question: String,
    answers: Array,
    verificationToken: String,
    maxAttempts: Number,
  },
  emits: ['answered'],
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

describe('QuizPage', () => {
  let wrapper: VueWrapper

  const question = {
    number: 1,
    type: 'multiple',
    difficulty: 'easy',
    category: 'General Knowledge',
    question: 'What is the capital of France?',
    answers: [
      { text: 'Paris', guessed: false, correct: null },
      { text: 'London', guessed: false, correct: null },
    ],
    verificationToken: 'test-token',
    correct: null,
    answered: false,
  } as unknown as Question

  beforeEach(() => {
    // Arrange
    vi.clearAllMocks()

    questions.value = [question]
    currentQuestion.value = question
    currentQuestionNumber.value = 1

    submitQuestionResult.mockReturnValue(true)

    wrapper = mount(QuizPage, {
      global: {
        stubs: {
          QuizQuestionCard: QuizQuestionCardStub,
          MultipleChoiceQuestion: MultipleChoiceQuestionStub,
        },
      },
    })
  })

  it('matches snapshot', () => {
    // Act
    const result = wrapper.html()

    // Assert
    expect(result).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('renders question card', () => {
      // Act
      const result = wrapper.findComponent(QuizQuestionCardStub)

      // Assert
      expect(result.exists()).toBe(true)
      expect(result.props('question')).toBe(question.question)
      expect(result.props('category')).toBe(question.category)
      expect(result.props('difficulty')).toBe(question.difficulty)
      expect(result.props('questionNumber')).toBe(1)
      expect(result.props('totalQuestions')).toBe(1)
    })

    it('renders multiple choice question', () => {
      // Act
      const result = wrapper.findComponent(MultipleChoiceQuestionStub)

      // Assert
      expect(result.exists()).toBe(true)
      expect(result.props('question')).toBe(question.question)
      expect(result.props('answers')).toEqual(question.answers)
      expect(result.props('verificationToken')).toBe(question.verificationToken)
      expect(result.props('maxAttempts')).toBe(1)
    })

    it('does not render question card when there is no current question', async () => {
      // Arrange
      currentQuestion.value = null
      await wrapper.vm.$nextTick()

      // Act
      const result = wrapper.findComponent(QuizQuestionCardStub)

      // Assert
      expect(result.exists()).toBe(false)
    })
  })

  describe('Question submission', () => {
    it('submits the question result after the delay', async () => {
      // Arrange
      submitQuestionResult.mockReturnValue(false)

      // Act
      wrapper.findComponent(MultipleChoiceQuestionStub).vm.$emit('answered', true)

      // Assert
      expect(submitQuestionResult).not.toHaveBeenCalled()

      // Wait for the component's one-second delay
      await new Promise(resolve => setTimeout(resolve, 1100))
      await flushPromises()

      // Assert
      expect(submitQuestionResult).toHaveBeenCalledWith(true)
    })

    it('emits finished when the quiz is over', async () => {
      // Arrange
      submitQuestionResult.mockReturnValue(true)

      // Act
      wrapper.findComponent(MultipleChoiceQuestionStub).vm.$emit('answered', true)

      await new Promise(resolve => setTimeout(resolve, 1100))
      await flushPromises()

      // Assert
      expect(wrapper.emitted('finished')).toHaveLength(1)
    })

    it('does not emit finished when the quiz is not over', async () => {
      // Arrange
      submitQuestionResult.mockReturnValue(false)

      // Act
      wrapper.findComponent(MultipleChoiceQuestionStub).vm.$emit('answered', false)

      await new Promise(resolve => setTimeout(resolve, 1100))
      await flushPromises()

      // Assert
      expect(wrapper.emitted('finished')).toBeUndefined()
    })
  })
})
