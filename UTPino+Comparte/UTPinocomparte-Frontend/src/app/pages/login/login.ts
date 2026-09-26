import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginEmail: string = '';
  loginPassword: string = '';
  loginMessage: string = '';
  showLoginPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loginMessage = '';

    // Validar campos vacíos
    if (!this.loginEmail || !this.loginPassword) {
      this.loginMessage = 'Por favor, completa todos los campos.';
      return;
    }

    const datosLogin = {
      correo: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.iniciarSesion(datosLogin).subscribe({
      next: (respuestaCruda: any) => {
        try {
          const response = typeof respuestaCruda === 'string' ? JSON.parse(respuestaCruda) : respuestaCruda;
          
          if (response.success) {
            const nombreReal = response.nom_us;
            const fotoReal = response.foto ? 'http://localhost/utpino-backend/' + response.foto : null;

            // Actualizamos la sesión globalmente a través del servicio (actualiza el header al instante)
            this.authService.actualizarSesion(nombreReal, fotoReal);

            alert(response.message);
            this.router.navigate(['/inicio']); // Redirige al inicio
          } else {
            this.loginMessage = response.message || 'Credenciales incorrectas.';
          }
        } catch (e) {
          console.error('Error al parsear JSON:', respuestaCruda);
          this.loginMessage = 'Error en la respuesta del servidor.';
        }
      },
      error: (err) => {
        console.error('Error de red:', err);
        this.loginMessage = 'Error de conexión con el servidor.';
      }
    });
  }
}