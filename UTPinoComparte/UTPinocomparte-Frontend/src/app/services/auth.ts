import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/utpino-backend/'; // Ajusta tu URL si es diferente

  // BehaviorSubject para notificar cambios de sesión en tiempo real
  private usuarioSubject = new BehaviorSubject<{ nombre: string | null, foto: string | null }>({
    nombre: localStorage.getItem('usuario'),
    foto: localStorage.getItem('foto_usuario')
  });

  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  iniciarSesion(credenciales: any): Observable<any> {
    return this.http.post(this.apiUrl + 'login.php', credenciales);
  }

  // Método para actualizar el estado global al iniciar sesión
  actualizarSesion(nombre: string, foto: string | null) {
    localStorage.setItem('usuario', nombre);
    if (foto) {
      localStorage.setItem('foto_usuario', foto);
    } else {
      localStorage.removeItem('foto_usuario');
    }
    this.usuarioSubject.next({ nombre, foto });
  }

  // Método para cerrar sesión limpiando el estado
  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('foto_usuario');
    this.usuarioSubject.next({ nombre: null, foto: null });
  }
    // Acepta tanto un objeto normal como un FormData (cuando incluye archivos)
  registrarUsuario(userData: FormData | any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro.php`, userData, { responseType: 'text' });
  }
}