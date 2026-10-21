import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apuntamos únicamente a la carpeta base del backend en XAMPP
  private apiUrl = 'http://localhost/utpino-backend';

  constructor(private http: HttpClient) { }

  iniciarSesion(credenciales: { correo: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, credenciales, { responseType: 'text' });
  }

  // Acepta tanto un objeto normal como un FormData (cuando incluye archivos)
  registrarUsuario(userData: FormData | any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro.php`, userData, { responseType: 'text' });
  }
}