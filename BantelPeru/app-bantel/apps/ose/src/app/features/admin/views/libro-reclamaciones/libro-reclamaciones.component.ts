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
          text: 'Política de Privacidad', style: 'header', alignment: 'center'
        },
        {
          text: "1.- Introducción",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "La presente Política de Privacidad protección de datos (en adelante, la “Política de Privacidad”) regula el tratamiento de los datos personales obtenidos por Bantel S.A.C. (en adelante, “BANTEL”) de todos sus clientes y usuarios, a través de los distintos canales de atención y comercialización de bienes y servicios.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "2.- Información sobre el Titular del Banco de Datos Personales",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL es una empresa peruana de telecomunicaciones, dedicada a ofrecer servicios basados en tecnología de la información, específicamente como ISP (Proveedor de Servicios de Internet). Todos los datos de carácter personal que se recojan a través del sitio Web serán almacenados en el Banco de Datos de Clientes del que es titular BANTEL y ha sido debidamente inscrito de forma diferenciada en el Registro Nacional de Protección de Datos Personales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "3.- Objeto",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "La presente Política de Privacidad regula la totalidad de relaciones existentes entre los clientes y usuario y BANTEL y, en su caso, la gestión de la relación comercial que les une. En el caso de que el cliente o usuario contrate cualquier servicio, tal relación se regulará de conformidad con las Condiciones Generales y, en su caso, con el Contrato de Prestación del Servicio contratado.\n" +
                "Los principios y disposiciones contenidos en la presente política se aplicarán a todo tratamiento de datos personales por parte de BANTEL, sus empleados y en lo que corresponda, por aquellos terceros con los que se acuerde todo o parte de la realización de cualquier actividad relacionada con el tratamiento de datos personales o con sus sistemas de información, a los cuales se les exigirá un nivel de diligencia y cumplimiento equivalente al que aplica BANTEL.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "4.- Finalidades del tratamiento",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "Los datos recabados por BANTEL se utilizan para las finalidades que se informen en los respectivos formularios a través de los cuales se recaben los datos personales. La finalidad genérica de recopilación de datos es la de mantener relaciones comerciales con los clientes y Usuario y remitirles en todo momento la información que soliciten.Asimismo, en el caso de que lo consienta expresamente, para remitirle comunicaciones comerciales relativas a la actividad empresarial de BANTEL.\n" +
                "BANTEL incluirá la información facilitada por el cliente o usuario en su Bancos de Datos de Clientes, para almacenarla, procesarla y, solo en caso de que el cliente o usuario lo consienta expresamente, transferir estos datos a alguna de sus empresas vinculadas, afiliadas y/o socios comerciales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "5.- Medidas de Seguridad",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL se toma muy en serio la protección de sus datos personales. Su información personal se conserva de forma segura y se trata con la máxima diligencia, garantizando su absoluta confidencialidad y empleando los estándares de seguridad adecuados conforme a los establecido en la Ley de Protección de Datos Personales – Ley N° 29733. Todo proceso de contratación o que conlleve la introducción de datos personales serán siempre transmitidos mediante protocolo de comunicación segura, de tal forma que ningún tercero tenga acceso a la información transmitida vía electrónica.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "6.- Principios del tratamiento",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL expone la presente política en atención a los principios rectores establecidos en la Ley Nº 29733 – Ley de Protección de Datos Personales. Por lo tanto:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (i) De acuerdo al principio de legalidad, BANTEL no realiza recopilación de datos personales por medios fraudulentos, desleales o ilícitos.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (ii) El tratamiento de datos personales se realizará siempre amparado en el consentimiento del titular, excluyendo las excepciones dispuestas por ley. iii) Los datos personales se recopilarán para una finalidad determinada, explícita y lícita, y no se extenderá a otra finalidad distinta a la establecida de manera inequívoca al momento de su recopilación, excluyendo los casos de actividades de valor histórico, estadístico o científico que incluyan un procedimiento de disociación o anonimización.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (iv) Todo tratamiento de datos personales será adecuado, relevante y no excesivo a la finalidad para la que estos hubiesen sido recopilados.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (v) Los datos personales serán veraces y exactos, implementándose, en la medida de lo posible, procedimientos de actualización.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (vi) Los datos personales se conservarán el tiempo necesario para cumplir con la finalidad del tratamiento, salvo disposiciones de almacenamiento posterior conforme a ley o autorización expresa del titular.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (vii) BANTEL y, en su caso, los encargados de tratamiento, adoptarán las medidas técnicas, organizativas y legales necesarias para garantizar la seguridad de los datos personales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (vii) BANTEL garantiza un nivel adecuado de seguridad en el tratamiento de datos personales, acorde con la normativa vigente o los estándares internacionales de la materia",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Adicionalmente a lo señalado, BANTEL informa de que los datos recabados podrán ser objeto de un proceso de anonimización irreversible que cumple con las medidas técnicas, organizativas y legales que señala la Política de Seguridad de la Información. Al respecto, es necesario señalar que los principios de protección de datos personales no son aplicables a la información anónima.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "En el proceso de anonimización, los datos personales son sustituidos por identificadores únicos irreversibles, de tal manera que no es posible ejecutar el proceso a la inversa (por ejemplo, no es posible obtener el número de teléfono ni ningún otro dato de carácter personal a partir del identificador señalado).",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Con dicha información anonimizada, BANTEL podrá realizar proyectos de Big Data en los que conjuntos de datos o combinaciones de conjuntos de datos de gran volumen y complejidad son procesados mediante tecnologías y herramientas que permiten obtener resultados de utilidad.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Asimismo, los datos personales se analizan con el objetivo de obtener resultados, siempre de manera agregada, con el fin de identificar comportamientos de carácter general y nunca de carácter individual. Una vez agregados, estos datos son extrapolados estadísticamente para realizar una estimación sobre el número total de personas, a fin de no tomar en cuenta únicamente al grupo de clientes y usuarios que están conectados a la red de BANTEL. Por todo lo anterior, dado que los datos son anonimizados, agregados y extrapolados, es imposible identificar de manera individual a los clientes o usuarios que generaron dicha información.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "7.- Transferencia de Datos Personales",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL únicamente transferirá datos de sus clientes a terceros si media consentimiento expreso e informado para ello, el cual será recabado individualmente para cada una de las transferencias. En caso de que el cliente o usuario así lo consienta, BANTEL podrá ofrecer, a través de cualquier medio escrito, verbal, electrónico y/o informático, cualquiera de los productos o servicios de terceras empresas.\n" +
            "No se considerará transferencia de datos personales a estos efectos, los accesos a datos personales realizados por entidades contratadas por BANTEL en calidad de Encargados del Banco de Datos, con el ánimo de prestar un servicio a BANTEL relacionado con las finalidades descritas. BANTEL se compromete a suscribir con tales encargados un contrato o cláusula de acceso a datos por cuenta de terceros en virtud de la que se comprometan a dar cumplimiento a las mismas obligaciones establecidas en el presente documento y a las exigidas por la normativa aplicable.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "8.- Calidad y Plazo de conservación de los Datos Personales",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "Los datos personales solicitados serán adecuados, pertinentes y no excesivos en relación con la finalidad para los que se recogen. El cliente o usuario garantiza que los datos personales facilitados son veraces y se hace responsable de comunicar a BANTEL cualquier modificación de los mismos. BANTEL hará los mejores esfuerzos para mantener su Banco de Datos actualizado, pero será responsabilidad del cliente y usuario informar a BANTEL de las modificaciones que a futuro se produzcan en sus datos personales. El cliente o usuario responderá, en cualquier caso, de la veracidad de los datos facilitados, reservándose BANTEL el derecho a excluir de los servicios registrados a todo cliente o usuario que hayan facilitado datos falsos, sin perjuicio de las demás acciones que procedan en Derecho.\n" +
            "Los datos personales serán tratados hasta que sea necesario para cumplir con las finalidades asociadas a su recopilación. Una vez cumplida dicha finalidad, se conservarán bloqueados, no permitiendo su utilización para cualquier otra finalidad, durante el tiempo en que pueda exigirse algún tipo de responsabilidad de BANTEL derivada de esta relación o fruto de alguna disposición acorde a ley. En todo caso, se toma como plazo máximo hasta la cancelación definitiva el plazo de diez (10) años, salvo exista alguna obligación legal o el cliente o usuario lo autorice por más tiempo.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "9.- Tratamiento de Datos Sensibles y de Menores de Edad.",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL no lleva a cabo tratamiento de datos sensibles, salvo la recopilación de los datos de los clientes solicitada únicamente y en caso corresponda por la naturaleza de la contratación.\n" +
            "BANTEL no recoge datos de menores de edad salvo los recabados con el previo consentimiento de sus padres, tutores o representantes legales. Si algún menor de edad ingresa sus datos personales a través del sitio web de BANTEL, deberá solicitar el permiso correspondiente a sus padres, tutores o representantes legales, quienes serán considerados responsables de todos los actos realizados por los menores a su cargo.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "10.- Ejercicio de los Derechos de Acceso, Rectificación Supresión y Oposición.",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "La normativa vigente en protección de datos otorga al titular de los datos personales un conjunto de derechos que le garantizan el control sobre los mismos. Dentro de este grupo, el cliente o usuario puede ejercitar los siguientes derechos:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (i) Derecho de acceso. Derecho a obtener información sobre los datos personales de sí mismo que son objeto de tratamiento por parte de BANTEL.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (ii) Derecho de rectificación. Derecho a solicitar a BANTEL la corrección de los datos personales objeto de tratamiento, ya sea por inexactitud u omisión. Incorpora el derecho de actualización e inclusión.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Derecho de cancelación. Derecho a solicitar la eliminación de sus datos personales, anulando el tratamiento de los mismos. La solicitud de supresión o cancelación podrá referirse a todos los datos personales del titular contenidos en un banco de datos personales o solo a alguna parte de ellos.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (ii) Derecho de oposición. Derecho a oponerse al tratamiento de sus datos personales para finalidades concretas atendiendo a motivos fundados y legítimos relativos a una concreta situación personal.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Para poder ejercitar estos derechos, BANTEL pone a disposición dos canales de atención:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Vía correo electrónico. Envío de correo electrónico dirigido a protecciondedatos@bantelperu.com, con la referencia “Protección de Datos Personales”, acreditando su identidad mediante copia de documento de identidad o documento equivalente, especificando el tipo de solicitud y sus motivos. De requerir información adicional, se le comunicará oportunamente por el mismo medio.\n" +
            "Las solicitudes serán atendidas por BANTEL sin costo alguno en los plazos contados desde la fecha en la que se presenta la solicitud. A través de la respuesta se concederá el ejercicio del derecho o se justificará su negativa.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "11.- Uso de Cookies",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "Este sitio web utiliza cookies, pequeños archivos almacenados en las computadoras que permiten recordar características o preferencias de la navegación en nuestro sitio Web, y personalizar las futuras visitas de nuestros clientes y usuarios. Asimismo, hacen más segura la navegación y permiten ofrecer información de acuerdo al interés del cliente o usuario. Quien navega en la web de BANTEL puede aceptar o rechazar la instalación de cookies o suprimirlos una vez que haya finalizado su navegación en la web. BANTEL no se responsabiliza que por la desactivación de las cookies se pueda impedir el buen funcionamiento de nuestra web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "12.- Tráfico IP",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL no almacena información de las IPs asignadas a los usuarios que visitan nuestros portales web. En ese sentido, en nuestros bancos de datos no se recoge información alguna respecto a las IP, estáticas o dinámicas, que nuestros usuarios hayan utilizado en cualquiera de sus navegaciones.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "13.- Cambios",
          margin: [30, 4, 30, 4],
          style: 'Titulo'
        },
        {
          text: "BANTEL se reserva el derecho de revisar su Política de Privacidad. En caso de que se lleven a cabo modificaciones sustanciales que puedan tener impacto en la protección de los datos personales de los usuarios, éstos serán informados. Por esta razón, le exhortamos a que compruebe de forma periódica y regular esta declaración de privacidad para leer la versión más reciente de la Política de Privacidad para Clientes y Usuarios de BANTEL.",
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
          text: 'Términos y condiciones', style: 'header', alignment: 'center'
        },
        {
          text: "Términos y Condiciones para el uso y privacidad de la página web de Bantel S.A.C.",
          margin: [30, 4, 5, 4],
          style: 'subTitulo'
        },
        {
          text: "El uso de la página web de Bantel S.A.C. (en adelante la “Página Web”) está sujeto a los términos y condiciones establecidos en este documento. Asimismo, la utilización de la Página Web atribuye al usuario (en adelante, el “Usuario”) la aceptación de todas las disposiciones incluidas en este documento. El Usuario acepta los siguientes términos y condiciones:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "1- Obligaciones del Usuario por el uso de la Página Web:",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "– El Usuario acepta y reconoce ser responsable por el uso de la Página Web, liberando de cualquier responsabilidad a Bantel S.A.C. (en adelante “Bantel”) y a cualquiera de sus respectivos directores, funcionarios, empleados u otros representantes que, en ningún caso, responderán por daños directos o indirectos, ni por daño emergente ni por lucro cesante, por los perjuicios que puedan derivarse del uso de la Página Web o del acceso a otros sitios de terceros a través de las conexiones y “links” que pudiesen existir.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– El Usuario declara contar con capacidad legal para aceptar las condiciones escritas en este documento. Toda información proporcionada por el Usuario a Bantel a través de la Página Web, se considera verdadera y correcta.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– El Usuario será responsable exclusivo de todas y cada una de las actividades que se realicen bajo su contraseña por lo que deberá mantener la confidencialidad de ésta.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– El Usuario asume toda responsabilidad, así como los riesgos, daños, perjuicios y las responsabilidades civiles o penales que ello implique de manera directa o indirecta por cualquier operación con la contraseña. Asimismo, el Usuario reconoce que Bantel no asumirá en ningún caso responsabilidad por el uso indebido de la contraseña por parte del Usuario por lo que acepta expresamente que será responsable frente a terceros que puedan sufrir consecuencia alguna por ello.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Para hacer uso de los Servicios los menores de edad deben obtener previamente permiso de sus padres, tutores o representantes legales, quienes serán considerados responsables de todos los actos realizados por los menores a su cargo. El uso de la Página Web por los menores de edad es responsabilidad absoluta de los mayores a cuyo cargo.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– El Usuario, no deberá utilizar la Página Web para la realización de fines y actos ilícitos, contrarios a la moral, a las buenas costumbres, al orden público o lesivo de derechos de terceros, ni para enviar información o contenidos que puedan ser considerados ilegales.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– El Usuario no deberá:",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (i) Reproducir información privada sobre cualquier persona natural o jurídica sin la debida autorización para hacerlo, incluyendo cuentas de correo electrónico;",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (ii) Proveer información falsa que conciernan a terceros;",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– (iii) Transmitir cualquier material que contenga virus u otro potencialmente dañino.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– El Usuario se abstendrá de utilizar los contenidos y/o servicios que puedan dañar, inutilizar o sobrecargar la Página Web o impedir o restringir su normal utilización. El incumplimiento de las mismas dará lugar a las responsabilidades civiles y penales correspondientes.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "Bantel no se responsabiliza de los daños o perjuicios en el software o hardware del Usuario o terceros producido por el acceso a la Página Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "2- Propiedad Intelectual",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "– Todas las marcas, textos e imágenes que se encuentren en la Página Web están protegidos por las leyes de propiedad intelectual e industrial y derechos de autor. En ningún caso el uso de la Página Web implica algún tipo de renuncia, transmisión o cesión total ni parcial de dichos derechos, ni confiere ningún derecho de utilización, alteración, explotación, reproducción, distribución o comunicación pública sobre dichos contenidos sin la previa y expresa autorización otorgada a tal efecto por parte de Bantel o del tercero titular de los derechos afectados, salvo que se advierta a dichos terceros de manera expresa respecto de la titularidad de Bantel de los derechos de autor y las limitaciones impuestas al uso de dichos contenidos, marcas, textos o imágenes gráficas.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Se autoriza la visualización, impresión y descarga parcial del contenido de la Página Web única y exclusivamente cuando estos actos se realicen con el fin de obtener información sobre Bantel y/o sus productos para el uso personal y privado del Usuario.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "3- Privacidad de la información personal en la Página Web",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "– Bantel garantiza la confidencialidad en el tratamiento de los datos de carácter personal que se solicitan a través de la Página Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– No obstante ello, Bantel adopta todas las medidas técnicas a su alcance para proveer la seguridad del caso, el Usuario acepta y conoce que todo servicio de comunicaciones, acceso o mensajes transmitidos por Internet o que provienen o se remiten de la Página Web está sujeto a la vulnerabilidad de los medios empleados para el acceso vía Internet, por lo que el Usuario asume enteramente el riesgo, liberando de cualquier responsabilidad a Bantel, ante la posibilidad o hecho de que las comunicaciones puedan ser interceptadas por terceros, sin su consentimiento.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "4- Actualización de la Página Web",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "Bantel no garantiza actualización inmediata, exactitud, confiabilidad o vigencia de la información que se pueda obtener de la Página Web. Los productos y servicios de telecomunicaciones a los que Bantel hace referencia en la Página Web, así como sus tarifas están sujetos a las disposiciones legales y regulatorias que se encuentran a disposición del público en cualquiera de los centros de atención al cliente.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Bantel se reserva la facultad para modificar la información contenida en la Página Web en cualquier momento y sin previo aviso, así como el derecho de modificar las condiciones de acceso a ésta. Las modificaciones entrarán en vigor inmediatamente después de que aparezcan en la Página Web, sin necesidad de notificación al Usuario.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "5- Suspensiones e interrupciones de la Página Web",
          margin: [30, 4, 5, 4],
          style: 'Titulo'
        },
        {
          text: "– Bantel se reserva el derecho de suspender, temporalmente y sin previo aviso, el acceso a la Página Web, por tiempo indefinido, en razón de la eventual necesidad de efectuar operaciones de mantenimiento, reparación, actualización o mejora de las mismas o causas similares.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Asimismo, Bantel no garantiza la inexistencia de interrupciones o errores en el acceso a la Página Web, ni será responsable de los retrasos o fallas que se produjeran en el acceso, funcionamiento y operatividad de la misma, sus servicios y/o contenidos producidas por causas ajenas a su voluntad o fuera de su control o por cualquier otra situación de caso fortuito o fuerza mayor. Bantel no asume ninguna responsabilidad por los daños que puedan causarse en los equipos de los Usuarios por posibles virus informáticos o por cualquier otro daño contraído por el Usuario como consecuencia de la utilización o visualización de la Página Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Los supuestos de exclusión de responsabilidad antes señalados no incluyen supuestos de dolo o culpa inexcusable de parte de Bantel.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Bantel, podrá interrumpir, denegar, bloquear o dar por terminado el acceso a la Página Web o a cualquier funcionalidad de la misma, en cualquier momento y sin previo aviso o ante la detección de cualquier tipo de acto u omisión que, a juicio y a sola discreción de Bantel, se considere como una violación al contenido de la Página Web.",
          margin: [30, 4, 30, 4],
          style: 'subTitulo'
        },
        {
          text: "– Bantel no asumirá responsabilidad alguna frente al Usuario o frente a terceros por la cancelación del acceso a la Página Web o por la realización de cualquiera de las acciones antes mencionadas, ni la interrupción, denegación, bloqueo o terminación del acceso ni cualquier acción u omisión del Usuario implicará la pérdida de vigencia de las obligaciones contenidas en estas Condiciones.",
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
          text: "– Las condiciones establecidas en este documento se rigen por las leyes del Perú. El Usuario renuncia expresamente a cualquier otro fuero y se somete al de los Juzgados y Tribunales del Distrito Judicial de Lima, Perú.",
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
