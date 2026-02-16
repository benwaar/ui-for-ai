import { Routes } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', redirectTo: '/chatbot', pathMatch: 'full' },
  { path: 'chatbot', component: ChatbotComponent }
];
