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
  
  // Variable para almacenar el archivo de la foto seleccionado
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  // Método que captura la imagen seleccionada por el usuario
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

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

    // Creamos un FormData para enviar texto y archivos simultáneamente
    const formData = new FormData();
    formData.append('nombre', this.registerName);
    formData.append('correo', this.registerEmail); // Nota: mantenemos 'correo' tal como lo usabas antes
    formData.append('password', this.registerPassword);

    // Si el usuario seleccionó una foto, la adjuntamos al FormData
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.authService.registrarUsuario(formData).subscribe({
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