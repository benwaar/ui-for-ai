import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChatbotMessage,
  ChatbotRequest,
  ChatbotCorrection,
  ConversationHistory
} from '../models/chatbot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:5000/api/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatbotRequest): Observable<ChatbotMessage> {
    return this.http.post<ChatbotMessage>(`${this.apiUrl}/message`, request);
  }

  correctMessage(correction: ChatbotCorrection): Observable<any> {
    return this.http.post(`${this.apiUrl}/correct`, correction);
  }

  getHistory(): Observable<ConversationHistory> {
    return this.http.get<ConversationHistory>(`${this.apiUrl}/history`);
  }
}
