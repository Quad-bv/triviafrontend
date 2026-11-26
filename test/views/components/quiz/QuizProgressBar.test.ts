import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import QuizProgressBar from '../../../../src/views/components/quiz/QuizProgressBar.vue'

const VProgressLinearStub = defineComponent({
  props: {
    color: String,
    height: [String, Number],
    modelValue: Number,
    rounded: Boolean,
  },
  setup (_, { attrs }) {
    return () => h('div', attrs)
  },
})

describe('QuizProgressBar', () => {
  let wrappers: VueWrapper[] = []

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    wrappers = []
  })

  const mountComponent = (questionNumber = 1, totalQuestions = 10) => {
    const wrapper = mount(QuizProgressBar, {
      props: {
        questionNumber,
        totalQuestions,
      },
      global: {
        stubs: {
          VProgressLinear: VProgressLinearStub,
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

    it('renders the progress bar', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.findComponent(VProgressLinearStub).exists()).toBe(true)
    })

    it('passes the progress percentage to the progress bar', () => {
      // Arrange
      const wrapper = mountComponent(5, 10)

      // Assert
      expect(
        wrapper.findComponent(VProgressLinearStub).props('modelValue'),
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
          wrapper.findComponent(VProgressLinearStub).props('color'),
        ).toBe(expected)
      },
    )
  })
})
