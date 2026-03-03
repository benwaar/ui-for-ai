import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChatbotMessage,
  ChatbotRequest,
  ChatbotCorrection,
  ChatbotCorrectionResponse,
  ConversationHistory
} from '../models/chatbot.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/chatbot`;

  sendMessage(request: ChatbotRequest): Observable<ChatbotMessage> {
    return this.http.post<ChatbotMessage>(`${this.apiUrl}/message`, request);
  }

  correctMessage(correction: ChatbotCorrection): Observable<ChatbotCorrectionResponse> {
    return this.http.post<ChatbotCorrectionResponse>(`${this.apiUrl}/correct`, correction);
  }

  getHistory(): Observable<ConversationHistory> {
    return this.http.get<ConversationHistory>(`${this.apiUrl}/history`);
  }
}
