import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import QuizResults from '../../../src/views/pages/QuizResults.vue'

// Mock composable state
const totalQuestions = ref(10)
const correctAnswers = ref(7)
const incorrectAnswers = ref(3)
const scorePercentage = ref(70)

vi.mock('@/composables/useQuizResult', () => ({
  useQuizResults: () => ({
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    scorePercentage,
  }),
}))

// Component stubs
const VCardStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const VCardTitleStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const VCardSubtitleStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const VCardTextStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const VCardActionsStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const ButtonStub = defineComponent({
  emits: ['click'],
  setup (_, { emit, slots }) {
    return () => h(
      'button',
      {
        onClick: () => emit('click'),
      },
      slots.default?.(),
    )
  },
})

describe('QuizResults', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Arrange
    vi.clearAllMocks()

    totalQuestions.value = 10
    correctAnswers.value = 7
    incorrectAnswers.value = 3
    scorePercentage.value = 70

    wrapper = mount(QuizResults, {
      global: {
        stubs: {
          VCard: VCardStub,
          VCardTitle: VCardTitleStub,
          VCardSubtitle: VCardSubtitleStub,
          VCardText: VCardTextStub,
          VCardActions: VCardActionsStub,
          Button: ButtonStub,
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
    it('renders quiz results title', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('Quiz Results')
    })

    it('renders final score percentage', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('70%')
    })

    it('renders total number of questions', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('Total')
      expect(result).toContain('10')
    })

    it('renders number of correct answers', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('Correct')
      expect(result).toContain('7')
    })

    it('renders number of incorrect answers', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('Incorrect')
      expect(result).toContain('3')
    })

    it('renders play again button', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('Play Again')
    })
  })

  describe('Restart', () => {
    it('emits restart event when play again button is clicked', async () => {
      // Arrange
      const button = wrapper.findComponent(ButtonStub)

      // Act
      await button.trigger('click')

      // Assert
      expect(wrapper.emitted('restart')).toHaveLength(1)
    })
  })
})
