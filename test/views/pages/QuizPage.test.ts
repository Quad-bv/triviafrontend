import type { Question } from '../../../src/models/Question'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import QuizPage from '../../../src/views/pages/QuizPage.vue'

// Mock store state
const questions = ref<Question[]>([])
const currentQuestion = ref<Question | null>(null)
const currentQuestionNumber = ref(1)

// Mock functions
const completeQuestion = vi.fn()

vi.mock('../../../src/composables/useQuizStore', () => ({
  useQuizStore: () => ({
    questions,
    currentQuestion,
    currentQuestionNumber,
  }),
}))

vi.mock('../../../src/composables/useQuizFlow', () => ({
  useQuizFlow: () => ({
    completeQuestion,
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
    vi.clearAllMocks()

    questions.value = [question]
    currentQuestion.value = question
    currentQuestionNumber.value = 1

    completeQuestion.mockReturnValue(true)

    wrapper = mount(QuizPage, {
      global: {
        stubs: {
          QuizQuestionCard: QuizQuestionCardStub,
          MultipleChoiceQuestion: MultipleChoiceQuestionStub,
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('renders question card', () => {
      const result = wrapper.findComponent(QuizQuestionCardStub)

      expect(result.exists()).toBe(true)
      expect(result.props('question')).toBe(question.question)
      expect(result.props('category')).toBe(question.category)
      expect(result.props('difficulty')).toBe(question.difficulty)
      expect(result.props('questionNumber')).toBe(1)
      expect(result.props('totalQuestions')).toBe(1)
    })

    it('renders multiple choice question', () => {
      const result = wrapper.findComponent(MultipleChoiceQuestionStub)

      expect(result.exists()).toBe(true)
      expect(result.props('question')).toBe(question.question)
      expect(result.props('answers')).toEqual(question.answers)
      expect(result.props('verificationToken')).toBe(question.verificationToken)
      expect(result.props('maxAttempts')).toBe(1)
    })

    it('does not render question card when there is no current question', async () => {
      currentQuestion.value = null
      await wrapper.vm.$nextTick()

      const result = wrapper.findComponent(QuizQuestionCardStub)

      expect(result.exists()).toBe(false)
    })
  })

  describe('Question submission', () => {
    it('submits the question result after the delay', async () => {
      completeQuestion.mockReturnValue(false)

      wrapper.findComponent(MultipleChoiceQuestionStub).vm.$emit('answered', true)

      expect(completeQuestion).not.toHaveBeenCalled()

      // Wait for the component's one-second delay
      await new Promise(resolve => setTimeout(resolve, 1100))
      await flushPromises()

      expect(completeQuestion).toHaveBeenCalledWith(true)
    })

    it('emits finished when the quiz is over', async () => {
      completeQuestion.mockReturnValue(true)

      wrapper.findComponent(MultipleChoiceQuestionStub).vm.$emit('answered', true)

      await new Promise(resolve => setTimeout(resolve, 1100))
      await flushPromises()

      expect(wrapper.emitted('finished')).toHaveLength(1)
    })

    it('does not emit finished when the quiz is not over', async () => {
      completeQuestion.mockReturnValue(false)

      wrapper.findComponent(MultipleChoiceQuestionStub).vm.$emit('answered', false)

      await new Promise(resolve => setTimeout(resolve, 1100))
      await flushPromises()

      expect(wrapper.emitted('finished')).toBeUndefined()
    })
  })
})
