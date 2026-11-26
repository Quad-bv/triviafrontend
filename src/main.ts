/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import AnswersService from '@/services/AnswersService.ts'
import FetchHttpClient from '@/services/FetchHttpClient.ts'
import QuestionsService from '@/services/QuestionsService.ts'
// Services
import { answersServiceKey, questionsServiceKey } from '@/services/ServiceKeys.ts'

// Components
import App from './App.vue'
// Styles
import 'unfonts.css'
import './styles/tailwind.css'
import './styles/main.scss'

const app = createApp(App)

registerPlugins(app)

// Provide Services to the application
const httpClient = new FetchHttpClient()

app.provide(
  questionsServiceKey,
  new QuestionsService(httpClient),
)

app.provide(
  answersServiceKey,
  new AnswersService(httpClient),
)

app.mount('#app')
