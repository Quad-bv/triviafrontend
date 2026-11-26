import type { QuizStartData } from '../../../src/models/QuizStartData'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import QuizStart from '../../../src/views/pages/QuizStart.vue'

// Mock composable
const loading = ref(false)
const error = ref<Error | null>(null)
const startQuiz = vi.fn()

vi.mock('@/composables/useQuizStart', () => ({
  useQuizStart: () => ({
    loading,
    error,
    startQuiz,
  }),
}))

// Component stubs
const VCardStub = defineComponent({
  setup (_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const VCardItemStub = defineComponent({
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

const VAlertStub = defineComponent({
  props: {
    type: String,
    variant: String,
  },
  setup (_, { slots }) {
    return () => h('div', { role: 'alert' }, slots.default?.())
  },
})

const QuizStartFormStub = defineComponent({
  props: {
    loading: Boolean,
  },
  emits: ['start'],
  setup (props, { emit }) {
    return () => h('button', {
      disabled: props.loading,
      onClick: () => emit('start', {
        amount: 10,
        difficulty: null,
        type: null,
      }),
    }, 'Start quiz')
  },
})

// Tests
describe('QuizStart', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Arrange
    vi.clearAllMocks()

    loading.value = false
    error.value = null

    startQuiz.mockResolvedValue(undefined)

    wrapper = mount(QuizStart, {
      global: {
        stubs: {
          VCard: VCardStub,
          VCardItem: VCardItemStub,
          VCardTitle: VCardTitleStub,
          VCardSubtitle: VCardSubtitleStub,
          VAlert: VAlertStub,
          QuizStartForm: QuizStartFormStub,
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
    it('renders the title', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain('Ready to test your knowledge?')
    })

    it('renders the subtitle', () => {
      // Act
      const result = wrapper.text()

      // Assert
      expect(result).toContain(
        'Customize your quiz, choose your difficulty and get started!',
      )
    })

    it('passes loading state to the quiz start form', async () => {
      // Arrange
      loading.value = true
      await wrapper.vm.$nextTick()

      // Act
      const form = wrapper.findComponent(QuizStartFormStub)

      // Assert
      expect(form.props('loading')).toBe(true)
    })

    it('does not render an error alert when there is no error', () => {
      // Assert
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('renders an error alert when an error occurs', async () => {
      // Arrange
      error.value = new Error('Failed to retrieve questions.')
      await wrapper.vm.$nextTick()

      // Act
      const alert = wrapper.find('[role="alert"]')

      // Assert
      expect(alert.exists()).toBe(true)
      expect(alert.text()).toContain('Failed to retrieve questions.')
    })
  })

  describe('Starting quiz', () => {
    it('calls startQuiz with the data emitted by the form', async () => {
      // Arrange
      const quizData: QuizStartData = {
        amount: 10,
        difficulty: null,
        type: null,
      }

      // Act
      wrapper.findComponent(QuizStartFormStub).vm.$emit('start', quizData)
      await flushPromises()

      // Assert
      expect(startQuiz).toHaveBeenCalledWith(quizData)
    })

    it('emits started when the quiz starts successfully', async () => {
      // Arrange
      const quizData: QuizStartData = {
        amount: 10,
        difficulty: null,
        type: null,
      }

      // Act
      wrapper.findComponent(QuizStartFormStub).vm.$emit('start', quizData)
      await flushPromises()

      // Assert
      expect(wrapper.emitted('started')).toHaveLength(1)
    })

    it('does not emit started when starting the quiz fails', async () => {
      // Arrange
      startQuiz.mockImplementation(async () => {
        error.value = new Error('Failed to retrieve questions.')
      })

      // Act
      wrapper.findComponent(QuizStartFormStub).vm.$emit('start', {
        amount: 10,
        difficulty: null,
        type: null,
      })
      await flushPromises()

      // Assert
      expect(wrapper.emitted('started')).toBeUndefined()
    })

    it('shows error when starting quiz fails', async () => {
      // Arrange
      startQuiz.mockImplementation(async () => {
        error.value = new Error('Failed to retrieve questions.')
      })

      // Act
      wrapper.findComponent(QuizStartFormStub).vm.$emit('start', {
        amount: 10,
        difficulty: null,
        type: null,
      })
      await flushPromises()

      // Assert
      expect(wrapper.find('[role="alert"]').text())
        .toContain('Failed to retrieve questions.')
      expect(wrapper.emitted('started')).toBeUndefined()
    })
  })
})
