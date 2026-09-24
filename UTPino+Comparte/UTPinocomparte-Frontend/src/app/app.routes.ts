import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { PerfilComponent } from './pages/perfil/perfil';
import { ChatComponent } from './pages/chat/chat';
import { DetailProductComponent } from './pages/detail-product/detail-product';
import { PublicacionProductComponent } from './pages/publicacion-product/publicacion-product';
import { AuthModalComponent } from './pages/authmodal/authmodal';

export const routes: Routes = [
  // Ruta por defecto (Página principal / Home)
  { path: '', component: InicioComponent },

  // Autenticación y Modales
  { path: 'auth', component: AuthModalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Usuario y perfil
  { path: 'perfil', component: PerfilComponent },

  // Comunicación
  { path: 'chat', component: ChatComponent },

  // Gestión y vista de productos
  { path: 'producto/:id', component: DetailProductComponent },
  { path: 'publicar', component: PublicacionProductComponent },

  // Comodín para rutas no encontradas (SIEMPRE AL FINAL)
  { path: '**', redirectTo: '' }
];