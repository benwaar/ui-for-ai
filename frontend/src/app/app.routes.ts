import { Routes } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { AgentComponent } from './components/agent/agent.component';
import { DmiComponent } from './components/dmi/dmi.component';

export const routes: Routes = [
  { path: '', redirectTo: '/chatbot', pathMatch: 'full' },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'agent', component: AgentComponent },
  { path: 'dmi', component: DmiComponent }
];
