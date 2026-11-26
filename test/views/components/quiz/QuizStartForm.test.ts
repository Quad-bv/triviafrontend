import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import QuizStartForm from '../../../../src/views/components/quiz/QuizStartForm.vue'

const validateMock = vi.fn()

const VFormStub = defineComponent({
  emits: ['submit'],
  setup (_, { slots, expose, emit }) {
    expose({ validate: validateMock })

    return () =>
      h(
        'form',
        {
          onSubmit: (event: Event) => {
            event.preventDefault()
            emit('submit', event)
          },
        },
        slots.default?.(),
      )
  },
})

const VNumberInputStub = defineComponent({
  props: {
    modelValue: [Number, String],
    label: String,
    rules: Array,
    min: Number,
    max: Number,
    step: Number,
    variant: String,
    inset: Boolean,
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    return () =>
      h('input', {
        'type': 'number',
        'aria-label': props.label,
        'value': props.modelValue,
        'min': props.min,
        'max': props.max,
        'step': props.step,
        'onInput': (event: Event) => {
          const input = event.target as HTMLInputElement
          emit('update:modelValue', input.valueAsNumber)
        },
      })
  },
})

const VSelectStub = defineComponent({
  props: {
    modelValue: String,
    items: Array,
    itemTitle: String,
    itemValue: String,
    label: String,
    placeholder: String,
    variant: String,
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    return () =>
      h('label', [
        props.label,
        h(
          'select',
          {
            'aria-label': props.label,
            'value': props.modelValue,
            'onChange': (event: Event) => {
              emit('update:modelValue', (event.target as HTMLSelectElement).value)
            },
          },
          (props.items as Record<string, string>[]).map(item =>
            h(
              'option',
              { value: item[props.itemValue!] },
              item[props.itemTitle!],
            ),
          ),
        ),
      ])
  },
})

const VLayoutStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const ButtonStub = defineComponent({
  props: {
    disabled: Boolean,
    loading: Boolean,
    type: String,
    variant: String,
  },
  template: `
    <button
      :disabled="disabled || loading"
      :type="type"
    >
      <slot />
    </button>
  `,
})

describe('QuizStartForm', () => {
  let wrappers: VueWrapper[] = []

  beforeEach(() => {
    wrappers = []
    validateMock.mockReset()
    validateMock.mockResolvedValue({ valid: true })
  })

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
  })

  const mountComponent = (loading = false) => {
    const wrapper = mount(QuizStartForm, {
      props: { loading },
      global: {
        stubs: {
          VForm: VFormStub,
          VCol: VLayoutStub,
          VRow: VLayoutStub,
          VNumberInput: VNumberInputStub,
          VSelect: VSelectStub,
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

    it('renders the question amount input and both select fields', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.find('input[type="number"]').exists()).toBe(true)
      expect(wrapper.find('select[aria-label="Difficulty"]').exists()).toBe(true)
      expect(wrapper.find('select[aria-label="Question type"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Start quiz')
    })

    it('uses the default form values', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(
        (wrapper.find('input[type="number"]').element as HTMLInputElement).value,
      ).toBe('10')

      expect(
        (wrapper.find('select[aria-label="Difficulty"]').element as HTMLSelectElement).value,
      ).toBe('any')

      expect(
        (wrapper.find('select[aria-label="Question type"]').element as HTMLSelectElement).value,
      ).toBe('random')
    })
  })

  describe('Loading state', () => {
    it.each([
      { scenario: 'not loading', loading: false, disabled: false },
      { scenario: 'loading', loading: true, disabled: true },
    ])('renders the submit button correctly when $scenario', ({ loading, disabled }) => {
      // Arrange
      const wrapper = mountComponent(loading)

      // Assert
      expect(
        (wrapper.find('button').element as HTMLButtonElement).disabled,
      ).toBe(disabled)
    })
  })

  describe('Amount validation', () => {
    describe('Amount validation', () => {
      it.each([
        { value: null, expected: 'Number of questions is required.' },
        { value: '', expected: 'Number of questions is required.' },
        { value: 0, expected: 'At least 1 question is required.' },
        { value: 51, expected: 'A maximum of 50 questions is allowed.' },
        { value: 1.5, expected: 'Please enter a whole number.' },
        { value: 1, expected: true },
        { value: 50, expected: true },
        { value: '10', expected: true },
      ])('validates the amount $value', ({ value, expected }) => {
        // Arrange
        const wrapper = mountComponent()
        const numberInput = wrapper.findComponent(VNumberInputStub)
        const rules = numberInput.props('rules') as Array<
          (value: number | string | null) => true | string
        >

        // Act
        const result = rules[0](value)

        // Assert
        expect(result).toBe(expected)
      })
    })
  })

  describe('Form submission', () => {
    it('emits the default quiz settings when the form is valid', async () => {
      // Arrange
      const wrapper = mountComponent()

      // Act
      await wrapper.find('form').trigger('submit')

      // Assert
      expect(validateMock).toHaveBeenCalledOnce()
      expect(wrapper.emitted('start')).toEqual([
        [
          {
            amount: 10,
            difficulty: null,
            type: null,
          },
        ],
      ])
    })

    it('emits the selected question amount', async () => {
      // Arrange
      const wrapper = mountComponent()

      // Act
      await wrapper.find('input[type="number"]').setValue('25')
      await wrapper.find('form').trigger('submit')

      // Assert
      expect(wrapper.emitted('start')).toEqual([
        [
          {
            amount: 25,
            difficulty: null,
            type: null,
          },
        ],
      ])
    })

    it('does not emit start when form validation fails', async () => {
      // Arrange
      validateMock.mockResolvedValue({ valid: false })
      const wrapper = mountComponent()

      // Act
      await wrapper.find('form').trigger('submit')

      // Assert
      expect(validateMock).toHaveBeenCalledOnce()
      expect(wrapper.emitted('start')).toBeUndefined()
    })
  })
})
