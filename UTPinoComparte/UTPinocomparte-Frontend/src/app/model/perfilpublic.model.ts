export interface PerfilPublicoResponse {
  usuario: {
    usuarioid: number;
    nom_us: string;
    foto?: string;
    carrera?: string;
    ciclo?: string;
  };
  publicaciones: Array<{
    publicacionid: number;
    producto?: {
      nom_prod?: string;
      descripcion?: string;
      precio?: number;
      stock?: number;
      estado?: string;
      img_prod?: string;
    };
  }>;
}