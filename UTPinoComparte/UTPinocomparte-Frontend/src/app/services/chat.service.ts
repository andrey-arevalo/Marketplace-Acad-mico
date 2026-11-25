import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Conversation } from '../model/conversation.model';
import { Mensaje, EnviarMensajePayload } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  getMisConversaciones(): Observable<Conversation[]> {
    return this.http
      .get<Conversation[] | { conversaciones?: Conversation[] }>(
        `${this.apiUrl}/conversaciones`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((resp) => (Array.isArray(resp) ? resp : resp.conversaciones ?? []))
      );
  }

  obtenerTotalNoLeidos(): Observable<number> {
    return this.getMisConversaciones().pipe(
      map((conversaciones) =>
        conversaciones.reduce((acum, conv) => acum + Number(conv.no_leidos ?? 0), 0)
      )
    );
  }

  getMensajesConversacion(
    conversacionid: number,
    limit?: number,
    beforeId?: number | null
  ): Observable<Mensaje[]> {
    let params = new HttpParams();

    if (limit !== undefined && limit !== null) {
      params = params.set('limit', String(limit));
    }

    if (beforeId !== undefined && beforeId !== null) {
      params = params.set('before_id', String(beforeId));
    }

    return this.http
      .get<Mensaje[] | { mensajes?: Mensaje[] }>(
        `${this.apiUrl}/conversaciones/${conversacionid}/mensajes`,
        {
          headers: this.getAuthHeaders(),
          params
        }
      )
      .pipe(
        map((resp) => (Array.isArray(resp) ? resp : resp.mensajes ?? []))
      );
  }

  enviarMensaje(payload: EnviarMensajePayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mensajes`, payload, {
      headers: this.getAuthHeaders()
    });
  }
}