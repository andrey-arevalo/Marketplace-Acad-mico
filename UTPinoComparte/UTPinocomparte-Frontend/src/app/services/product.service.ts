import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  productoid?: number;
  nom_prod: string;
  img_prod?: string | null;
  precio: number;
  stock: number;
  estado: string;
  cat_prodid: number;
  categoria?: string;
}

export interface ProductoPayload {
  nom_prod: string;
  img_prod?: string;
  precio: number;
  stock: number;
  estado: string;
  cat_prodid: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/publicaciones';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // AQUÍ ESTÁ LA CLAVE: Adjuntamos el Token del localStorage en los headers
  crearProducto(producto: ProductoPayload | FormData): Observable<any> {
    // Busca el token con el nombre que usen en el Login (ajusta 'token' o 'auth_token' si es necesario)
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Ojo: No pongas 'Content-Type' cuando usas FormData, Angular lo calcula solo.
    });

    return this.http.post<any>(this.apiUrl, producto, { headers });
  }

  actualizarProducto(
    id: number,
    producto: ProductoPayload | FormData
  ): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      producto,
      { headers }
    );
  }

  eliminarProducto(id: number): Observable<void> {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers }
    );
  }
  getMisPublicaciones(): Observable<any[]> {
  const token = localStorage.getItem('auth_token') || '';
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Apunta a la nueva ruta que creamos en Laravel
  return this.http.get<any[]>('http://127.0.0.1:8000/api/mis-publicaciones', { headers });
}
  eliminarPublicacion(id: number): Observable<any> {
  const token = localStorage.getItem('auth_token') || '';
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.delete(`http://127.0.0.1:8000/api/publicaciones/${id}`, { headers });
  }
}