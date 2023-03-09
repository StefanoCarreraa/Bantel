export interface Mail {
  ToEmail: number;
  Subject: string;
  Body: string;
  opcion: string;
  Nombres: string;
  Dni: string;
  telefono: string;
}

export  class MailRequest {
  toEmail: string;
  subject: string;
  body: string;
  opcion: string;
  nombres: string;
  dni: string;
  telefono: string;
  attachments:[any];

  constructor(email , subject , body, opcion,nombres,dni,telefono ){
    this.toEmail = email;
    this.subject = subject;
    this.body  = body;
    this.opcion = opcion;
    this.nombres = nombres;
    this.dni = dni;
    this.telefono = telefono;
  }
}
