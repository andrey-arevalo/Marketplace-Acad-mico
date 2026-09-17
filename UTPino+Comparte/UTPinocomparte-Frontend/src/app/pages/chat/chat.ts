import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel en el input de texto
import { ChatService, Mensaje } from '../../service/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit {
  mensajes: Mensaje[] = [];
  nuevoMensajeTexto: string = '';
  
  // IDs de prueba o obtenidos del login
  idUsuarioActual: number = 1; 
  idVendedorDestinatario: number = 2;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.chatService.obtenerHistorial(this.idUsuarioActual, this.idVendedorDestinatario)
      .subscribe({
        next: (data) => {
          this.mensajes = data;
        },
        error: (err) => console.error('Error al cargar mensajes:', err)
      });
  }

  enviar(): void {
    if (!this.nuevoMensajeTexto.trim()) return;

    const mensaje: Mensaje = {
      idRemitente: this.idUsuarioActual,
      idDestinatario: this.idVendedorDestinatario,
      contenido: this.nuevoMensajeTexto
    };

    this.chatService.enviarMensaje(mensaje).subscribe({
      next: (resp) => {
        this.mensajes.push(resp); // Agrega el mensaje enviado a la lista visual
        this.nuevoMensajeTexto = ''; // Limpia el input
      },
      error: (err) => console.error('Error al enviar mensaje:', err)
    });
  }
}
