import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/perfil'; // Ajusta la URL según tu backend

  getProfile(): Observable<Profile> {
    // Obtenemos el token guardado en el navegador tras el login
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Profile>(this.apiUrl, { headers });
  }
}