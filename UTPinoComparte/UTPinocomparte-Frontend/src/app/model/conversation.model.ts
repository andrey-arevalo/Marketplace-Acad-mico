import { Participant } from './participant.model';
import { Mensaje } from './message.model';

export interface Conversation {
  conversacionid: number;
  tipo: string;
  nombre: string;
  fech_creacion: string;
  no_leidos?: number;
  participantes?: Participant[];
  mensajes?: Mensaje[];
}