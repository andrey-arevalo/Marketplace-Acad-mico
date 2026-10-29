import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService); 
  private productService = inject(ProductService);

  usuario: any = null; 
  misPublicaciones: any[] = [];
  loadingPublicaciones: boolean = true;

ngOnInit(): void {
    this.authService.usuario$.subscribe({
      next: (data) => { this.usuario = data; }
    });
    this.cargarPublicaciones(); // <--- Creamos un método reutilizable
  }

  cargarPublicaciones(): void {
    this.loadingPublicaciones = true;
    this.productService.getMisPublicaciones().subscribe({
      next: (response: any) => {
        console.log('Publicaciones recibidas:', response);
        this.misPublicaciones = Array.isArray(response) ? response : (response.data || []);
        this.loadingPublicaciones = false;
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones', err);
        this.loadingPublicaciones = false;
      }
    });
  }

eliminarPublicacion(publiId: number): void {
    console.log('ID de publicación a eliminar:', publiId);

    if (!publiId) {
      alert('Error: No se encontró el identificador de la publicación.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.productService.eliminarPublicacion(publiId).subscribe({
        next: (res) => {
          console.log('Eliminado con éxito:', res);
          // Recargamos la lista limpia desde el servidor
          this.cargarPublicaciones();
          alert('Publicación eliminada correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar el producto.');
        }
      });
    }
  }
}