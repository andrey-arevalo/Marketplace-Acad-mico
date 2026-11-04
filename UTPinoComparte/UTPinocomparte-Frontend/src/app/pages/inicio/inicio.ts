import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PublicacionService } from '../../services/publicacion.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})

export class InicioComponent implements OnInit {
  // Inyectamos los servicios necesarios
  private router = inject(Router);
  private authService = inject(AuthService);
  private publicacionService = inject(PublicacionService);

  // Control de visibilidad y estado de sesión
  isAuthModalOpen: boolean = false;
  usuarioLogueado: string | null = null;

  // Modos de vista y modales
  isRegisterMode: boolean = false;
  isArticleModalOpen: boolean = false;

  // Credenciales de Login
  loginEmail: string = '';
  loginPassword: string = '';
  showLoginPassword: boolean = false;
  loginMessage: string = '';

  // Credenciales de Registro
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerPasswordConfirm: string = '';
  showRegisterPassword: boolean = false;
  showConfirmPassword: boolean = false;
  registerMessage: string = '';

  // Propiedades de filtrado
  selectedCategory: string = 'all';
  selectedTab: string = 'all';
  
  // Lista de elementos de referencia (estáticos para mostrar cómo se ve la interfaz)
  itemsReferencia: any[] = [
    {
      title: 'iPhone 13 Pro',
      subtitle: 'Electrónica',
      price: 'S/ 2,500.00',
      oldPrice: 'S/ 2,800.00',
      category: 'electronica',
      type: 'venta',
      image: 'assets/imgs/Iphone.webp',
      isFavorite: false
    },
    {
      title: 'Bicicleta Urbana',
      subtitle: 'Deportes',
      price: 'S/ 650.00',
      oldPrice: null,
      category: 'deportes',
      type: 'venta',
      image: 'assets/imgs/Bicicleta.jpeg',
      isFavorite: false
    },
    {
      title: 'Libro HTML, CSS y JS',
      subtitle: 'Libros',
      price: 'Intercambio',
      oldPrice: null,
      category: 'libros',
      type: 'intercambio',
      image: 'assets/imgs/LibroHTML,CSS,JS.jpeg',
      isFavorite: false
    },
    {
      title: 'MacBook Pro',
      subtitle: 'Electrónica',
      price: 'S/ 4,200.00',
      oldPrice: 'S/ 4,500.00',
      category: 'electronica',
      type: 'venta',
      image: 'assets/imgs/Mackbook.jpeg',
      isFavorite: false
    },
    {
      title: 'Pluma estilo gráfica',
      subtitle: 'Util escolar',
      price: 'S/ 100.00',
      oldPrice: 'S/ 200.00',
      category: 'electronica',
      type: 'venta',
      image: 'assets/imgs/PlumaEstiloGrafica.jpg',
      isFavorite: false
    }
  ];

  // Lista general e ítems filtrados que se muestran en el HTML
  items: any[] = [];
  filteredItems: any[] = [];

  // Objeto para nuevos artículos
  newArticle = {
    title: '',
    price: null,
    category: '',
    subtitle: '',
    image: ''
  };

  // Inicialización al cargar el componente
  ngOnInit() {
    // 1. Verificamos el estado de sesión del usuario
    this.usuarioLogueado = localStorage.getItem('usuario');

    this.authService.usuario$.subscribe({
      next: (user: any) => {
        if (user) {
          this.usuarioLogueado = typeof user === 'string' ? user : (user.nom_usu || user.nombre || user.email);
        }
      }
    });

    // 2. Cargamos las publicaciones reales desde la API y las unimos con las de referencia
    this.publicacionService.obtenerPublicaciones().subscribe({
    next: (response) => {
    const publicacionesReales = Array.isArray(response) ? response : (response.data || []);
    
    const formateados = publicacionesReales.map((pub: any) => ({
      // Mapeamos usando los nombres reales de tu BD (pub.producto.nom_prod, etc.)
      title: pub.producto?.nom_prod || 'Sin título',
      subtitle: pub.producto?.descripcion || 'Artículo de la comunidad',
      price: pub.producto?.estado === 'Disponible' ? `S/ ${pub.producto.precio}` : 'Intercambio',
      oldPrice: null,
      category: String(pub.producto?.cat_prodid || 'all'), // O el filtro que uses
      type: pub.producto?.estado === 'Disponible' ? 'venta' : 'intercambio',
      image: pub.producto?.img_prod ? `http://127.0.0.1:8000/storage/${pub.producto.img_prod}` : 'assets/imgs/Iphone.webp',
      isFavorite: false
    }));

    this.items = [...formateados, ...this.itemsReferencia];
    this.applyFilters();
    },
    error: (err) => {
    console.log('Error al cargar publicaciones reales, mostrando solo referencias.', err);
    this.items = [...this.itemsReferencia];
    this.applyFilters();
    }
    });
  }

  // Método inteligente y blindado para el botón de publicar
  irAPublicar(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const usuarioStorage = localStorage.getItem('usuario') || localStorage.getItem('user');

    if (token || usuarioStorage || this.usuarioLogueado) {
      // Si hay sesión activa, pasa directo al formulario de publicación
      this.router.navigate(['/publicar']);
    } else {
      // Si no hay sesión, se le avisa y se abre el modal
      alert('Debes iniciar sesión para publicar un artículo.');
      this.abrirModal();
    }
  }

  // --- MÉTODOS DE MODAL Y AUTENTICACIÓN ---
  
  abrirModal() {
    this.isAuthModalOpen = true;
  }

  openAuthModal() {
    this.isAuthModalOpen = true;
  }

  cerrarModal() {
    this.isAuthModalOpen = false;
  }

  onLogin() {
    console.log('Iniciando sesión...', this.loginEmail);
  }

  onRegister() {
    console.log('Registrando...', this.registerEmail);
  }

  onAddArticle() {
    console.log('Agregando artículo...', this.newArticle);
  }

  // Métodos de filtrado
  filterCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredItems = this.items.filter(item => {
      const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      
      let matchesTab = true;
      if (this.selectedTab === 'venta') {
        matchesTab = item.type === 'venta';
      } else if (this.selectedTab === 'intercambio') {
        matchesTab = item.type === 'intercambio';
      }

      return matchesCategory && matchesTab;
    });
  }
}