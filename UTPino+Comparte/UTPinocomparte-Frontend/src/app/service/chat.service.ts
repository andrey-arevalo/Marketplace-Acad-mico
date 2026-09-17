import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mensaje {
  idRemitente: number;
  idDestinatario: number;
  contenido: string;
  fechaEnvio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Ajusta la URL según tu backend
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  // Obtener el historial de mensajes entre dos usuarios
  obtenerHistorial(idRemitente: number, idDestinatario: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/historial/${idRemitente}/${idDestinatario}`);
  }

  // Enviar un nuevo mensaje
  enviarMensaje(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/enviar`, mensaje);
  }
}
