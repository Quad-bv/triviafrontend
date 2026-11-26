import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import QuizProgressCircle from '../../../../src/views/components/quiz/QuizProgressCircle.vue'

const VProgressCircularStub = defineComponent({
  props: {
    color: String,
    modelValue: Number,
    reveal: Boolean,
    rounded: Boolean,
    size: [String, Number],
    width: [String, Number],
  },
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

describe('QuizProgressCircle', () => {
  let wrappers: VueWrapper[] = []

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    wrappers = []
  })

  const mountComponent = (questionNumber = 1, totalQuestions = 10) => {
    const wrapper = mount(QuizProgressCircle, {
      props: {
        questionNumber,
        totalQuestions,
      },
      global: {
        stubs: {
          VProgressCircular: VProgressCircularStub,
        },
      },
    })

    wrappers.push(wrapper)
    return wrapper
  }

  describe('Rendering', () => {
    it('matches the snapshot', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders the question number and total questions', () => {
      // Arrange
      const wrapper = mountComponent(3, 10)

      // Assert
      expect(wrapper.text()).toContain('3/10')
    })

    it('passes the progress percentage to the progress circle', () => {
      // Arrange
      const wrapper = mountComponent(5, 10)

      // Assert
      expect(
        wrapper.findComponent(VProgressCircularStub).props('modelValue'),
      ).toBe(50)
    })
  })

  describe('Progress colour', () => {
    it.each([
      { questionNumber: 33, totalQuestions: 100, expected: 'green' },
      { questionNumber: 34, totalQuestions: 100, expected: 'yellow' },
      { questionNumber: 66, totalQuestions: 100, expected: 'yellow' },
      { questionNumber: 67, totalQuestions: 100, expected: 'orange' },
      { questionNumber: 99, totalQuestions: 100, expected: 'orange' },
      { questionNumber: 100, totalQuestions: 100, expected: 'red' },
    ])(
      'uses $expected when progress is $questionNumber/$totalQuestions',
      ({ questionNumber, totalQuestions, expected }) => {
        // Arrange
        const wrapper = mountComponent(questionNumber, totalQuestions)

        // Assert
        expect(
          wrapper.findComponent(VProgressCircularStub).props('color'),
        ).toBe(expected)
      },
    )
  })
})
