import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

declare var bootstrap: any; // Permite controlar los modales de Bootstrap mediante JS

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  usuarioLogueado: string | null = null;
  inicialUsuario: string = '';
  fotoUsuario: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Nos suscribimos al observable para escuchar cambios de sesión en tiempo real
    this.authService.usuario$.subscribe(data => {
      this.usuarioLogueado = data.nombre;
      this.fotoUsuario = data.foto;
      
      if (this.usuarioLogueado) {
        this.inicialUsuario = this.usuarioLogueado.charAt(0).toUpperCase();
      } else {
        this.inicialUsuario = '';
      }
    });
  }

  // Función para cerrar sesión usando el servicio
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/inicio']); // Redirige al inicio
  }

  // Función que controla si abre el modal de publicar o pide iniciar sesión
  verificarAccesoPublicar() {
    const usuarioActivo = localStorage.getItem('usuario');

    if (usuarioActivo) {
      // Si está logueado: Abre el modal de Bootstrap de forma dinámica
      const modalElement = document.getElementById('modalPublicar');
      if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement);
        myModal.show();
      }
    } else {
      // Si NO está logueado: Alerta y redirección al auth
      alert('Por favor, inicia sesión para poder publicar un artículo.');
      this.router.navigate(['/auth']); 
    }
  }
}