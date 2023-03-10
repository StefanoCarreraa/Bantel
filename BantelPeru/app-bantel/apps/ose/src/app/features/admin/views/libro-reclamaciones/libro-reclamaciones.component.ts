import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { OseUsuarioHttp } from '../../../../../../../../libs/ose-commons/src/lib/http/usuario/usuario.http';
import { Mail, MailRequest } from '../../../../../../../../libs/ose-commons/src/lib/models/mail.model';

import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { OseMaestroHttp } from '../../../../../../../../libs/ose-commons/src/lib/http/maestro/maestro.http';
import { finalize } from 'rxjs/operators';
import { OseSession } from '../../../../../../../../libs/ose-commons/src/lib/services/session/session.service';
import { OseLoadingComponent } from '@ose/commons/components';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.component.html',
  providers: [MessageService],
  styleUrls: ['./libro-reclamaciones.component.scss']
})
export class LibroReclamacionesComponent implements OnInit {
  private logo = '../../../../assets/img/gallery/logo2.jpg';
  loading: boolean = true;

  nombres: string = '';
  dni: string = '';
  email: string = '';
  //selectedDepartamento: any = null;
  departamento: string = '';
  direccion: string = '';
  telefono: string = '';
  selectedTipo: any = null;
  selectedContrato: any = null;
  reclamo: string = '';
  terminos: boolean = false;
  nombreArchivo: string = '';
    
  //departamentos: any[] = [];
  tipos: any[] = [];

  addMensaje: boolean = false; // Aparece/desaparece el popup de confirmacion
  flag: number = 0; // Muestra/desaparece el tipo de mensaje del popup
  mensaje: string
  idorganizacion: any
  usuario: any;
  contratos: any[] = [];
  flagEnviar: boolean = false // Bloquea/desbloquea los componentes cuando se envia los datos
  //privacidad: string
  //addPrivacidad: boolean;
  url: any = null;
  flagCargar: number = 0; // Aparece/desaparece el mensaje de Enviando solicitud...

