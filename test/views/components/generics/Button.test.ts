import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import Button from '../../../../src/views/components/generics/Button.vue'

const VBtnStub = defineComponent({
  props: {
    block: Boolean,
    color: String,
    disabled: Boolean,
    loading: Boolean,
    minWidth: [String, Number],
    size: String,
    type: String,
  },
  emits: {
    click: () => true,
  },
  template: `
    <button
        :disabled="disabled"
        :type="type"
        @click="$emit('click')"
    >
      <slot />
    </button>
  `,
})

describe('Button', () => {
  let wrappers: VueWrapper[] = []

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    wrappers = []
  })

  const mountButton = (options = {}) => {
    const wrapper = mount(Button, {
      ...options,
      global: {
        stubs: {
          VBtn: VBtnStub,
        },
      },
    })

    wrappers.push(wrapper)
    return wrapper
  }

  describe('Rendering', () => {
    it('matches the snapshot', () => {
      // Arrange
      const wrapper = mountButton({
        slots: { default: 'Continue' },
      })

      // Assert
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders its slot content', () => {
      // Arrange
      const wrapper = mountButton({
        slots: { default: 'Save changes' },
      })

      // Assert
      expect(wrapper.text()).toContain('Save changes')
    })

    it.each([
      { scenario: 'enabled', disabled: false },
      { scenario: 'disabled', disabled: true },
    ])('renders an $scenario button correctly', ({ disabled }) => {
      // Arrange
      const wrapper = mountButton({ props: { disabled } })

      // Assert
      expect((wrapper.find('button').element as HTMLButtonElement).disabled)
        .toBe(disabled)
    })
  })

  describe('Props', () => {
    it.each([
      {
        scenario: 'default props',
        props: {},
        expected: {
          block: false,
          color: 'primary',
          disabled: false,
          loading: false,
          minWidth: 160,
          size: 'large',
          type: 'button',
        },
      },
      {
        scenario: 'custom props',
        props: {
          block: true,
          disabled: true,
          loading: true,
          minWidth: '200px',
          type: 'submit' as const,
        },
        expected: {
          block: true,
          color: 'primary',
          disabled: true,
          loading: true,
          minWidth: '200px',
          size: 'large',
          type: 'submit',
        },
      },
      ...(['button', 'submit', 'reset'] as const).map(type => ({
        scenario: `${type} button type`,
        props: { type },
        expected: { type },
      })),
    ])('passes $scenario to Vuetify', ({ props, expected }) => {
      // Arrange
      const wrapper = mountButton({ props })

      // Assert
      expect(wrapper.findComponent(VBtnStub).props()).toMatchObject(expected)
    })
  })

  describe('Click behaviour', () => {
    it('emits a click event when clicked', async () => {
      // Arrange
      const wrapper = mountButton()

      // Act
      await wrapper.find('button').trigger('click')

      // Assert
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })
})
