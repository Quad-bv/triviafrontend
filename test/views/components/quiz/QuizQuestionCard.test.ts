import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { Difficulty } from '../../../../src/models/enums/Difficulty'
import QuizQuestionCard from '../../../../src/views/components/quiz/QuizQuestionCard.vue'

const VCardStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', { class: 'v-card' }, slots.default?.())
  },
})

const VCardItemStub = defineComponent({
  setup (_, { slots }) {
    return () =>
      h('div', { class: 'v-card-item' }, [
        slots.default?.(),
        slots.append?.(),
      ])
  },
})

const VCardSubtitleStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', { class: 'v-card-subtitle' }, slots.default?.())
  },
})

const VCardTitleStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', { class: 'v-card-title' }, slots.default?.())
  },
})

const VChipStub = defineComponent({
  props: {
    color: String,
    size: String,
  },
  setup (props, { slots }) {
    return () =>
      h(
        'span',
        {
          'class': 'v-chip',
          'data-color': props.color,
          'data-size': props.size,
        },
        slots.default?.(),
      )
  },
})

const QuizProgressBarStub = defineComponent({
  props: {
    questionNumber: Number,
    totalQuestions: Number,
  },
  setup (props) {
    return () =>
      h('div', {
        'class': 'quiz-progress-bar',
        'data-question-number': props.questionNumber,
        'data-total-questions': props.totalQuestions,
      })
  },
})

const QuizProgressCircleStub = defineComponent({
  props: {
    questionNumber: Number,
    totalQuestions: Number,
  },
  setup (props) {
    return () =>
      h('div', {
        'class': 'quiz-progress-circle',
        'data-question-number': props.questionNumber,
        'data-total-questions': props.totalQuestions,
      })
  },
})

describe('QuizQuestionCard', () => {
  let wrappers: VueWrapper[] = []

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }

    wrappers = []
  })

  const mountComponent = (props = {}, slots = {}) => {
    const wrapper = mount(QuizQuestionCard, {
      props: {
        question: 'What is the capital of France?',
        category: 'Geography',
        difficulty: Difficulty.EASY,
        ...props,
      },
      slots,
      global: {
        stubs: {
          VCard: VCardStub,
          VCardItem: VCardItemStub,
          VCardSubtitle: VCardSubtitleStub,
          VCardTitle: VCardTitleStub,
          VChip: VChipStub,
          QuizProgressBar: QuizProgressBarStub,
          QuizProgressCircle: QuizProgressCircleStub,
        },
      },
    })

    wrappers.push(wrapper)
    return wrapper
  }

  describe('Rendering', () => {
    it('matches the snapshot', () => {
      // Arrange
      const wrapper = mountComponent(
        {
          questionNumber: 2,
          totalQuestions: 10,
        },
        {
          default: '<p>Question content</p>',
        },
      )

      // Assert
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders the category, question and difficulty', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.text()).toContain('Geography')
      expect(wrapper.text()).toContain('What is the capital of France?')
      expect(wrapper.text()).toContain(Difficulty.EASY)
    })

    it('renders the content provided through its default slot', () => {
      // Arrange
      const wrapper = mountComponent(
        {},
        {
          default: '<p>Question content</p>',
        },
      )

      // Assert
      expect(wrapper.text()).toContain('Question content')
    })
  })

  describe('Difficulty styling', () => {
    it('passes the difficulty color to the chip', () => {
      // Arrange
      const wrapper = mountComponent({
        difficulty: Difficulty.MEDIUM,
      })

      // Assert
      expect(wrapper.findComponent(VChipStub).props('color')).toBe('yellow')
    })
  })

  describe('Progress indicators', () => {
    it.each([
      {
        scenario: 'both progress values are provided',
        questionNumber: 2,
        totalQuestions: 10,
        shouldRender: true,
      },
      {
        scenario: 'the question number is missing',
        questionNumber: undefined,
        totalQuestions: 10,
        shouldRender: false,
      },
      {
        scenario: 'the total question count is missing',
        questionNumber: 2,
        totalQuestions: undefined,
        shouldRender: false,
      },
      {
        scenario: 'both progress values are zero',
        questionNumber: 0,
        totalQuestions: 0,
        shouldRender: true,
      },
    ])(
      'renders progress components when $scenario',
      ({ questionNumber, totalQuestions, shouldRender }) => {
        // Arrange
        const wrapper = mountComponent({
          questionNumber,
          totalQuestions,
        })

        // Assert
        expect(wrapper.find('.quiz-progress-bar').exists()).toBe(shouldRender)
        expect(wrapper.find('.quiz-progress-circle').exists()).toBe(shouldRender)
      },
    )

    it('passes the progress values to both progress components', () => {
      // Arrange
      const wrapper = mountComponent({
        questionNumber: 3,
        totalQuestions: 10,
      })

      // Assert
      expect(wrapper.find('.quiz-progress-bar').attributes()).toMatchObject({
        'data-question-number': '3',
        'data-total-questions': '10',
      })

      expect(wrapper.find('.quiz-progress-circle').attributes()).toMatchObject({
        'data-question-number': '3',
        'data-total-questions': '10',
      })
    })
  })
})
