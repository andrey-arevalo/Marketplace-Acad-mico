import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio', // (o el nombre que corresponda)
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html', // o el nombre de su respectivo html
  styleUrls: ['./inicio.css']
})
export class IncioComponent {
  // Lógica del componente
}