import { Mensaje } from './message.model';

export interface Participant {
  participanteid: number;
  conversacionid?: number;
  usuarioid: number;
  fech_union?: string;
  ultim_lectura?: string;
  usuario?: {
    usuarioid: number;
    nom_us: string;
    foto?: string;
  };
}