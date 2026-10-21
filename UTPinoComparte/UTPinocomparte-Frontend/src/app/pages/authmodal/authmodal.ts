import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-authmodal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './authmodal.html',
  styleUrl: './authmodal.css'
})
export class AuthModalComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('¡ESTOY EN EL MODAL DE BIENVENIDA /AUTH!');
  }

  // 1. Lógica para autenticación con Google
  loginConGoogle() {
    console.log('Redirigiendo a Google OAuth...');
    
    // Opción A: Redirección directa a un endpoint de tu backend PHP que maneje Google OAuth
    // window.location.href = 'http://localhost/utpino-backend/auth_google.php';

    // Opción B: Simulación interactiva funcional por ahora
    const correoSimulado = 'usuario.google@utp.edu.pe';
    localStorage.setItem('usuario', 'Google User');
    alert(`¡Autenticación exitosa con Google!\nBienvenido: ${correoSimulado}`);
    this.router.navigate(['/dashboard']);
  }

  // 2. Lógica para autenticación con Microsoft
  loginConMicrosoft() {
    console.log('Redirigiendo a Microsoft Azure AD...');
    
    // Opción A: Redirección directa a un endpoint de tu backend PHP que maneje Microsoft OAuth
    // window.location.href = 'http://localhost/utpino-backend/auth_microsoft.php';

    // Opción B: Simulación interactiva funcional por ahora
    const correoSimulado = 'usuario.microsoft@utp.edu.pe';
    localStorage.setItem('usuario', 'Microsoft User');
    alert(`¡Autenticación exitosa con Microsoft!\nBienvenido: ${correoSimulado}`);
    this.router.navigate(['/dashboard']);
  }
}