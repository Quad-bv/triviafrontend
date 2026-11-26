import type { IAnswersService } from '../../../../src/services/interfaces/IAnswersService'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, provide } from 'vue'
import { answersServiceKey } from '../../../../src/services/ServiceKeys'
import MultipleChoiceQuestion from '../../../../src/views/components/quiz/MultipleChoiceQuestion.vue'

const checkAnswer = vi.fn<IAnswersService['checkAnswer']>()

const radioGroupUpdateKey = Symbol('radioGroupUpdate')

const VRadioGroupStub = defineComponent({
  props: {
    modelValue: String,
    hideDetails: Boolean,
  },
  emits: ['update:modelValue'],
  setup (_, { slots, emit }) {
    provide(radioGroupUpdateKey, (value: string) => {
      emit('update:modelValue', value)
    })

    return () => h('div', slots.default?.())
  },
})

const VRadioStub = defineComponent({
  props: {
    baseColor: String,
    readonly: Boolean,
    value: String,
  },
  setup (props, { slots }) {
    const updateModel = inject<(value: string) => void>(radioGroupUpdateKey)

    return () =>
      h('label', [
        h('input', {
          type: 'radio',
          name: 'answer',
          value: props.value,
          disabled: props.readonly,
          onChange: () => updateModel?.(props.value),
        }),
        ...(slots.label?.() ?? []),
      ])
  },
})

const VCardActionsStub = defineComponent({
  template: '<div><slot /></div>',
})

const VSpacerStub = defineComponent({
  template: '<span />',
})

const VAlertStub = defineComponent({
  props: {
    type: String,
    variant: String,
  },
  template: '<div><slot /></div>',
})

const ButtonStub = defineComponent({
  props: {
    disabled: Boolean,
    loading: Boolean,
  },
  emits: ['click'],
  template: `
    <button
        :disabled="disabled || loading"
        @click="$emit('click')"
    >
      <slot />
    </button>
  `,
})

describe('MultipleChoiceQuestion', () => {
  let wrappers: VueWrapper[] = []

  const answers = [
    { text: 'Paris' },
    { text: 'London' },
    { text: 'Rome' },
  ]

  beforeEach(() => {
    wrappers = []
    checkAnswer.mockReset()
  })

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    vi.restoreAllMocks()
  })

  const mountComponent = (
    props: {
      maxAttempts?: number
      answers?: { text: string }[]
    } = {},
  ) => {
    const wrapper = mount(MultipleChoiceQuestion, {
      props: {
        question: 'What is the capital of France?',
        answers,
        verificationToken: 'test-token',
        ...props,
      },
      global: {
        provide: {
          [answersServiceKey]: {
            checkAnswer,
          },
        },
        stubs: {
          VRadioGroup: VRadioGroupStub,
          VRadio: VRadioStub,
          VCardActions: VCardActionsStub,
          VSpacer: VSpacerStub,
          VAlert: VAlertStub,
          Button: ButtonStub,
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

    it('renders all available answers', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.text()).toContain('Paris')
      expect(wrapper.text()).toContain('London')
      expect(wrapper.text()).toContain('Rome')
    })

    it('renders the submit button', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.text()).toContain('Submit answer')
    })

    it('renders no radio options when there are no answers', () => {
      // Arrange
      const wrapper = mountComponent({ answers: [] })

      // Assert
      expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0)
      expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true)
    })
  })

  describe('Answer selection', () => {
    it.each([
      { answer: null, disabled: true, description: 'no answer is selected' },
      { answer: 'Paris', disabled: false, description: 'an answer is selected' },
    ])('sets the submit button state when $description', async ({ answer, disabled }) => {
      // Arrange
      const wrapper = mountComponent()

      // Act
      if (answer !== null) {
        await wrapper.find(`input[value="${answer}"]`).setValue()
      }

      // Assert
      expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(disabled)
    })

    it('disables guessed answers but keeps unguessed answers enabled', async () => {
      // Arrange
      checkAnswer.mockResolvedValue({ correct: false })
      const wrapper = mountComponent({ maxAttempts: 2 })

      // Act
      await wrapper.find('input[value="London"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      // Assert
      expect(
        (wrapper.find('input[value="London"]').element as HTMLInputElement).disabled,
      ).toBe(true)

      expect(
        (wrapper.find('input[value="Paris"]').element as HTMLInputElement).disabled,
      ).toBe(false)
    })
  })

  describe('Answer submission', () => {
    it('submits the selected answer and emits answered when the answer is correct', async () => {
      // Arrange
      checkAnswer.mockResolvedValue({ correct: true })
      const wrapper = mountComponent()

      // Act
      await wrapper.find('input[value="Paris"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      // Assert
      expect(checkAnswer).toHaveBeenCalledWith({
        question: 'What is the capital of France?',
        selectedAnswer: 'Paris',
        verificationToken: 'test-token',
      })
      expect(wrapper.emitted('answered')).toEqual([[true]])
    })

    it('emits answered when an incorrect answer reaches the attempt limit', async () => {
      // Arrange
      checkAnswer
        .mockResolvedValueOnce({ correct: false })
        .mockResolvedValueOnce({ correct: true })

      const wrapper = mountComponent({ maxAttempts: 1 })

      // Act
      await wrapper.find('input[value="London"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      // Assert
      expect(checkAnswer).toHaveBeenCalledTimes(2)
      expect(wrapper.emitted('answered')).toEqual([[false]])
    })

    it('disables answers and submit button while checking an answer', async () => {
      // Arrange
      let resolveCheck!: (response: { correct: boolean }) => void

      checkAnswer.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveCheck = resolve
          }),
      )

      const wrapper = mountComponent()

      // Act
      await wrapper.find('input[value="Paris"]').setValue()
      await wrapper.find('button').trigger('click')

      // Assert
      expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true)

      expect(
        wrapper.findAll('input[type="radio"]').every(input =>
          (input.element as HTMLInputElement).disabled,
        ),
      ).toBe(true)

      resolveCheck({ correct: true })
      await flushPromises()
    })

    it('disables all answers after a correct answer', async () => {
      // Arrange
      checkAnswer.mockResolvedValue({ correct: true })
      const wrapper = mountComponent()

      // Act
      await wrapper.find('input[value="Paris"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      // Assert
      expect(
        wrapper.findAll('input[type="radio"]').every(input =>
          (input.element as HTMLInputElement).disabled,
        ),
      ).toBe(true)

      expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true)
    })
  })

  describe('Error handling', () => {
    it('displays an error when answer verification fails', async () => {
      // Arrange
      vi.spyOn(console, 'error').mockImplementation(() => {})
      checkAnswer.mockRejectedValue(new Error('Verification failed'))
      const wrapper = mountComponent()

      // Act
      await wrapper.find('input[value="Paris"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      // Assert
      expect(wrapper.text()).toContain('Verification failed')
      expect(wrapper.emitted('answered')).toBeUndefined()
    })

    it('allows another attempt after answer verification fails', async () => {
      // Arrange
      checkAnswer
        .mockRejectedValueOnce(new Error('Verification failed'))
        .mockResolvedValueOnce({ correct: true })

      vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mountComponent()

      // Act: first attempt fails
      await wrapper.find('input[value="Paris"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Verification failed')

      // Act: retry with another answer
      await wrapper.find('input[value="London"]').setValue()
      await wrapper.find('button').trigger('click')
      await flushPromises()

      // Assert
      expect(checkAnswer).toHaveBeenCalledTimes(2)
      expect(wrapper.emitted('answered')).toEqual([[true]])
      expect(wrapper.text()).not.toContain('Verification failed')
    })
  })
})
