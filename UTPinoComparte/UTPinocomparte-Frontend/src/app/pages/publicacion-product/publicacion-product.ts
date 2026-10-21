import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProductService,
  ProductoPayload
} from '../../service/product.service';

@Component({
  selector: 'app-publicacionproduct',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './publicacion-product.html',
  styleUrls: ['./publicacion-product.css']
})
export class PublicacionProductComponent {

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  errorMessage: string = '';
  loading: boolean = false;

  categorias = [
    { id: 1, nombre: 'Electrónica' },
    { id: 2, nombre: 'Ropa' },
    { id: 3, nombre: 'Libros' },
    { id: 4, nombre: 'Arte' },
    { id: 5, nombre: 'Deportes' },
    { id: 6, nombre: 'Colección' }
  ];

  producto: ProductoPayload = {
    nom_prod: '',
    img_prod: '',
    precio: 0,
    stock: 0,
    estado: '',
    cat_prodid: 0
  };

  crearProducto(): void {

    this.errorMessage = '';

    if (!this.producto.nom_prod.trim()) {

      this.errorMessage =
        'El nombre del producto es obligatorio.';

      return;
    }

    if (
      this.producto.precio === null ||
      this.producto.precio <= 0
    ) {

      this.errorMessage =
        'El precio debe ser mayor que 0.';

      return;
    }

    if (this.producto.stock < 0) {

      this.errorMessage =
        'El stock no puede ser negativo.';

      return;
    }

    if (!this.producto.cat_prodid) {

      this.errorMessage =
        'Debes seleccionar una categoría.';

      return;
    }

    if (!this.producto.estado.trim()) {

      this.errorMessage =
        'Debes seleccionar un estado.';

      return;
    }

    this.loading = true;

    this.productService
      .crearProducto(this.producto)
      .subscribe({

        next: () => {

          alert(
            'Producto creado correctamente.'
          );

          this.router.navigate(['/']);

        },

        error: (error) => {

          console.error(
            'Error al crear producto:',
            error
          );

          this.errorMessage =
            'No se pudo crear el producto.';

          this.loading = false;
        }

      });
  }

  cancelar(): void {

    this.router.navigate(['/']);
  }
}
