import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro', // (o el nombre que corresponda)
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro.html', // o el nombre de su respectivo html
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  // Lógica del componente
}