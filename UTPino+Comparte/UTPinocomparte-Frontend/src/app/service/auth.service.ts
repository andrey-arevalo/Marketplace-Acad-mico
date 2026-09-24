import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Apuntamos únicamente a la carpeta base (sin el archivo al final)
  private apiUrl = 'http://localhost/utpino-backend';

  constructor(private http: HttpClient) { }

  iniciarSesion(credenciales: { correo: string, password: string }): Observable<any> {
    // 2. Aquí se une correctamente: .../utpino-comparte-backend/login.php
    return this.http.post(`${this.apiUrl}/login.php`, credenciales, { responseType: 'text' });
  }

  registrarUsuario(userData: any): Observable<any> {
    // 3. Y aquí apunta correctamente a: .../utpino-comparte-backend/registro.php
    return this.http.post(`${this.apiUrl}/registro.php`, userData, { responseType: 'text' });
  }
}