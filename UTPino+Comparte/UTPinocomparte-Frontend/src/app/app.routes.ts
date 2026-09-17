import { Routes } from '@angular/router';
<<<<<<< Updated upstream
import { InicioComponent } from './pages/inicio/inicio';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { PerfilComponent } from './pages/perfil/perfil';
import { ChatComponent } from './pages/chat/chat';
import { DetailProductComponent } from './pages/detail-product/detail-product';
import { PublicacionProductComponent } from './pages/publicacion-product/publicacion-product';

export const routes: Routes = [
  // Ruta por defecto (Página principal / Home)
  { path: '', component: InicioComponent },
  
  // Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  
  // Usuario y perfil
  { path: 'perfil', component: PerfilComponent },
  
  // Comunicación
  { path: 'chat', component: ChatComponent },
  
  // Gestión y vista de productos
  { path: 'producto/:id', component: DetailProductComponent }, // Soporta parámetro dinámico por ID
  { path: 'publicar', component: PublicacionProductComponent },
  
  // Comodín para rutas no encontradas (Redirige al inicio o una página 404)
  { path: '**', redirectTo: '' }
];
=======
import { InicioComponent } from './components/inicio/inicio.component'; // Asegúrate que esta ruta coincida con la real
import { SoporteComponent } from './components/soporte/soporte.component'; // O el nombre de tu otro componente

export const routes: Routes = [
  { path: '', component: InicioComponent },        // Ruta principal (por defecto)
  { path: 'soporte', component: SoporteComponent } // Ruta secundaria con un path único
];
>>>>>>> Stashed changes
