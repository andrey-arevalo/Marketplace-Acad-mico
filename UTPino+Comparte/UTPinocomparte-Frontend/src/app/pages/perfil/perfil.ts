import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil', // (o el nombre que corresponda)
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html', // o el nombre de su respectivo html
  styleUrls: ['./perfil.css']
})
export class PerfilComponent {
  // Lógica del componente
}