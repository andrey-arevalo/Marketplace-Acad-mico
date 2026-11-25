import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PerfilPublicoResponse } from '../../model/perfilpublic.model';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './public-profile.html'
})
export class PublicProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  perfil: PerfilPublicoResponse | null = null;
  cargando = true;

  ngOnInit(): void {
    const usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    if (!usuarioId) {
      this.cargando = false;
      return;
    }

    this.http.get<PerfilPublicoResponse>(`${this.apiUrl}/usuario/${usuarioId}/perfil-publico`).subscribe({
      next: (resp) => {
        this.perfil = resp;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando perfil público:', err);
        this.cargando = false;
      }
    });
  }

  enviarMensaje(): void {
    const destinatarioId = this.perfil?.usuario?.usuarioid ?? Number(this.route.snapshot.paramMap.get('id'));
    if (!destinatarioId) {
      return;
    }

    const nombre = this.perfil?.usuario?.nom_us ?? 'Usuario';
    const foto = this.perfil?.usuario?.foto ?? '';

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/chat?destinatarioId=${destinatarioId}&nombre=${encodeURIComponent(nombre)}&foto=${encodeURIComponent(foto)}`
        }
      });
      return;
    }

    this.router.navigate(['/chat'], {
      queryParams: {
        destinatarioId,
        nombre,
        foto
      }
    });
  }
}