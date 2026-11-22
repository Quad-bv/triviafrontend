/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'


// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import './styles/tailwind.css'
import './styles/main.scss'

// Services
import {answersServiceKey, questionsServiceKey} from "@/services/ServiceKeys.ts";
import QuestionsService from "@/services/QuestionsService.ts";
import AnswersService from "@/services/AnswersService.ts";

const app = createApp(App)

registerPlugins(app)

// Provide Services to the application
app.provide(questionsServiceKey, new QuestionsService());
app.provide(answersServiceKey, new AnswersService());

app.mount('#app')
