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
            localStorage.setItem('usuario', response.usuario);
            alert(response.message || '¡Inicio de sesión exitoso!');
            this.router.navigate(['/dashboard']); 
          } else {
            this.loginMessage = response.message || 'Correo o contraseña incorrectos.';
          }
        } catch (e) {
          console.error('Error al parsear JSON en login:', respuestaCruda);
          this.loginMessage = 'El servidor PHP devolvió un formato no válido.';
        }
      },
      error: (err) => {
        console.error('Error de red en login:', err);
        this.loginMessage = 'No se pudo conectar con el servidor PHP en XAMPP.';
      }
    });
  }
}