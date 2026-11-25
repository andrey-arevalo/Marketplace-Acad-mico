import { Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { PerfilComponent } from './pages/perfil/perfil';
import { ChatComponent } from './pages/chat/chat';
import { DetailProductComponent } from './pages/detail-product/detail-product';
import { PublicacionProductComponent } from './pages/publicacion-product/publicacion-product';
import { AuthModalComponent } from './pages/authmodal/authmodal';
import { PublicProfileComponent } from './pages/publicperfil/public-profile';
import { SoporteComponent } from './components/soporte/soporte.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [

  { path: '', component: InicioComponent },

  { path: 'auth', component: AuthModalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'perfil', component: PerfilComponent },
  { path: 'perfil-publico/:id', component: PublicProfileComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'producto/:id', component: DetailProductComponent },
  { path: 'publicar', component: PublicacionProductComponent },

  { path: 'soporte', component: SoporteComponent },

  { path: '**', redirectTo: '' }

];
