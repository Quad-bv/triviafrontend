
import { computed, ref } from 'vue';
import type { Answer, AnswerInput } from '@/models/Answer';
import { useAnswerService } from '@/composables/useAnswerService';

interface QuizAnswerOptions {
    question: string;
    answers: AnswerInput[];
    verificationToken: string;
    maxAttempts?: number;
}

export function useQuizQuestion(options: QuizAnswerOptions) {
    const answerService = useAnswerService();

    // Initialize localAnswers
    const localAnswers = ref<Answer[]>(
        options.answers.map(answer => ({
            ...answer,
            guessed: false,
            correct: null,
        }))
    );

    const selectedAnswer = ref<string | null>(null);
    const isChecking = ref(false);
    const attempts = ref(0);

    // Calculate quiz state
    const attemptLimit = computed(() =>
        options.maxAttempts ?? options.answers.length - 1
    );

    const isFinished = computed(() =>
        localAnswers.value.some(answer => answer.correct === true) ||
        (attemptLimit.value > 0 && attempts.value >= attemptLimit.value)
    );

    const answers = computed(() => localAnswers.value);

    function hasReachedAttemptLimit() {
        return attemptLimit.value > 0 &&
            attempts.value >= attemptLimit.value;
    }

    // Submit and process answers
    async function submitAnswer(answer: string | null): Promise<boolean | null> {
        if (answer === null || isChecking.value || isFinished.value) {
            return null;
        }

        const selected = localAnswers.value.find(a => a.text === answer);

        if (!selected || selected.guessed) {
            selectedAnswer.value = null;
            return null;
        }

        isChecking.value = true;

        try {
            // Check the selected answer with the backend
            const response = await checkAnswer(answer);

            // Update the selected answer and attempt count
            selected.correct = response.correct;
            selected.guessed = true;
            attempts.value++;

            // Reveal the correct answer when attempts are exhausted
            if (!response.correct && hasReachedAttemptLimit()) {
                await revealCorrectAnswer();
            }

            return response.correct;
        } catch (error) {
            console.error('Failed to check answer:', error);
            return null;
        } finally {
            selectedAnswer.value = null;
            isChecking.value = false;
        }
    }

    // Send an answer to the backend for verification
    function checkAnswer(answer: string) {
        return answerService.checkAnswer({
            question: options.question,
            selectedAnswer: answer,
            verificationToken: options.verificationToken,
        });
    }

    // Check the remaining answers to reveal the correct one
    async function revealCorrectAnswer() {
        const remainingAnswers = localAnswers.value.filter(
            answer => !answer.guessed
        );

        try {
            for (const answer of remainingAnswers) {
                const response = await checkAnswer(answer.text);

                if (response.correct) {
                    answer.correct = true;
                    break;
                }
            }
        } catch (error) {
            console.error('Failed to reveal correct answer:', error);
        }
    }

    // Expose reactive state and public functions
    return {
        selectedAnswer,
        isChecking,
        attempts,
        attemptLimit,
        answers,
        isFinished,
        submitAnswer,
    };
}
