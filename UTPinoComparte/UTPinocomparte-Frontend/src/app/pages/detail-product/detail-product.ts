import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Producto } from '../../services/product.service';

@Component({
  selector: 'app-detailproduct',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './detail-product.html',
  styleUrls: ['./detail-product.css']
})
export class DetailProductComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  producto: Producto | null = null;

  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.errorMessage =
        'El producto solicitado no es válido.';

      this.loading = false;

      return;
    }

    this.cargarProducto(id);
  }

  cargarProducto(id: number): void {
    this.productService.getProducto(id).subscribe({
      next: (producto) => {
        this.producto = producto;

        this.loading = false;
      },
      error: (error) => {
        console.error(
          'Error al obtener producto:',
          error
        );

        this.errorMessage =
          'No se pudo encontrar el producto.';

        this.loading = false;
      }
    });
  }

  get autorId(): number | null {
    const p: any = this.producto;
    if (!p) return null;

    const rawId =
      p.usuario?.usuarioid ??
      p.usuario?.id ??
      p.publicacion?.usuario?.usuarioid ??
      p.publicacion?.usuario?.id ??
      p.usuarioid ??
      p.publicacion?.usuarioid ??
      null;

    return rawId ? Number(rawId) : null;
  }

  get autorNombre(): string {
    const p: any = this.producto;
    return (
      p?.usuario?.nom_us ??
      p?.usuario?.nombre ??
      p?.usuario?.name ??
      p?.publicacion?.usuario?.nom_us ??
      p?.publicacion?.usuario?.nombre ??
      p?.nom_us ??
      'Usuario'
    );
  }

  get autorFoto(): string | null {
    const p: any = this.producto;
    const rawFoto =
      p?.usuario?.foto ??
      p?.usuario?.avatar ??
      p?.usuario?.img_us ??
      p?.publicacion?.usuario?.foto ??
      p?.foto ??
      null;

    return this.formatearUrlImagen(rawFoto);
  }

  get descripcionProducto(): string {
    const p: any = this.producto;
    return (
      p?.descripcion ??
      p?.desc_prod ??
      p?.detalle ??
      p?.publicacion?.descripcion ??
      ''
    );
  }

  irAPerfilPublico(): void {
    if (this.autorId) {
      this.router.navigate(['/perfil-publico', this.autorId]);
    }
  }

  enviarMensajeAlAutor(): void {
    if (!this.autorId) return;

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/chat?destinatarioId=${this.autorId}` }
      });
      return;
    }

    this.router.navigate(['/chat'], {
      queryParams: { destinatarioId: this.autorId }
    });
  }

  formatearUrlImagen(ruta?: string | null): string | null {
    if (!ruta) return null;
    if (ruta.startsWith('http://') || ruta.startsWith('https://') || ruta.startsWith('assets/')) {
      return ruta;
    }
    return `http://127.0.0.1:8000/storage/${ruta}`;
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  eliminarProducto(): void {
    if (!this.producto?.productoid) {
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar este producto?'
    );

    if (!confirmar) {
      return;
    }

    this.productService
      .eliminarProducto(this.producto.productoid)
      .subscribe({
        next: () => {
          alert('Producto eliminado correctamente.');

          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(
            'Error al eliminar:',
            error
          );

          this.errorMessage =
            'No se pudo eliminar el producto.';
        }
      });
  }
}