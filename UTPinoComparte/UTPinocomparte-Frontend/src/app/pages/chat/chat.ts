import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Participant } from '../../model/participant.model';
import { Conversation } from '../../model/conversation.model';
import { Mensaje } from '../../model/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit {
  @ViewChild('contenedorMensajes') private contenedorMensajes?: ElementRef<HTMLDivElement>;

  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly loteMensajes = 20;

  listaConversaciones: Conversation[] = [];
  conversacionActiva: Conversation | null = null;
  mensajesActuales: Mensaje[] = [];
  textoNuevoMensaje = '';

  nombreActivo = '';
  avatarActivo: string | null = null;
  idUsuarioOtro: number | null = null;
  destinatarioId: number | null = null;

  cargandoMasMensajes = false;
  hayMasMensajes = false;

  ngOnInit(): void {
    const convParam = Number(this.route.snapshot.queryParamMap.get('conversacionid')) || null;
    const destParam = Number(this.route.snapshot.queryParamMap.get('destinatarioId')) || null;
    const nombreParam = this.route.snapshot.queryParamMap.get('nombre');
    const fotoParam = this.route.snapshot.queryParamMap.get('foto');

    if (destParam && !convParam && nombreParam !== null && fotoParam !== null) {
      this.destinatarioId = destParam;
      this.idUsuarioOtro = destParam;
      this.nombreActivo = nombreParam || 'Usuario';
      this.avatarActivo = this.formatearFoto(fotoParam);
      this.mensajesActuales = [];
      this.hayMasMensajes = false;
    }

    this.cargarConversaciones(convParam, destParam);
  }

  cargarConversaciones(
    conversacionIdObjetivo: number | null = null,
    destinatarioObjetivo: number | null = null
  ): void {
    this.chatService.getMisConversaciones().subscribe({
      next: (data) => {
        this.listaConversaciones = data;

        if (conversacionIdObjetivo) {
          const encontrada = this.listaConversaciones.find(
            (c) => Number(c.conversacionid) === conversacionIdObjetivo
          );
          if (encontrada) {
            this.seleccionarConversacion(encontrada);
          }
          return;
        }

        if (destinatarioObjetivo) {
          const existente = this.listaConversaciones.find((c) => {
            const otro = this.buscarOtroParticipante(c);
            const otroId = Number(otro?.usuarioid ?? otro?.usuario?.usuarioid ?? 0);
            return otroId === destinatarioObjetivo;
          });

          if (existente) {
            this.seleccionarConversacion(existente);
          } else {
            this.conversacionActiva = null;
            this.destinatarioId = destinatarioObjetivo;
            this.mensajesActuales = [];
            this.hayMasMensajes = false;
          }
        }
      },
      error: (err) => console.error('Error cargando chats:', err)
    });
  }

  seleccionarConversacion(conv: Conversation): void {
    this.conversacionActiva = conv;
    this.destinatarioId = null;
    this.mensajesActuales = [];
    this.hayMasMensajes = false;

    const otro = this.buscarOtroParticipante(conv);
    if (otro?.usuario) {
      this.nombreActivo = otro.usuario.nom_us;
      this.avatarActivo = this.formatearFoto(otro.usuario.foto);
      this.idUsuarioOtro = Number(otro.usuario.usuarioid) || null;
    } else {
      this.nombreActivo = conv.nombre || 'Usuario';
      this.avatarActivo = null;
      this.idUsuarioOtro = null;
    }

    (conv as any).no_leidos = 0;

    this.chatService.getMensajesConversacion(conv.conversacionid, this.loteMensajes).subscribe({
      next: (msgs) => {
        this.mensajesActuales = msgs;
        this.hayMasMensajes = msgs.length >= this.loteMensajes;
        this.bajarScroll();
      },
      error: (err) => console.error('Error cargando mensajes:', err)
    });
  }

  obtenerNoLeidos(conv: Conversation): number {
    return Number((conv as any)?.no_leidos ?? 0);
  }

  onScrollMensajes(): void {
    const el = this.contenedorMensajes?.nativeElement;
    if (!el) return;

    if (el.scrollTop <= 20 && this.hayMasMensajes && !this.cargandoMasMensajes) {
      this.cargarMensajesAnteriores();
    }
  }

  cargarMensajesAnteriores(): void {
    if (!this.conversacionActiva || this.cargandoMasMensajes || this.mensajesActuales.length === 0) {
      return;
    }

    const primerMensajeId = Number(this.mensajesActuales[0]?.mensajeid);
    if (!primerMensajeId) {
      return;
    }

    const el = this.contenedorMensajes?.nativeElement;
    const alturaAnterior = el ? el.scrollHeight : 0;

    this.cargandoMasMensajes = true;

    this.chatService
      .getMensajesConversacion(this.conversacionActiva.conversacionid, this.loteMensajes, primerMensajeId)
      .subscribe({
        next: (anteriores) => {
          this.cargandoMasMensajes = false;
          this.hayMasMensajes = anteriores.length >= this.loteMensajes;

          if (anteriores.length > 0) {
            this.mensajesActuales = [...anteriores, ...this.mensajesActuales];

            setTimeout(() => {
              if (el) {
                el.scrollTop = el.scrollHeight - alturaAnterior;
              }
            }, 0);
          }
        },
        error: (err) => {
          console.error('Error cargando mensajes anteriores:', err);
          this.cargandoMasMensajes = false;
        }
      });
  }

  obtenerOtroUsuarioId(conversacion: Conversation | null | undefined): number | null {
    if (!conversacion) return null;

    const idActual = this.obtenerIdUsuarioLogueado();
    const otro = this.buscarOtroParticipante(conversacion)
      ?? (conversacion as any).participantes?.find(
        (p: any) => Number(p?.usuarioid ?? p?.usuario?.usuarioid) !== idActual
      );

    const id = otro?.usuarioid ?? otro?.usuario?.usuarioid;
    return id ? Number(id) : null;
  }

  enviarMensaje(): void {
    const texto = this.textoNuevoMensaje.trim();
    const idDestinatario = this.destinatarioId ?? this.obtenerOtroUsuarioId(this.conversacionActiva);

    if (!texto || (!this.conversacionActiva?.conversacionid && !idDestinatario)) {
      return;
    }

    const payload: any = this.conversacionActiva?.conversacionid
      ? {
          conversacionid: this.conversacionActiva.conversacionid,
          txt_msj: texto
        }
      : {
          destinatario_id: idDestinatario,
          txt_msj: texto
        };

    this.chatService.enviarMensaje(payload).subscribe({
      next: (resp) => {
        const nuevoMsg: Mensaje = resp?.data ?? resp;
        this.mensajesActuales.push(nuevoMsg);

        const conversacionIdCreada = resp?.conversacionid ?? nuevoMsg?.conversacionid;
        if (!this.conversacionActiva && conversacionIdCreada) {
          this.conversacionActiva = {
            conversacionid: conversacionIdCreada
          } as any;
          this.destinatarioId = null;
          this.cargarConversaciones(conversacionIdCreada);
        }

        if (this.conversacionActiva) {
          this.conversacionActiva.mensajes = [nuevoMsg];
        }

        this.textoNuevoMensaje = '';
        this.bajarScroll();
      },
      error: (err) => console.error('Error al enviar mensaje:', err)
    });
  }

  esMensajeMio(msg: Mensaje): boolean {
    const idActual = this.obtenerIdUsuarioLogueado();
    return Number(msg.participante?.usuarioid) === idActual;
  }

  obtenerNombreOtro(conv: Conversation): string {
    const otro = this.buscarOtroParticipante(conv);
    return otro?.usuario?.nom_us || conv.nombre || 'Usuario';
  }

  obtenerAvatarOtro(conv: Conversation): string | null {
    const otro = this.buscarOtroParticipante(conv);
    return this.formatearFoto(otro?.usuario?.foto);
  }

  obtenerIdUsuarioLogueado(): number {
    const userStr = localStorage.getItem('usuario_data') || localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return Number(user.usuarioid ?? user.id ?? 0);
      } catch {
        return 0;
      }
    }
    return 0;
  }

  verPerfilParticipante(): void {
    if (this.idUsuarioOtro) {
      this.router.navigate(['/perfil-publico', this.idUsuarioOtro]);
    }
  }

  private formatearFoto(foto?: string | null): string | null {
    if (!foto) return null;
    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('assets/')) {
      return foto;
    }
    return `http://127.0.0.1:8000/storage/${foto}`;
  }

  private buscarOtroParticipante(conv: Conversation): Participant | undefined {
    const idActual = this.obtenerIdUsuarioLogueado();
    return conv.participantes?.find((p) => Number(p.usuarioid) !== idActual);
  }

  private bajarScroll(): void {
    setTimeout(() => {
      const el = this.contenedorMensajes?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }
}