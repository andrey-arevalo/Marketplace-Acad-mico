import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf y [ngClass]
import { FormsModule } from '@angular/forms';   // Necesario para [(ngModel)] y (ngSubmit)
import { RouterLink, Router } from '@angular/router'; // Necesario para routerLink
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  // Variables binding con el HTML para el Paso 1
  registerName = '';
  registerCodEst: string = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';
  registerMessage = '';

  // Variables para el Paso 2 (Código OTP)
  codigoOtp = '';
  paso: number = 1; // 1: Formulario de datos, 2: Ingreso de código OTP y foto

  showRegisterPassword = false;
  showConfirmPassword = false;
  selectedFile: File | null = null;
  cargando = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // ==========================================
  // PASO 1: Validar datos y pedir código OTP
  // ==========================================
  onSolicitarCodigo() {
    this.registerMessage = '';

    // Validar contraseñas
    if (this.registerPassword !== this.registerPasswordConfirm) {
      this.registerMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const codEst = this.registerCodEst || this.registerEmail.split('@')[0].toUpperCase();

    const datos = {
      cod_est: codEst,
      nom_us: this.registerName,
      correo: this.registerEmail,
      contrasena: this.registerPassword
    };

    this.cargando = true;

    this.authService.enviarCodigo(datos).subscribe({
      next: (response: any) => {
        this.cargando = false;
        // Si el backend responde bien, pasamos a la pantalla de ingresar el código OTP
        this.paso = 2;
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al enviar código', err);
        if (err.error && err.error.message) {
          this.registerMessage = err.error.message;
        } else {
          this.registerMessage = 'Ocurrió un error al enviar el código a tu correo.';
        }
      }
    });
  }

  // ==========================================
  // PASO 2: Verificar el código OTP y registrar
  // ==========================================
  onVerificarYRegistrar() {
    this.registerMessage = '';

    if (!this.codigoOtp || this.codigoOtp.length !== 6) {
      this.registerMessage = 'Por favor ingresa un código de 6 dígitos válido.';
      return;
    }

    // Usamos FormData para enviar el correo, el código y opcionalmente la foto
    const formData = new FormData();
    formData.append('correo', this.registerEmail);
    formData.append('codigo', this.codigoOtp);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.cargando = true;

    this.authService.verificarYRegistrar(formData).subscribe({
      next: (response: any) => {
        this.cargando = false;
        console.log('Registro y verificación exitosos:', response);
        
        // Guardamos la sesión completa (token y usuario) para que el header reaccione al instante
        const token = response.token;
        const usuario = response.user || response;
        this.authService.saveSession(token, usuario);

        alert('¡Cuenta creada y verificada con éxito en UTPinoComparte!');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error en la verificación', err);
        if (err.error && err.error.message) {
          this.registerMessage = err.error.message;
        } else {
          this.registerMessage = 'El código de verificación es incorrecto o expiró.';
        }
      }
    });
  }
}