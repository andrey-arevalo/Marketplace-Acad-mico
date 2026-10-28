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
    // 1. Obtenemos los datos del usuario directamente del AuthService (que lee localStorage y normaliza la foto)
    this.authService.usuario$.subscribe({
      next: (data) => {
        this.usuario = data;
      }
    });

    // 2. Cargamos las publicaciones creadas por el usuario
    this.productService.getMisPublicaciones().subscribe({
      next: (data) => {
        this.misPublicaciones = data;
        this.loadingPublicaciones = false;
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones del usuario', err);
        this.loadingPublicaciones = false;
      }
    });
  }
}