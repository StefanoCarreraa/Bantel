export interface Perfil {
  iD_PERSONA: number;
  nombres: string;
  tpdC_DESCRIPCION: string;
  nrodocumento: string;
  direccion: string;
  telefono: string;
  email: string;
  servicio: string;
  importe: string;
  fechA_INICIO_FACTURACION: string;
  password:string;
}

export  class PerfilUpdte {
  idusuario : number;
  password: string;
  telefono: string;
  email: string;

  constructor(pIdusuario , pPassword , pTelefono, pEmail ){
    this.idusuario = pIdusuario;
    this.password = pPassword;
    this.telefono  = pTelefono;
    this.email = pEmail;
  }
}
