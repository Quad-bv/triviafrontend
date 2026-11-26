import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useQuestionsService } from '../../../src/composables/services/useQuestionsService'
import { questionsServiceKey } from '../../../src/services/ServiceKeys'

describe('useQuestionsService', () => {
  it('returns the provided QuestionsService', () => {
    // Arrange
    const service = {
      getQuestions: async () => [],
    }

    let result: ReturnType<typeof useQuestionsService> | undefined

    const TestComponent = defineComponent({
      setup () {
        result = useQuestionsService()
        return () => null
      },
    })

    // Act
    mount(TestComponent, {
      global: {
        provide: {
          [questionsServiceKey as symbol]: service,
        },
      },
    })

    // Assert
    expect(result).toBe(service)
  })

  it('throws when QuestionsService is not provided', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const TestComponent = defineComponent({
      setup () {
        useQuestionsService()
        return () => null
      },
    })

    expect(() => mount(TestComponent)).toThrow(
      'QuestionsService was not provided',
    )
    expect(consoleWarn).toHaveBeenCalled()
  })
})
