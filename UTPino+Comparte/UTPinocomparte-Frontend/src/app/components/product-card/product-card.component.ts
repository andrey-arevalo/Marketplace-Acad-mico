import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type TipoPublicacion = 'venta' | 'intercambio';

export interface ProductCardData {
  productoid?: number;
  nom_prod: string;
  img_prod?: string;
  precio?: number | null;
  stock?: number;
  categoria?: string;
  tipoPublicacion?: TipoPublicacion;
  estado?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardData;

  get esIntercambio(): boolean {
    return this.product.tipoPublicacion === 'intercambio';
  }
}
