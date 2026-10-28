import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = 'http://127.0.0.1:8000/api/publicaciones';

  constructor(private http: HttpClient) {}

  crearPublicacion(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Nota: No pongas 'Content-Type': 'multipart/form-data' manual, 
      // HttpClient se encarga de calcular el boundary automáticamente con FormData.
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}