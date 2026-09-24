import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerPasswordConfirm: string = '';
  registerMessage: string = '';
  showRegisterPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegistro() {
    this.registerMessage = '';

    // Validar campos vacíos
    if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerPasswordConfirm) {
      this.registerMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.registerPassword !== this.registerPasswordConfirm) {
      this.registerMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const datosRegistro = {
      nombre: this.registerName,
      correo: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.registrarUsuario(datosRegistro).subscribe({
      next: (respuestaCruda: any) => {
        try {
          const response = typeof respuestaCruda === 'string' ? JSON.parse(respuestaCruda) : respuestaCruda;
          
          if (response.success) {
            alert(response.message || '¡Cuenta creada exitosamente!');
            this.router.navigate(['/login']); 
          } else {
            this.registerMessage = response.message || 'Error al registrarse.';
          }
        } catch (e) {
          console.error('Error al parsear JSON:', respuestaCruda);
          this.registerMessage = 'El servidor PHP devolvió un formato no válido.';
        }
      },
      error: (err) => {
        console.error('Error de red en registro:', err);
        this.registerMessage = 'No se pudo conectar con el servidor PHP en XAMPP.';
      }
    });
  }
}