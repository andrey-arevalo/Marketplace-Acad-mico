import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URLs para tus archivos PHP en XAMPP
  private apiUrlRegistro = 'http://localhost/utpino-backend/registro.php';
  private apiUrlLogin = 'http://localhost/utpino-backend/login.php'; // Cambia esto si usas el mismo archivo

  constructor(private http: HttpClient) { }

  registrarUsuario(datos: { nombre: string, correo: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrlRegistro, datos);
  }

  // Agrega este método para que coincida con tu componente
  iniciarSesion(credenciales: { correo: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrlLogin, credenciales);
  }
}