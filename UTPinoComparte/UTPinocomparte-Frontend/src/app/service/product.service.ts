import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  private readonly apiUrl = 'http://localhost/utpino-backend/productos';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: ProductoPayload): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(
    id: number,
    producto: ProductoPayload
  ): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
      producto
    );
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
