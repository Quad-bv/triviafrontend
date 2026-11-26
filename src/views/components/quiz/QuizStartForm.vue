<template>
  <v-form
    ref="form"
    @submit.prevent="validateForm"
  >
    <v-col>
      <v-number-input
        v-model.number="amount"
        inset
        label="Number of questions"
        :max="50"
        :min="1"
        :rules="amountRules"
        :step="1"
        variant="outlined"
      />

      <v-select
        v-model="difficulty"
        item-title="title"
        item-value="value"
        :items="difficultyOptions"
        label="Difficulty"
        placeholder="Any difficulty"
        variant="outlined"
      />

      <v-select
        v-model="type"
        item-title="title"
        item-value="value"
        :items="questionTypeOptions"
        label="Question type"
        placeholder="Any type"
        variant="outlined"
      />

      <v-row justify="end">
        <Button
          :disabled="loading"
          :loading="loading"
          type="submit"
          variant="text"
        >
          Start quiz
        </Button>
      </v-row>
    </v-col>
  </v-form>
</template>

<script lang="ts" setup>
  import type { Difficulty } from '@/models/enums/Difficulty'
  import type { QuestionType } from '@/models/enums/QuestionType'
  import type { QuizStartData } from '@/models/QuizStartData.ts'
  import type { VForm } from 'vuetify/components'
  import { ref } from 'vue'
  import { useQuizOptions } from '@/composables/useQuizOptions'
  import Button from '@/views/components/generics/Button.vue'

  const { loading } = defineProps<{
    loading: boolean
  }>()

  const emit = defineEmits<{
    start: [data: QuizStartData]
  }>()

  const form = ref<VForm | null>(null)

  const amount = ref(10)

  type DifficultyOption = Difficulty | 'any'
  type QuestionTypeOption = QuestionType | 'random'
  const difficulty = ref<DifficultyOption>('any')
  const type = ref<QuestionTypeOption>('random')

  const { difficultyOptions, questionTypeOptions } = useQuizOptions()

  const amountRules = [
    (value: number | string | null) => {
      if (value === null || value === '') {
        return 'Number of questions is required.'
      }

      const number = Number(value)

      if (!Number.isInteger(number)) {
        return 'Please enter a whole number.'
      }

      if (number < 1) {
        return 'At least 1 question is required.'
      }

      if (number > 50) {
        return 'A maximum of 50 questions is allowed.'
      }

      return true
    },
  ]

  async function validateForm () {
    const result = await form.value?.validate()

    if (!result?.valid) return

    emit('start', {
      amount: amount.value,
      difficulty: difficulty.value === 'any'
        ? null
        : difficulty.value,
      type: type.value === 'random'
        ? null
        : type.value,
    })
  }
</script>
