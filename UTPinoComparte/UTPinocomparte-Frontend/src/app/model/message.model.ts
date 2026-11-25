export interface Mensaje {
  mensajeid?: number;
  conversacionid?: number;
  participanteid?: number;
  txt_msj: string;
  fech_envio?: string;
  estado?: string;
  participante?: {
    usuarioid: number;
    usuario?: {
      usuarioid: number;
      nom_us: string;
      foto?: string;
    };
  };
}

export interface EnviarMensajePayload {
  conversacionid?: number;
  destinatario_id?: number;
  txt_msj: string;
}