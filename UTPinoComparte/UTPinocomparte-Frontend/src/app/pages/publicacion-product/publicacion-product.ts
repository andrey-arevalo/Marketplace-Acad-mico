import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

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
  archivoSeleccionado: File | null = null;

  // Categorías sincronizadas con tu BD de MySQL (Sin "Hogar")
  categorias = [
    { id: 1, nombre: 'Electrónica' },
    { id: 2, nombre: 'Ropa' },
    { id: 4, nombre: 'Vehículos' },
    { id: 5, nombre: 'Libros' },
    { id: 6, nombre: 'Arte' },
    { id: 7, nombre: 'Deportes' },
    { id: 8, nombre: 'Colección' }
  ];

  producto = {
    nom_prod: '',
    precio: 0,
    stock: 1,
    cat_prodid: 0,
    estado: 'Disponible',
    desc_prod: '',
    motivo_intercambio: ''
  };

  // Método para capturar el archivo subido en el input type="file"
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  crearProducto(): void {
    this.errorMessage = '';

    if (!this.producto.nom_prod.trim()) {
      this.errorMessage = 'El nombre del producto es obligatorio.';
      return;
    }

    if (this.producto.precio <= 0) {
      this.errorMessage = 'El precio debe ser mayor que 0.';
      return;
    }

    if (this.producto.stock <= 0) {
      this.errorMessage = 'El stock debe ser al menos 1.';
      return;
    }

    if (!this.producto.cat_prodid || this.producto.cat_prodid === 0) {
      this.errorMessage = 'Debes seleccionar una categoría válida.';
      return;
    }

    if (!this.archivoSeleccionado) {
      this.errorMessage = 'Debes adjuntar una fotografía del producto.';
      return;
    }

    if (this.producto.estado === 'Disponible' && this.producto.precio > 1000) {
      this.errorMessage = 'El precio máximo permitido es de S/ 1,000.';
      return;
    }

    this.loading = true;

    // Construimos el FormData para enviarlo tal cual lo espera Laravel
    const formData = new FormData();
    formData.append('nom_prod', this.producto.nom_prod);
    formData.append('precio', this.producto.precio.toString());
    formData.append('stock', this.producto.stock.toString());
    formData.append('desc_prod', this.producto.desc_prod || '');
    formData.append('cat_prodid', this.producto.cat_prodid.toString());
    formData.append('estado', this.producto.estado);
    formData.append('motivo_intercambio', this.producto.motivo_intercambio || '');

    if (this.archivoSeleccionado) {
      formData.append('img_prod', this.archivoSeleccionado);
    }

    // Llamada al servicio
    this.productService.crearProducto(formData).subscribe({
      next: (response) => {
        alert('¡Producto y publicación creados con éxito!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.errorMessage = error?.error?.message || 'No se pudo crear el producto. Revisa los datos.';
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}