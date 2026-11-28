import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import QuizResults from '../../../src/views/pages/QuizResults.vue'

// Mock composable state
const totalQuestions = ref(10)
const correctAnswers = ref(7)
const incorrectAnswers = ref(3)
const scorePercentage = ref(70)

vi.mock('../../../src/composables/useQuizResult', () => ({
  useQuizResult: () => ({
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

  afterEach(() => {
    wrapper.unmount()
  })

  it('matches the snapshot', () => {
    // Assert
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('renders the quiz results title', () => {
      // Assert
      expect(wrapper.text()).toContain('Quiz Results')
    })

    it('renders the final score percentage', () => {
      // Assert
      expect(wrapper.text()).toContain('70%')
    })

    it('renders the total number of questions', () => {
      // Assert
      expect(wrapper.text()).toContain('Total')
      expect(wrapper.text()).toContain('10')
    })

    it('renders the number of correct answers', () => {
      // Assert
      expect(wrapper.text()).toContain('Correct')
      expect(wrapper.text()).toContain('7')
    })

    it('renders the number of incorrect answers', () => {
      // Assert
      expect(wrapper.text()).toContain('Incorrect')
      expect(wrapper.text()).toContain('3')
    })

    it('renders the play again button', () => {
      // Assert
      expect(wrapper.text()).toContain('Play Again')
    })
  })

  describe('Restart', () => {
    it('emits a restart event when the play again button is clicked', async () => {
      // Act
      await wrapper.findComponent(ButtonStub).trigger('click')

      // Assert
      expect(wrapper.emitted('restart')).toHaveLength(1)
    })
  })
})
