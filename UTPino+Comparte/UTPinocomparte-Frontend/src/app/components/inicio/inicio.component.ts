import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Producto } from '../../service/product.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  isAuthModalOpen: boolean = false;
  usuarioLogueado: string | null = null;

  isRegisterMode: boolean = false;
  isArticleModalOpen: boolean = false;

  loginEmail: string = '';
  loginPassword: string = '';
  showLoginPassword: boolean = false;
  loginMessage: string = '';

  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerPasswordConfirm: string = '';
  showRegisterPassword: boolean = false;
  showConfirmPassword: boolean = false;
  registerMessage: string = '';

  productos: Producto[] = [];
  filteredProductos: Producto[] = [];

  searchTerm: string = '';
  selectedCategory: number | null = null;
  selectedTab: string = 'all';

  loading: boolean = false;
  errorMessage: string = '';

  categorias = [
    { id: 1, nombre: 'Electrónica' },
    { id: 2, nombre: 'Ropa' },
    { id: 3, nombre: 'Hogar' },
    { id: 4, nombre: 'Vehículos' },
    { id: 5, nombre: 'Libros' },
    { id: 6, nombre: 'Arte' },
    { id: 7, nombre: 'Deportes' },
    { id: 8, nombre: 'Colección' }
  ];

  newArticle = {
    title: '',
    price: null as number | null,
    category: null as number | null,
    stock: null as number | null,
    estado: '',
    image: ''
  };

  ngOnInit(): void {
    this.usuarioLogueado = localStorage.getItem('usuario');
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos ?? [];
        this.filteredProductos = [...this.productos];
        this.applyFilters();
        this.loading = false;
      },

      error: (error) => {
        console.error('Error al cargar productos:', error);

        this.errorMessage =
          'No se pudieron cargar los productos. Verifica que el backend esté ejecutándose.';

        this.productos = [];
        this.filteredProductos = [];
        this.loading = false;
      }
    });
  }

  buscarProductos(): void {
    this.applyFilters();
  }

  filterCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  filterTab(tab: string): void {
    this.selectedTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm
      .trim()
      .toLowerCase();

    this.filteredProductos = this.productos.filter(producto => {

      const matchesSearch =
        !search ||
        producto.nom_prod
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        this.selectedCategory === null ||
        producto.cat_prodid === this.selectedCategory;

      let matchesTab = true;

      if (this.selectedTab === 'disponibles') {
        matchesTab =
          producto.estado.toLowerCase() === 'disponible';

      } else if (this.selectedTab === 'agotados') {
        matchesTab =
          producto.stock <= 0 ||
          producto.estado.toLowerCase() === 'agotado';
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTab
      );
    });
  }

  getCategoriaNombre(producto: Producto): string {

    if (producto.categoria) {
      return producto.categoria;
    }

    const categoria = this.categorias.find(
      cat => cat.id === producto.cat_prodid
    );

    return categoria
      ? categoria.nombre
      : 'Sin categoría';
  }

  verDetalle(producto: Producto): void {

    if (!producto.productoid) {
      return;
    }

    this.router.navigate([
      '/producto',
      producto.productoid
    ]);
  }

  onAddArticle(): void {

    this.errorMessage = '';

    if (!this.newArticle.title.trim()) {
      this.errorMessage =
        'El nombre del producto es obligatorio.';
      return;
    }

    if (
      this.newArticle.price === null ||
      this.newArticle.price <= 0
    ) {
      this.errorMessage =
        'El precio debe ser mayor que 0.';
      return;
    }

    if (this.newArticle.category === null) {
      this.errorMessage =
        'Selecciona una categoría.';
      return;
    }

    if (
      this.newArticle.stock === null ||
      this.newArticle.stock < 0
    ) {
      this.errorMessage =
        'El stock no puede ser negativo.';
      return;
    }

    if (!this.newArticle.estado.trim()) {
      this.errorMessage =
        'El estado del producto es obligatorio.';
      return;
    }

    const producto = {
      nom_prod: this.newArticle.title.trim(),
      img_prod: this.newArticle.image.trim(),
      precio: this.newArticle.price,
      stock: this.newArticle.stock,
      estado: this.newArticle.estado.trim(),
      cat_prodid: this.newArticle.category
    };

    this.productService.crearProducto(producto).subscribe({

      next: () => {
        this.isArticleModalOpen = false;
        this.resetNewArticle();
        this.cargarProductos();
      },

      error: (error) => {
        console.error(
          'Error al crear producto:',
          error
        );

        this.errorMessage =
          'No se pudo crear el producto.';
      }
    });
  }

  resetNewArticle(): void {

    this.newArticle = {
      title: '',
      price: null,
      category: null,
      stock: null,
      estado: '',
      image: ''
    };
  }

  abrirModal(): void {
    this.isAuthModalOpen = true;
  }

  openAuthModal(): void {
    this.isAuthModalOpen = true;
  }

  cerrarModal(): void {
    this.isAuthModalOpen = false;
  }

  onLogin(): void {
    console.log(
      'Iniciando sesión...',
      this.loginEmail
    );
  }

  onRegister(): void {
    console.log(
      'Registrando...',
      this.registerEmail
    );
  }

  abrirModalProducto(): void {

    this.errorMessage = '';
    this.resetNewArticle();
    this.isArticleModalOpen = true;
  }
}
