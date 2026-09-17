import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailproduct', // (o el nombre que corresponda)
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-product.html', // o el nombre de su respectivo html
  styleUrls: ['./detail-product.css']
})
export class DetailProductComponent {
  // Lógica del componente
}