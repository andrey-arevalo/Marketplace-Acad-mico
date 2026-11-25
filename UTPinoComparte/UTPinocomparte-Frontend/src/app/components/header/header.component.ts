import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

declare var bootstrap: any; // Permite controlar los modales de Bootstrap mediante JS

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private readonly chatService = inject(ChatService);

  usuarioLogueado: string | null = null;
  inicialUsuario: string = '';
  fotoUsuario: string | null = null;

  // 🌙 Control de modo oscuro
  isDarkMode: boolean = false;

  // Control de Burbuja de chat (solo logueado y fuera de page/chat)
  enRutaChat: boolean = false;
  totalNoLeidos: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  get mostrarBurbujaChat(): boolean {
    return Boolean(this.usuarioLogueado) && !this.enRutaChat;
  }

  ngOnInit() {
    // 1. Verificamos el tema guardado en el almacenamiento local al iniciar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }

    // 2. Nos suscribimos al observable escuchando múltiples variantes de campos de Laravel
    this.authService.usuario$.subscribe((data: any) => {
      console.log('Datos del usuario en el Header:', data);

      const nombreUsuario = data?.nombre || data?.name || data?.nom_us;
      const rawFoto = data?.foto || data?.avatar || data?.img_us;

      if (data && nombreUsuario) {
        this.usuarioLogueado = nombreUsuario;
        this.inicialUsuario = (nombreUsuario as string).charAt(0).toUpperCase();

        if (rawFoto) {
          this.fotoUsuario = rawFoto.startsWith('http')
            ? rawFoto
            : `http://127.0.0.1:8000/storage/${rawFoto}`;
        } else {
          this.fotoUsuario = null;
        }

        this.actualizarTotalNoLeidos();
      } else {
        this.usuarioLogueado = null;
        this.fotoUsuario = null;
        this.inicialUsuario = '';
        this.totalNoLeidos = 0;
      }
    });

    // 3. Detecta si estamos en /chat para ocultar la burbuja cuando ya estás ahí y refresca contador
    this.enRutaChat = this.router.url.startsWith('/chat');
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.enRutaChat = event.urlAfterRedirects.startsWith('/chat');
        if (this.usuarioLogueado) {
          this.actualizarTotalNoLeidos();
        }
      });
  }

  actualizarTotalNoLeidos(): void {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) {
      this.totalNoLeidos = 0;
      return;
    }

    this.chatService.obtenerTotalNoLeidos().subscribe({
      next: (total) => {
        this.totalNoLeidos = total;
      },
      error: () => {
        this.totalNoLeidos = 0;
      }
    });
  }

  irAChat(): void {
    this.router.navigate(['/chat']);
  }

  // 🌙 Función para alternar el modo oscuro / claro
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  // Función para cerrar sesión usando el servicio
  cerrarSesion() {
    this.totalNoLeidos = 0;
    this.authService.cerrarSesion();
    this.router.navigate(['/inicio']);
  }

  // Función que controla si abre el modal de publicar o pide iniciar sesión
  verificarAccesoPublicar() {
    if (this.usuarioLogueado) {
      const modalElement = document.getElementById('modalPublicar');
      if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement);
        myModal.show();
      }
    } else {
      alert('Por favor, inicia sesión para poder publicar un artículo.');
      this.router.navigate(['/auth']);
    }
  }
}