  constructor(private usuarioHttp: OseUsuarioHttp, private messageService: MessageService, public dialog_: MatDialog, private http: OseMaestroHttp, private session: OseSession,
    private primengConfig: PrimeNGConfig) {
    this.idorganizacion = this.session.idorganizacion;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getHList()
    this.usuarioHttp.getUsuario(this.idorganizacion).subscribe(
      perfil => {
        // console.log(perfil[0])
        this.usuario = perfil[0];
        console.log('1111111111:Usuario: ', this.usuario)

        this.nombres = this.usuario.NombreOrganizacion
        this.dni = this.usuario.NumDocOrganizacion
        this.email = this.usuario.EmailOrganizacion
        this.departamento = this.usuario.NombreUbigeo
        this.telefono = this.usuario.TelefonoOrganizacion
        this.direccion = this.usuario.DireccionServicio
      }
    );

    const loading1 = this.dialog_.open(OseLoadingComponent, { disableClose: true });
    this.http.ListarContratos(this.idorganizacion)
      .pipe(finalize(() => loading1.close()))
      .subscribe(
        (Data) => {
          this.contratos = Data;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  private getHList() {
    this.tipos = [{ IDTipo: 'Reclamo', NombreTipo: 'Reclamo' }, { IDTipo: 'Queja', NombreTipo: 'Queja' }]
    //this.departamentos = [
    //  { IDDepartamento: 'Amazonas', NombreDepartamento: 'Amazonas' },
    //  { IDDepartamento: 'Ancash', NombreDepartamento: 'Ancash' },
    //  { IDDepartamento: 'Apurimac', NombreDepartamento: 'Apurimac' },
    //  { IDDepartamento: 'Arequipa', NombreDepartamento: 'Arequipa' },
    //  { IDDepartamento: 'Ayacucho', NombreDepartamento: 'Ayacucho' },
    //  { IDDepartamento: 'Cajamarca', NombreDepartamento: 'Cajamarca' },
    //  { IDDepartamento: 'Callao', NombreDepartamento: 'Callao' },
    //  { IDDepartamento: 'Cusco', NombreDepartamento: 'Cusco' },
    //  { IDDepartamento: 'Huancavelica', NombreDepartamento: 'Huancavelica' },
    //  { IDDepartamento: 'Huanuco', NombreDepartamento: 'Huanuco' },
    //  { IDDepartamento: 'Ica', NombreDepartamento: 'Ica' },
    //  { IDDepartamento: 'Junin', NombreDepartamento: 'Junin' },
    //  { IDDepartamento: 'La Libertad', NombreDepartamento: 'La Libertad' },
    //  { IDDepartamento: 'Lambayeque', NombreDepartamento: 'Lambayeque' },
    //  { IDDepartamento: 'Lima', NombreDepartamento: 'Lima' },
    //  { IDDepartamento: 'Loreto', NombreDepartamento: 'Loreto' },
    //  { IDDepartamento: 'Madre De Dios', NombreDepartamento: 'Madre De Dios' },
    //  { IDDepartamento: 'Moquegua', NombreDepartamento: 'Moquegua' },
    //  { IDDepartamento: 'Pasco', NombreDepartamento: 'Pasco' },
    //  { IDDepartamento: 'Piura', NombreDepartamento: 'Piura' },
    //  { IDDepartamento: 'Puno', NombreDepartamento: 'Puno' },
    //  { IDDepartamento: 'San Martin', NombreDepartamento: 'San Martin' },
    //  { IDDepartamento: 'Tacna', NombreDepartamento: 'Tacna' },
    //  { IDDepartamento: 'Ucayali', NombreDepartamento: 'Ucayali' },
    //  { IDDepartamento: 'Tumbes', NombreDepartamento: 'Tumbes' },
    //]
  }

  Enviar() {
    console.log(this.selectedTipo)
    console.log(this.selectedContrato)
    
    if (this.selectedTipo == null) {
      alert('Seleccione un tipo')
      return
    }
    if (this.selectedContrato == null) {
      alert('Seleccione un contrato')
      return
    }
    if (this.reclamo.trim() == '') {
      alert('Escriba su reclamo')
      return
    }
    this.flagEnviar = true
    this.flagCargar = 1
    let terminos_condiciones = 0
    terminos_condiciones = (this.terminos==true) ? 1 : 0
    //if (this.terminos) {
    //  terminos_condiciones = 1
    //} else {
    //  terminos_condiciones = 0
    //}
    let obj = {
      idServicioContratado: this.selectedContrato.IDServicioContratado,
      nombreTitular: this.nombres,
      numeroDocumentoTitular: this.dni,
      emailTitular: this.email,
      ubigeoTitular: this.departamento,
      direccionTitular: this.direccion,
      telefonoTitular: this.telefono,
      tipoReclamo: this.selectedTipo.NombreTipo,
      observacionReclamo: this.reclamo.trim(),
      numeroContrato: this.selectedContrato.NombreServicio,
      flagContrato: terminos_condiciones,
      imgAdjunto: this.url
    }
    console.log('Data obj::::: ', obj)
    //return
    this.usuarioHttp.registrarReclamo(obj).subscribe(data => {
      console.log(data);
      if (data.StatusResul == 1) {
        this.flag = 1
        this.mensaje = data.Message
        this.openMensaje()
        this.clear();
      } else if (data.StatusResul == 2) {
        this.flag = 2
        this.mensaje = data.Message
        this.openMensaje()
      } else {
        this.flag = 3
        this.mensaje = data.Message
        this.openMensaje()
      }
    },
      err => {
        console.log(err);
      }
    );
    //this.flagEnviar = false
  }

  clear() {
    this.selectedTipo = null;
    this.selectedContrato = null;
    this.reclamo = '';
    this.terminos = false;
    this.url = null
    this.nombreArchivo = ''
  }

  openMensaje() {
    this.addMensaje = true;
    this.flagCargar = 0;
  }

  hideMensaje() {
    this.addMensaje = false;
    this.flagEnviar = false
  }

  onSelectFile(event) {
    console.log('onSelectFile:::: ' + event.target.files.length)
    console.log('onSelectFile:::: ' + event.target.files + ' - ' + event.target.files[0])
    if (event.target.files && event.target.files[0]) {
    //if (event.target.files.length == 1) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
        console.log('URL1:::: ' + this.url)
      }
    } else {
      this.url = null
      this.nombreArchivo = ''
      console.log('URL2:::: ' + this.url)
    }
  }

  async privacidadPDF() {
    const documentDefinition = {
      pageMargins: [20, 40, 20, 60],
      footer: function (currentPage, pageCount) {
        return [
          { text: currentPage.toString() + ' / ' + pageCount, alignment: 'right', margin: [0, 0, 20, 0] }
        ]
      },
      content: [
        { image: await this.getBase64ImageFromURL(this.logo), width: 100, height: 50, margin: [30, 0, 0, 0] },

        {
          margin: [20, -30, 10, 40],
          text: 'Pol??tica de Privacidad', style: 'header', alignment: 'center'
        },
        {
          text: "1.- Introducci??n",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "La presente Pol??tica de Privacidad protecci??n de datos (en adelante, la ???Pol??tica de Privacidad???) regula el tratamiento de los datos personales obtenidos por Bantel S.A.C. (en adelante, ???BANTEL???) de todos sus clientes y usuarios, a trav??s de los distintos canales de atenci??n y comercializaci??n de bienes y servicios.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "2.- Informaci??n sobre el Titular del Banco de Datos Personales",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL es una empresa peruana de telecomunicaciones, dedicada a ofrecer servicios basados en tecnolog??a de la informaci??n, espec??ficamente como ISP (Proveedor de Servicios de Internet). Todos los datos de car??cter personal que se recojan a trav??s del sitio Web ser??n almacenados en el Banco de Datos de Clientes del que es titular BANTEL y ha sido debidamente inscrito de forma diferenciada en el Registro Nacional de Protecci??n de Datos Personales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "3.- Objeto",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "La presente Pol??tica de Privacidad regula la totalidad de relaciones existentes entre los clientes y usuario y BANTEL y, en su caso, la gesti??n de la relaci??n comercial que les une. En el caso de que el cliente o usuario contrate cualquier servicio, tal relaci??n se regular?? de conformidad con las Condiciones Generales y, en su caso, con el Contrato de Prestaci??n del Servicio contratado.\n" +
                "Los principios y disposiciones contenidos en la presente pol??tica se aplicar??n a todo tratamiento de datos personales por parte de BANTEL, sus empleados y en lo que corresponda, por aquellos terceros con los que se acuerde todo o parte de la realizaci??n de cualquier actividad relacionada con el tratamiento de datos personales o con sus sistemas de informaci??n, a los cuales se les exigir?? un nivel de diligencia y cumplimiento equivalente al que aplica BANTEL.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "4.- Finalidades del tratamiento",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "Los datos recabados por BANTEL se utilizan para las finalidades que se informen en los respectivos formularios a trav??s de los cuales se recaben los datos personales. La finalidad gen??rica de recopilaci??n de datos es la de mantener relaciones comerciales con los clientes y Usuario y remitirles en todo momento la informaci??n que soliciten.Asimismo, en el caso de que lo consienta expresamente, para remitirle comunicaciones comerciales relativas a la actividad empresarial de BANTEL.\n" +
                "BANTEL incluir?? la informaci??n facilitada por el cliente o usuario en su Bancos de Datos de Clientes, para almacenarla, procesarla y, solo en caso de que el cliente o usuario lo consienta expresamente, transferir estos datos a alguna de sus empresas vinculadas, afiliadas y/o socios comerciales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "5.- Medidas de Seguridad",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL se toma muy en serio la protecci??n de sus datos personales. Su informaci??n personal se conserva de forma segura y se trata con la m??xima diligencia, garantizando su absoluta confidencialidad y empleando los est??ndares de seguridad adecuados conforme a los establecido en la Ley de Protecci??n de Datos Personales ??? Ley N?? 29733. Todo proceso de contrataci??n o que conlleve la introducci??n de datos personales ser??n siempre transmitidos mediante protocolo de comunicaci??n segura, de tal forma que ning??n tercero tenga acceso a la informaci??n transmitida v??a electr??nica.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "6.- Principios del tratamiento",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL expone la presente pol??tica en atenci??n a los principios rectores establecidos en la Ley N?? 29733 ??? Ley de Protecci??n de Datos Personales. Por lo tanto:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (i) De acuerdo al principio de legalidad, BANTEL no realiza recopilaci??n de datos personales por medios fraudulentos, desleales o il??citos.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (ii) El tratamiento de datos personales se realizar?? siempre amparado en el consentimiento del titular, excluyendo las excepciones dispuestas por ley. iii) Los datos personales se recopilar??n para una finalidad determinada, expl??cita y l??cita, y no se extender?? a otra finalidad distinta a la establecida de manera inequ??voca al momento de su recopilaci??n, excluyendo los casos de actividades de valor hist??rico, estad??stico o cient??fico que incluyan un procedimiento de disociaci??n o anonimizaci??n.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (iv) Todo tratamiento de datos personales ser?? adecuado, relevante y no excesivo a la finalidad para la que estos hubiesen sido recopilados.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (v) Los datos personales ser??n veraces y exactos, implement??ndose, en la medida de lo posible, procedimientos de actualizaci??n.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (vi) Los datos personales se conservar??n el tiempo necesario para cumplir con la finalidad del tratamiento, salvo disposiciones de almacenamiento posterior conforme a ley o autorizaci??n expresa del titular.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (vii) BANTEL y, en su caso, los encargados de tratamiento, adoptar??n las medidas t??cnicas, organizativas y legales necesarias para garantizar la seguridad de los datos personales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (vii) BANTEL garantiza un nivel adecuado de seguridad en el tratamiento de datos personales, acorde con la normativa vigente o los est??ndares internacionales de la materia",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Adicionalmente a lo se??alado, BANTEL informa de que los datos recabados podr??n ser objeto de un proceso de anonimizaci??n irreversible que cumple con las medidas t??cnicas, organizativas y legales que se??ala la Pol??tica de Seguridad de la Informaci??n. Al respecto, es necesario se??alar que los principios de protecci??n de datos personales no son aplicables a la informaci??n an??nima.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "En el proceso de anonimizaci??n, los datos personales son sustituidos por identificadores ??nicos irreversibles, de tal manera que no es posible ejecutar el proceso a la inversa (por ejemplo, no es posible obtener el n??mero de tel??fono ni ning??n otro dato de car??cter personal a partir del identificador se??alado).",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Con dicha informaci??n anonimizada, BANTEL podr?? realizar proyectos de Big Data en los que conjuntos de datos o combinaciones de conjuntos de datos de gran volumen y complejidad son procesados mediante tecnolog??as y herramientas que permiten obtener resultados de utilidad.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Asimismo, los datos personales se analizan con el objetivo de obtener resultados, siempre de manera agregada, con el fin de identificar comportamientos de car??cter general y nunca de car??cter individual. Una vez agregados, estos datos son extrapolados estad??sticamente para realizar una estimaci??n sobre el n??mero total de personas, a fin de no tomar en cuenta ??nicamente al grupo de clientes y usuarios que est??n conectados a la red de BANTEL. Por todo lo anterior, dado que los datos son anonimizados, agregados y extrapolados, es imposible identificar de manera individual a los clientes o usuarios que generaron dicha informaci??n.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "7.- Transferencia de Datos Personales",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL ??nicamente transferir?? datos de sus clientes a terceros si media consentimiento expreso e informado para ello, el cual ser?? recabado individualmente para cada una de las transferencias. En caso de que el cliente o usuario as?? lo consienta, BANTEL podr?? ofrecer, a trav??s de cualquier medio escrito, verbal, electr??nico y/o inform??tico, cualquiera de los productos o servicios de terceras empresas.\n" +
            "No se considerar?? transferencia de datos personales a estos efectos, los accesos a datos personales realizados por entidades contratadas por BANTEL en calidad de Encargados del Banco de Datos, con el ??nimo de prestar un servicio a BANTEL relacionado con las finalidades descritas. BANTEL se compromete a suscribir con tales encargados un contrato o cl??usula de acceso a datos por cuenta de terceros en virtud de la que se comprometan a dar cumplimiento a las mismas obligaciones establecidas en el presente documento y a las exigidas por la normativa aplicable.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "8.- Calidad y Plazo de conservaci??n de los Datos Personales",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "Los datos personales solicitados ser??n adecuados, pertinentes y no excesivos en relaci??n con la finalidad para los que se recogen. El cliente o usuario garantiza que los datos personales facilitados son veraces y se hace responsable de comunicar a BANTEL cualquier modificaci??n de los mismos. BANTEL har?? los mejores esfuerzos para mantener su Banco de Datos actualizado, pero ser?? responsabilidad del cliente y usuario informar a BANTEL de las modificaciones que a futuro se produzcan en sus datos personales. El cliente o usuario responder??, en cualquier caso, de la veracidad de los datos facilitados, reserv??ndose BANTEL el derecho a excluir de los servicios registrados a todo cliente o usuario que hayan facilitado datos falsos, sin perjuicio de las dem??s acciones que procedan en Derecho.\n" +
            "Los datos personales ser??n tratados hasta que sea necesario para cumplir con las finalidades asociadas a su recopilaci??n. Una vez cumplida dicha finalidad, se conservar??n bloqueados, no permitiendo su utilizaci??n para cualquier otra finalidad, durante el tiempo en que pueda exigirse alg??n tipo de responsabilidad de BANTEL derivada de esta relaci??n o fruto de alguna disposici??n acorde a ley. En todo caso, se toma como plazo m??ximo hasta la cancelaci??n definitiva el plazo de diez (10) a??os, salvo exista alguna obligaci??n legal o el cliente o usuario lo autorice por m??s tiempo.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "9.- Tratamiento de Datos Sensibles y de Menores de Edad.",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL no lleva a cabo tratamiento de datos sensibles, salvo la recopilaci??n de los datos de los clientes solicitada ??nicamente y en caso corresponda por la naturaleza de la contrataci??n.\n" +
            "BANTEL no recoge datos de menores de edad salvo los recabados con el previo consentimiento de sus padres, tutores o representantes legales. Si alg??n menor de edad ingresa sus datos personales a trav??s del sitio web de BANTEL, deber?? solicitar el permiso correspondiente a sus padres, tutores o representantes legales, quienes ser??n considerados responsables de todos los actos realizados por los menores a su cargo.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "10.- Ejercicio de los Derechos de Acceso, Rectificaci??n Supresi??n y Oposici??n.",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "La normativa vigente en protecci??n de datos otorga al titular de los datos personales un conjunto de derechos que le garantizan el control sobre los mismos. Dentro de este grupo, el cliente o usuario puede ejercitar los siguientes derechos:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (i) Derecho de acceso. Derecho a obtener informaci??n sobre los datos personales de s?? mismo que son objeto de tratamiento por parte de BANTEL.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (ii) Derecho de rectificaci??n. Derecho a solicitar a BANTEL la correcci??n de los datos personales objeto de tratamiento, ya sea por inexactitud u omisi??n. Incorpora el derecho de actualizaci??n e inclusi??n.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Derecho de cancelaci??n. Derecho a solicitar la eliminaci??n de sus datos personales, anulando el tratamiento de los mismos. La solicitud de supresi??n o cancelaci??n podr?? referirse a todos los datos personales del titular contenidos en un banco de datos personales o solo a alguna parte de ellos.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (ii) Derecho de oposici??n. Derecho a oponerse al tratamiento de sus datos personales para finalidades concretas atendiendo a motivos fundados y leg??timos relativos a una concreta situaci??n personal.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Para poder ejercitar estos derechos, BANTEL pone a disposici??n dos canales de atenci??n:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "V??a correo electr??nico. Env??o de correo electr??nico dirigido a protecciondedatos@bantelperu.com, con la referencia ???Protecci??n de Datos Personales???, acreditando su identidad mediante copia de documento de identidad o documento equivalente, especificando el tipo de solicitud y sus motivos. De requerir informaci??n adicional, se le comunicar?? oportunamente por el mismo medio.\n" +
            "Las solicitudes ser??n atendidas por BANTEL sin costo alguno en los plazos contados desde la fecha en la que se presenta la solicitud. A trav??s de la respuesta se conceder?? el ejercicio del derecho o se justificar?? su negativa.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "11.- Uso de Cookies",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "Este sitio web utiliza cookies, peque??os archivos almacenados en las computadoras que permiten recordar caracter??sticas o preferencias de la navegaci??n en nuestro sitio Web, y personalizar las futuras visitas de nuestros clientes y usuarios. Asimismo, hacen m??s segura la navegaci??n y permiten ofrecer informaci??n de acuerdo al inter??s del cliente o usuario. Quien navega en la web de BANTEL puede aceptar o rechazar la instalaci??n de cookies o suprimirlos una vez que haya finalizado su navegaci??n en la web. BANTEL no se responsabiliza que por la desactivaci??n de las cookies se pueda impedir el buen funcionamiento de nuestra web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "12.- Tr??fico IP",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL no almacena informaci??n de las IPs asignadas a los usuarios que visitan nuestros portales web. En ese sentido, en nuestros bancos de datos no se recoge informaci??n alguna respecto a las IP, est??ticas o din??micas, que nuestros usuarios hayan utilizado en cualquiera de sus navegaciones.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "13.- Cambios",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL se reserva el derecho de revisar su Pol??tica de Privacidad. En caso de que se lleven a cabo modificaciones sustanciales que puedan tener impacto en la protecci??n de los datos personales de los usuarios, ??stos ser??n informados. Por esta raz??n, le exhortamos a que compruebe de forma peri??dica y regular esta declaraci??n de privacidad para leer la versi??n m??s reciente de la Pol??tica de Privacidad para Clientes y Usuarios de BANTEL.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        Titulo: {
          fontSize: 10,
          bold: true,
        },
        subTitulo: {
          fontSize: 9,
          italics: false,
          alignment: 'justify',
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  async terminosCondicionesPDF() {
    const documentDefinition = {
      pageMargins: [20, 40, 20, 60],
      footer: function (currentPage, pageCount) {
        return [
          { text: currentPage.toString() + ' / ' + pageCount, alignment: 'right', margin: [0, 0, 20, 0] }
        ]
      },
      content: [
        { image: await this.getBase64ImageFromURL(this.logo), width: 100, height: 50, margin: [30, 0, 0, 0] },

        {
          margin: [20, -30, 10, 40],
          text: 'T??rminos y condiciones', style: 'header', alignment: 'center'
        },
        {
          text: "T??rminos y Condiciones para el uso y privacidad de la p??gina web de Bantel S.A.C.",
          margin: [30, 4, 5, 4],
          style: 'subTitulo'
        },
        {
          text: "El uso de la p??gina web de Bantel S.A.C. (en adelante la ???P??gina Web???) est?? sujeto a los t??rminos y condiciones establecidos en este documento. Asimismo, la utilizaci??n de la P??gina Web atribuye al usuario (en adelante, el ???Usuario???) la aceptaci??n de todas las disposiciones incluidas en este documento. El Usuario acepta los siguientes t??rminos y condiciones:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "1- Obligaciones del Usuario por el uso de la P??gina Web:",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "??? El Usuario acepta y reconoce ser responsable por el uso de la P??gina Web, liberando de cualquier responsabilidad a Bantel S.A.C. (en adelante ???Bantel???) y a cualquiera de sus respectivos directores, funcionarios, empleados u otros representantes que, en ning??n caso, responder??n por da??os directos o indirectos, ni por da??o emergente ni por lucro cesante, por los perjuicios que puedan derivarse del uso de la P??gina Web o del acceso a otros sitios de terceros a trav??s de las conexiones y ???links??? que pudiesen existir.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? El Usuario declara contar con capacidad legal para aceptar las condiciones escritas en este documento. Toda informaci??n proporcionada por el Usuario a Bantel a trav??s de la P??gina Web, se considera verdadera y correcta.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? El Usuario ser?? responsable exclusivo de todas y cada una de las actividades que se realicen bajo su contrase??a por lo que deber?? mantener la confidencialidad de ??sta.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? El Usuario asume toda responsabilidad, as?? como los riesgos, da??os, perjuicios y las responsabilidades civiles o penales que ello implique de manera directa o indirecta por cualquier operaci??n con la contrase??a. Asimismo, el Usuario reconoce que Bantel no asumir?? en ning??n caso responsabilidad por el uso indebido de la contrase??a por parte del Usuario por lo que acepta expresamente que ser?? responsable frente a terceros que puedan sufrir consecuencia alguna por ello.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Para hacer uso de los Servicios los menores de edad deben obtener previamente permiso de sus padres, tutores o representantes legales, quienes ser??n considerados responsables de todos los actos realizados por los menores a su cargo. El uso de la P??gina Web por los menores de edad es responsabilidad absoluta de los mayores a cuyo cargo.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? El Usuario, no deber?? utilizar la P??gina Web para la realizaci??n de fines y actos il??citos, contrarios a la moral, a las buenas costumbres, al orden p??blico o lesivo de derechos de terceros, ni para enviar informaci??n o contenidos que puedan ser considerados ilegales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? El Usuario no deber??:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (i) Reproducir informaci??n privada sobre cualquier persona natural o jur??dica sin la debida autorizaci??n para hacerlo, incluyendo cuentas de correo electr??nico;",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (ii) Proveer informaci??n falsa que conciernan a terceros;",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? (iii) Transmitir cualquier material que contenga virus u otro potencialmente da??ino.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? El Usuario se abstendr?? de utilizar los contenidos y/o servicios que puedan da??ar, inutilizar o sobrecargar la P??gina Web o impedir o restringir su normal utilizaci??n. El incumplimiento de las mismas dar?? lugar a las responsabilidades civiles y penales correspondientes.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Bantel no se responsabiliza de los da??os o perjuicios en el software o hardware del Usuario o terceros producido por el acceso a la P??gina Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "2- Propiedad Intelectual",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "??? Todas las marcas, textos e im??genes que se encuentren en la P??gina Web est??n protegidos por las leyes de propiedad intelectual e industrial y derechos de autor. En ning??n caso el uso de la P??gina Web implica alg??n tipo de renuncia, transmisi??n o cesi??n total ni parcial de dichos derechos, ni confiere ning??n derecho de utilizaci??n, alteraci??n, explotaci??n, reproducci??n, distribuci??n o comunicaci??n p??blica sobre dichos contenidos sin la previa y expresa autorizaci??n otorgada a tal efecto por parte de Bantel o del tercero titular de los derechos afectados, salvo que se advierta a dichos terceros de manera expresa respecto de la titularidad de Bantel de los derechos de autor y las limitaciones impuestas al uso de dichos contenidos, marcas, textos o im??genes gr??ficas.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Se autoriza la visualizaci??n, impresi??n y descarga parcial del contenido de la P??gina Web ??nica y exclusivamente cuando estos actos se realicen con el fin de obtener informaci??n sobre Bantel y/o sus productos para el uso personal y privado del Usuario.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "3- Privacidad de la informaci??n personal en la P??gina Web",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "??? Bantel garantiza la confidencialidad en el tratamiento de los datos de car??cter personal que se solicitan a trav??s de la P??gina Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? No obstante ello, Bantel adopta todas las medidas t??cnicas a su alcance para proveer la seguridad del caso, el Usuario acepta y conoce que todo servicio de comunicaciones, acceso o mensajes transmitidos por Internet o que provienen o se remiten de la P??gina Web est?? sujeto a la vulnerabilidad de los medios empleados para el acceso v??a Internet, por lo que el Usuario asume enteramente el riesgo, liberando de cualquier responsabilidad a Bantel, ante la posibilidad o hecho de que las comunicaciones puedan ser interceptadas por terceros, sin su consentimiento.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "4- Actualizaci??n de la P??gina Web",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "Bantel no garantiza actualizaci??n inmediata, exactitud, confiabilidad o vigencia de la informaci??n que se pueda obtener de la P??gina Web. Los productos y servicios de telecomunicaciones a los que Bantel hace referencia en la P??gina Web, as?? como sus tarifas est??n sujetos a las disposiciones legales y regulatorias que se encuentran a disposici??n del p??blico en cualquiera de los centros de atenci??n al cliente.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Bantel se reserva la facultad para modificar la informaci??n contenida en la P??gina Web en cualquier momento y sin previo aviso, as?? como el derecho de modificar las condiciones de acceso a ??sta. Las modificaciones entrar??n en vigor inmediatamente despu??s de que aparezcan en la P??gina Web, sin necesidad de notificaci??n al Usuario.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "5- Suspensiones e interrupciones de la P??gina Web",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "??? Bantel se reserva el derecho de suspender, temporalmente y sin previo aviso, el acceso a la P??gina Web, por tiempo indefinido, en raz??n de la eventual necesidad de efectuar operaciones de mantenimiento, reparaci??n, actualizaci??n o mejora de las mismas o causas similares.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Asimismo, Bantel no garantiza la inexistencia de interrupciones o errores en el acceso a la P??gina Web, ni ser?? responsable de los retrasos o fallas que se produjeran en el acceso, funcionamiento y operatividad de la misma, sus servicios y/o contenidos producidas por causas ajenas a su voluntad o fuera de su control o por cualquier otra situaci??n de caso fortuito o fuerza mayor. Bantel no asume ninguna responsabilidad por los da??os que puedan causarse en los equipos de los Usuarios por posibles virus inform??ticos o por cualquier otro da??o contra??do por el Usuario como consecuencia de la utilizaci??n o visualizaci??n de la P??gina Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Los supuestos de exclusi??n de responsabilidad antes se??alados no incluyen supuestos de dolo o culpa inexcusable de parte de Bantel.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Bantel, podr?? interrumpir, denegar, bloquear o dar por terminado el acceso a la P??gina Web o a cualquier funcionalidad de la misma, en cualquier momento y sin previo aviso o ante la detecci??n de cualquier tipo de acto u omisi??n que, a juicio y a sola discreci??n de Bantel, se considere como una violaci??n al contenido de la P??gina Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "??? Bantel no asumir?? responsabilidad alguna frente al Usuario o frente a terceros por la cancelaci??n del acceso a la P??gina Web o por la realizaci??n de cualquiera de las acciones antes mencionadas, ni la interrupci??n, denegaci??n, bloqueo o terminaci??n del acceso ni cualquier acci??n u omisi??n del Usuario implicar?? la p??rdida de vigencia de las obligaciones contenidas en estas Condiciones.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "6- Ley aplicable",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "??? Las condiciones establecidas en este documento se rigen por las leyes del Per??. El Usuario renuncia expresamente a cualquier otro fuero y se somete al de los Juzgados y Tribunales del Distrito Judicial de Lima, Per??.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        Titulo: {
          fontSize: 10,
          bold: true,
        },
        subTitulo: {
          fontSize: 9,
          italics: false,
          alignment: 'justify',
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
}
