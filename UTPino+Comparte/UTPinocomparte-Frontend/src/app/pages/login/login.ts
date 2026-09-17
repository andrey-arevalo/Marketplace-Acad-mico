import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login', // (o el nombre que corresponda)
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html', // o el nombre de su respectivo html
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Lógica del componente
}