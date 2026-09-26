import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component'; 
import { AuthModalComponent } from '../../pages/authmodal/authmodal'; // <--- 1. Importa tu AuthModal aquí (ajusta la ruta si es necesario)

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HeaderComponent,
    AuthModalComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {
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
  
  // Lista de elementos de ejemplo con sus imágenes y tipos
  items: any[] = [
    {
      title: 'iPhone 13 Pro',
      subtitle: 'Electrónica',
      price: 'S/ 2,500',
      oldPrice: 'S/ 2,800',
      category: 'electronica',
      type: 'venta',
      image: '/imgs/Iphone.webp',
      isFavorite: false
    },
    {
      title: 'Bicicleta Urbana',
      subtitle: 'Deportes',
      price: 'S/ 650',
      oldPrice: null,
      category: 'deportes',
      type: 'venta',
      image: '/imgs/Bicicleta.jpeg',
      isFavorite: false
    },
    {
      title: 'Libro HTML, CSS y JS',
      subtitle: 'Libros',
      price: 'Intercambio',
      oldPrice: null,
      category: 'libros',
      type: 'intercambio',
      image: '/imgs/LibroHTML,CSS,JS.jpeg',
      isFavorite: false
    },
    {
      title: 'MacBook Pro',
      subtitle: 'Electrónica',
      price: 'S/ 4,200',
      oldPrice: 'S/ 4,500',
      category: 'electronica',
      type: 'venta',
      image: '/imgs/Mackbook.jpeg',
      isFavorite: false
    },
    {
      title: 'Pluma estilo gráfica',
      subtitle: 'Util escolar',
      price: 'S/ 100',
      oldPrice: 'S/ 200',
      category: 'electronica',
      type: 'venta',
      image: '/imgs/PlumaEstiloGrafica.jpg',
      isFavorite: false
    }
  ];

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
    this.applyFilters();
    // Verificamos si hay una sesión activa guardada
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  // --- MÉTODOS DE MODAL Y AUTENTICACIÓN CORREGIDOS ---
  
  // Abre el modal de autenticación
  abrirModal() {
    this.isAuthModalOpen = true;
  }

  openAuthModal() {
    this.isAuthModalOpen = true;
  }

  // Cierra el modal
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