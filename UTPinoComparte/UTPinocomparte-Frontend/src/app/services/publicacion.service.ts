import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = 'http://127.0.0.1:8000/api/publicaciones';

  constructor(private http: HttpClient) {}

  // 1. Para listar todas las publicaciones en el catálogo del inicio
  obtenerPublicaciones(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 2. El método que hizo tu compañero para guardar con token y archivos
  crearPublicacion(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}