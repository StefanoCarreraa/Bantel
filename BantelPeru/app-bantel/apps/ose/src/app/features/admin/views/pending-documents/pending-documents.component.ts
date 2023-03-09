import { Component, OnInit } from '@angular/core';
import { PendingDocument } from '../../interfaces/document.interface';
import { DocumentService } from '../../../../../../../../libs/ose-commons/src/lib/services/document/document.service';
import { OseMaestroHttp } from '@ose/commons/http';
import { MatDialog } from '@angular/material/dialog';
import { OseLoadingComponent } from '@ose/commons/components';
import { finalize } from 'rxjs/operators';
import { OseSession } from '../../../../../../../../libs/ose-commons/src/lib/services/session/session.service';
import { DocumentoxCobrarResponse } from '../../../../../../../../libs/ose-commons/src/lib/models/maestro';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pending-documents',
  templateUrl: './pending-documents.component.html',
  styleUrls: ['./pending-documents.component.scss']
})
export class PendingDocumentsComponent implements OnInit {
  private logo = '../../../../assets/img/gallery/logo2.jpg';
  //documents: DocumentoxCobrarResponse[];
  documents: any[];

  selectedDocuments: PendingDocument[];
  // states: string;

  cols: any[];

  loading: boolean = true;

  userDni: string;
  idpersona: string;

  addCredito: boolean = false
  //addPDF: boolean = false
  total: any
  importeTotal: any
  itemsTotal: any
  debe: any
  aviso: any

  constructor(private documentService: DocumentService,
    private http: OseMaestroHttp,
    private dialog: MatDialog,
    private session: OseSession,
  ) {
    // this.states
    this.userDni = this.session.userDni;
    this.idpersona = this.session.idpersona;
  }

  ngOnInit() {
    /*this.documentService.getPendingDocuments().then(documents => {
        this.documents = documents;
        this.loading = false;
        this.documents.forEach(document => document.dateEmit = new Date(document.dateEmit));
    });*/

    //this.ListaDocCobrar();
    this.ListarDocxCobrar();
  }

  public ListaDocCobrar() {
    //const loading = this.dialog.open(OseLoadingComponent, { disableClose: true });
    this.http.getAllDocCObrar(this.userDni)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (documents) => {
          this.documents = documents;
          this.cols = [
            { field: 'nroRecibo', header: 'Nro. Recibo' },
            { field: 'servicioPlan', header: 'Plan' },
            { field: 'periodo', header: 'Periodo' },
            { field: 'importe', header: 'Importe' },
            { field: 'bill_url', header: 'Recibo' },
            { field: 'estado', header: 'Estado' },
            { field: ' <button mat-icon-button color="primary" (click)="descargarNotificacionPDF()" aria-label="Descargar Notificación"><mat-icon>delete</mat-icon></button>', header: '' },
            { field: ' <button mat-icon-button color="primary" (click)="descargarBolestaPDF()" aria-label="Descargar Boleta"><mat-icon>delete</mat-icon></button>', header: '' },
            { field: ' <button pButton type="button" class="p-button-secondary" (click)="display()" label="PAGAR"></button>', header: '' }
          ];
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public ListarDocxCobrar() {
    let importeTotal = 0
    this.debe = -1
    this.aviso = ''
    this.importeTotal = importeTotal.toFixed(2)
    //const loading = this.dialog.open(OseLoadingComponent, { disableClose: true });
    //this.http.ListarDocumentoxCliente(this.userDni)
    this.http.ListarDocxCobrar(this.idpersona)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (documents) => {
          this.documents = documents;
          /*this.cols = [
            { field: 'nroRecibo', header: 'Nro. Recibo' },
            { field: 'servicioPlan', header: 'Plan' },
            { field: 'periodo', header: 'Período' },
            { field: 'importe', header: 'Importe' },
            { field: 'bill_url', header: 'Recibo' },
            { field: 'estado', header: 'Estado' },
            { field: ' <button mat-icon-button color="primary" (click)="descargarPDF(document)" aria-label="Impresión PDF"><mat-icon>picture_as_pdf</mat-icon></button>', header: '' },
            //{ field: ' <button mat-icon-button color="primary" (click)="descargarNotificacionPDF()" aria-label="Descargar Notificación"><mat-icon>delete</mat-icon></button>', header: '' },
            //{ field: ' <button pButton type="button" class="p-button-secondary" (click)="display()" label="PAGAR"></button>', header: '' }
          ];*/
          for (let pro of this.documents) {
             importeTotal = importeTotal + pro.IMPORTE            
          }
          this.importeTotal = importeTotal.toFixed(2)
          console.log('Importe Total:::: ' + this.importeTotal)

          this.itemsTotal = this.documents.length
          console.log('Cantidad items::: ' + this.itemsTotal)
          if (this.itemsTotal == 0) {
            this.debe = 0
            this.aviso = "¡Muy bien, Felicidades! \n¡Vamos tu puedes! \n¡No te vayas, sigue con nosotros!"
          } else {
            console.log('Total documentos:::: ', this.documents)
            let concat = ''
            let contador = 0
            let periodo = ''
            let totalmeses = 0
            for (let pro of this.documents) {
              concat = pro.AÑO.toString() + pro.MES_NUM.toString()
              if (contador == 0) {
                periodo = concat
                totalmeses = 1
                console.log('1111111111111111')
              } else {
                if (periodo != concat) {
                  totalmeses = totalmeses + 1
                  console.log('333333333333333')
                }
              }
              periodo = concat
              contador++
            }
            console.log('Concatenado:::: ' + concat + ' Total meses:::: ' + totalmeses)
            if (totalmeses == 1) {
              this.debe = 1
              this.aviso = "Debes un mes"
            } else if (totalmeses > 1) {
              this.debe = 2
              this.aviso = "Debes más de un mes"
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

    modal = document.getElementById("pagos") as HTMLImageElement;
    display () {
      console.log("holi")
      let element = document.getElementById("pagos");
      element.classList.remove("banish");
    }

    // Get the <span> element that closes the modal
     span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    closeModal () {
     let element = document.getElementById("pagos");
      element.classList.add("banish");
    }

  //async descargarDocumentoPDF(item) {
  async descargarNotificacionPDF(item) {
    console.log('ID DOC::: ', item.id_Doc_Cobrar)
    let obj = {
      iddoc: (53305).toString(),
    }
    this.http.ImpresionListar(obj)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          this.pdfNotificacion(data)
          console.log('Notificaciones::: ', data)
        },
        (err) => {
          console.log(err);
        }
      );
  }

  separatorNumero(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }

  async pdfNotificacionX(data) {
    let body = [[
    { text: 'F. Emisión', style: 'headerTableDet', border: [true, true, true, true] },
    { text: 'Nro. Recibo', style: 'headerTableDet', border: [true, true, true, true] },
    { text: 'Período', style: 'headerTableDet', border: [true, true, true, true] },
    { text: 'Descripción Servicio/Plan', style: 'headerTableDet', border: [true, true, true, true] },
    { text: 'F. Vcto.', style: 'headerTableDet', border: [true, true, true, true] },
    { text: 'Importe', style: 'headerTableDet' , border: [true, true, true, true]}
    ]];
    for (let det of data) {
    body.push([
      { text: det.fecha, style: 'bodyTableDet', border: [true, false, true, false] },
      { text: '000000000117830', style: 'bodyTableDet', border: [true, false, true, false] },
      { text: 'NOVIEMBRE - 2021', style: 'bodyTableDet', border: [true, false, true, false] },
      { text: 'PLAN HOGAR INTERNET 30 MBPS + 2CATV - MZ. G BLOCK 20 DPTO 806  COMAS', style: 'bodyTableDet', border: [true, false, true, false] },
      { text: det.f_vcto, style: 'bodyTableDet', border: [true, false, true, false] },
      { text: det.precio, style: 'bodyTableDetCantidad', border: [true, false, true, false] }
    ])
    }
    const documentDefinition = {
      pageMargins: [20, 160, 20, 0], // margen solo contenido
      header: {
        margin: [25, 25, 40, 25],
        layout: 'noBorders',
        //columns: [
          //{
            table: {
              //margin: [20, 20, 20, 20],
              widths: [360, 166],
              //heights: ['auto', 120],
              body: [
                [
                  {
                    margin: [0, 2, 0, 2],
                    layout: 'noBorders',
                    table: {
                      widths: ['*'],
                      heights: [45],
                      body: [
                        [{ image: await this.getBase64ImageFromURL(this.logo), width: 200, height: 70, style: 'centrar' }],
                      ]
                    },
                    //image: await this.getBase64ImageFromURL(this.logo), width: 140, height: 70, style: 'centrar'
                  },
                  {
                    margin: [10, 4, 0, 0],
                    //layout: 'noBorders',
                    table: {
                      widths: [140],
                      heights: [18, 18, 18],
                      body: [
                        [{ text: 'R.U.C: ' + data[0].ruc_empresa, style: 'header1', border: [true, true, true, false]}],
                        [{ text: 'NOTIFICACIÓN DE PAGO', style: 'header1', border: [true, false, true, false] }],
                        [{ text: 'Nro.: ' + '000000000117830', style: 'header1', border: [true, false, true, true] }]
                      ]
                    },
                  }
                ],
                [
                  {
                    margin: [10, 2, 0, 2],
                    layout: 'noBorders',
                    table: {
                      widths: [320],
                      heights: [12],
                      body: [
                        [{ text: data[0].direccion_empresa, style: 'header2' }],
                        [{ text: data[0].telefono_empresa, style: 'header2' }],
                      ]
                    }
                  },
                  {
                    margin: [10, 2, 0, 2],
                    table: {
                      widths: [140],
                      body: [
                        [{ text: 'FECHA DE VENCIMIENTO', style: 'headerFecha', border: [true, true, true, false] }],
                        [{ text: data[0].f_vcto, style: 'headerFecha', border: [true, false, true, true] }]
                      ]
                    },
                  }
                ]
              ]
            }
          //},
        //],

      },
      footer: function (currentPage, pageCount) {
        return [
          { text: currentPage.toString() + ' / ' + pageCount, alignment: 'right', margin: [0, 0, 30, 0] }
        ]
      },
      content: [
        {
          margin: [5, 5, 5, 5],
          layout: 'noBorders',
          table: {
            widths: [55, 175, 45, 233],
            heights: [12, 12, 12],
            body: [
              [{ text: 'CLIENTE:', style: 'bodyLabel' }, { text: data[0].nombre_cliente, colSpan: 3, style: 'body' }, {}, {}],
              [{ text: 'D.N.I.:', style: 'bodyLabel' }, { text: data[0].clie_nro_documento, style: 'body' }, { text: 'EMISIÓN:', style: 'bodyLabel' }, { text: 'Jueves, 25 de Noviembre de 2021', style: 'body' }],
              [{ text: 'DIRECCIÓN:', style: 'bodyLabel' }, { text: data[0].clie_direccion, colSpan: 3, style: 'body' }, {}, {}],
            ]
          }
        },
        {
          margin: [5, 5, 5, 0],
          table: {
            headerRows: 1,
            widths: [50, 70, 70, '*', 45, 35],
            heights: [15, 15, 15, 15, 15, 15],
            body: body
          }
        },
        //{
        //  margin: [5, 0, 5, 5],
        //  //layout: 'noBorders',
        //  table: {
        //    widths: [536],
        //    body: [
        //      [
        //        { text: '', border: [false, true, false, false] }
        //      ]
        //    ]
        //  }
        //},
        { canvas: [{ type: 'line', x1: 5, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
        {
          margin: [5, 5, 5, 5],
          layout: 'noBorders',
          table: {
            //widths: [297, 160, 60],
            widths: [304, 160, 60],
            heights: [15],
            body: [
              [
                {},
                {
                  margin: [0, 0, 0, 0],
                  table: {
                    widths: [150],
                    heights: [15],
                    body: [
                      [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }],
                    ]
                  },
                },
                {
                  margin: [0, 0, 0, 0],
                  table: {
                    widths: [55],
                    heights: [15],
                    body: [
                      [{ text: data[0].total, style: 'bodyCantidad' }],
                    ]
                  },
                },
                //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
              ]
            ]
          }
        },
        {
          margin: [5, 5, 5, 5],
          layout: 'noBorders',
          table: {
            widths: [220, 306],
            //heights: [15],
            body: [
              [
                {
                  margin: [20, 5, 20, 5],
                  layout: 'noBorders',
                  table: {
                    heights: [1, 12, 1, 1],
                    body: [
                      [{ qr: 'QR', style: 'impresa', fit: '80' }],
                      [{ text: 'Representación Impresa de NOTIFICACIÓN DE PAGO', style: 'impresa' }],
                      [{ text: 'Esta puede ser consultada en:', style: 'impresa' }],
                      [{ text: 'http://wwww.bantelperu.com', style: 'impresa' }]
                    ]
                  }, //style: 'centrar'
                },
                {},
              ]
            ]
          }
        }
      ],
      styles: {
        header1: {
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        header2: {
          fontSize: 10,
          alignment: 'center'
        },
        headerFecha: {
          fontSize: 10,
          color: 'red',
          bold: true,
          alignment: 'center'
        },
        bodyLabel: {
          fontSize: 10,
          bold: true,
          alignment: 'left'
        },
        body: {
          fontSize: 10,
        },
        bodyCantidad: {
          fontSize: 10,
          alignment: 'right'
        },
        headerTableDet: {
          fontSize: 8,
          bold: true,
          alignment: 'center',
          //background: 'blue',
          fillColor: '#063970',
          color: 'white'
        },
        bodyTableDet: {
          fontSize: 8,
          //bold: true,
          alignment: 'left'
        },
        bodyTableDetCantidad: {
          fontSize: 8,
          alignment: 'right'
        },
        impresa: {
          fontSize: 7,
          alignment: 'center'
        },
        centrar: {
          alignment: 'center'
        }
      }
    };
    //pdfMake.createPdf(documentDefinition).download('Recibo');
    pdfMake.createPdf(documentDefinition).open();
  }

  async descargarPDF(item) {
    let idDocCobrar = item.ID_DOC_COBRAR

    console.log('ID DOC COBRAR::: ', idDocCobrar)
    this.http.ImpresionNotificacion(idDocCobrar)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
            this.pdfNotificacion(data)
            console.log('Notificacion::: ', data)
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async pdfNotificacion(data) {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let fechaActual = anio + '' + (mes < 10 ? '0' : '') + mes + '' + (dia < 10 ? '0' : '') + dia;
    console.log('Fecha Actual:::: ' + fechaActual)
    this.total = 0
    let body = [[
      { text: 'F. Emisión', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'Nro. Recibo', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'Período', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'Descripción Servicio/Plan', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'F. Vcto.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'Importe', style: 'headerTableDet', border: [true, true, true, false] }
    ]];
    for (let det of data) {
      body.push([
        { text: det.PFECHA_P_EMISION, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: det.NUM_DOCUMENTO, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: det.PERIODO, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: det.ITEM_DESCRIPCION, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: det.PFECHA_P_VENCIMIENTO, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: this.separatorNumero(det.IMPORTE.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] }
      ])
      this.total = this.total + det.IMPORTE;
    }
    const documentDefinition = {
      pageMargins: [20, 160, 20, 70], // margen solo contenido
      header: {
        margin: [25, 25, 40, 25],
        layout: 'noBorders',
        //columns: [
        //{
        table: {
          //margin: [20, 20, 20, 20],
          widths: [360, 172],
          //heights: ['auto', 120],
          body: [
            [
              {
                margin: [0, 0, 0, 0],
                layout: 'noBorders',
                table: {
                  widths: ['*'],
                  heights: [45],
                  body: [
                    [{ image: await this.getBase64ImageFromURL(this.logo), width: 190, height: 75, style: 'centrar' }],
                  ]
                },
                //image: await this.getBase64ImageFromURL(this.logo), width: 140, height: 70, style: 'centrar'
              },
              {
                margin: [17, 0, 0, 0],
                //layout: 'noBorders',
                table: {
                  widths: [150],
                  heights: [18, 18, 18],
                  body: [
                    [{ text: 'R.U.C ' + data[0].RUC_EMPRESA, style: 'header1', border: [true, true, true, false] }],
                    [{ text: data[0].DESCRIPCION, style: 'header1', border: [true, false, true, false] }],
                    [{ text: 'Nro: ' + data[0].NUM_DOCUMENTO, style: 'header1', border: [true, false, true, true] }]
                  ]
                },
              }
            ],
            [
              {
                margin: [10, 2, 0, 2],
                layout: 'noBorders',
                table: {
                  widths: [320],
                  heights: [12],
                  body: [
                    [{ text: data[0].DIRECCION_EMPRESA, style: 'header2' }],
                    [{ text: data[0].TELEFONO_EMPRESA, style: 'header2' }],
                  ]
                }
              },
              //{}
              {
                margin: [17, 2, 0, 2],
                table: {
                  widths: [150],
                  body: [
                    [{ text: 'FECHA DE VENCIMIENTO', style: 'headerFecha', border: [true, true, true, false] }],
                    [{ text: data[0].PFECHA_P_VENCIMIENTO_1, style: 'headerFecha', border: [true, false, true, true] }]
                  ]
                },
              }
            ]
          ]
        }
        //},
        //],

      },
      footer: function (currentPage, pageCount) {
        return [
          { text: currentPage.toString() + ' / ' + pageCount, alignment: 'right', margin: [0, 10, 30, 0] }
        ]
      },
      pageSize: 'A4',
      content: [
        {
          margin: [5, 0, 5, 5],
          layout: 'noBorders',
          table: {
            widths: [55, 208, 40, 205],
            heights: [12, 12, 12],
            body: [
              [{ text: 'Cliente:', style: 'bodyLabel' }, { text: data[0].PERSONA, colSpan: 3, style: 'body' }, {}, {}],
              [{ text: data[0].DOCUMENTO, style: 'bodyLabel' }, { text: data[0].DNI, style: 'body' }, { text: 'Emisión:', style: 'bodyLabel' }, { text: data[0].FECHA_EMISION_NAME, style: 'body' }],
              [{ text: 'Dirección:', style: 'bodyLabel' }, { text: data[0].DIRECCION, colSpan: 3, style: 'body' }, {}, {}],
            ]
          }
        },
        {
          margin: [5, 5, 5, 0],
          table: {
            headerRows: 1,
            widths: [46, 72, 67, '*', 44, 40],
            //heights: [15, 15, 15, 15, 15],
            body: body
          }
        },
        /*{
          margin: [5, 0, 5, 5],
          //layout: 'noBorders',
          table: {
            widths: [535],
            //widths: [304, 160, 60],
            //heights: [15],
            body: [
              [
                { text: 'SON: ' + data[0].NUMERO_LETRAS, style: 'body', alignment: 'left', border: [true, true, true, true], margin: [0, 3, 0, 3] }
              ]
            ]
          }
        },*/
        { canvas: [{ type: 'line', x1: 5, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
        {
          margin: [5, 20, 5, 5],
          layout: 'noBorders',
          table: {
            widths: [220, 320],
            //heights: [15],
            body: [
              [
                {
                  margin: [20, 5, 20, 5],
                  layout: 'noBorders',
                  table: {
                    heights: [1, 12, 1, 1],
                    body: [
                      [{ qr: data, style: 'impresa', fit: '80', margin: [0, 0, 0, 5], }],
                      [{ text: 'Representación Impresa de ' + data[0].DESCRIPCION, style: 'impresa' }],
                      [{ text: 'Esta puede ser consultada en:', style: 'impresa' }],
                      [{ text: data[0].WEB_EMPRESA, style: 'impresa' }]
                    ]
                  }, //style: 'centrar'
                },
                {
                  margin: [24, 0, 0, 0],
                  layout: 'noBorders',
                  table: {
                    //widths: [297, 160, 60],
                    widths: [209, 60],
                    heights: [15],
                    body: [
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Pendiente: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(this.total.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ]
                    ]
                  }
                }
              ]
            ]
          }
        },
      ],
      styles: {
        header1: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          color: '#012042'
        },
        header2: {
          fontSize: 10,
          alignment: 'center',
          color: '#012042'
        },
        headerFecha: {
          fontSize: 10,
          color: 'red',
          bold: true,
          alignment: 'center'
        },
        bodyLabel: {
          fontSize: 10,
          bold: true,
          alignment: 'left',
          color: '#012042'
        },
        body: {
          fontSize: 10,
        },
        bodyCantidad: {
          fontSize: 10,
          alignment: 'right'
        },
        headerTableDet: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          //background: 'blue',
          fillColor: '#B5B9BD',
          //color: 'black',
          margin: [0, 4, 0, 4]
        },
        bodyTableDet: {
          fontSize: 8,
          //bold: true,
          alignment: 'left',
          margin: [0, 4, 0, 4]
        },
        bodyTableDetCantidad: {
          fontSize: 8,
          alignment: 'right',
          margin: [0, 4, 0, 4]
        },
        bodyTableDetCantidad2: {
          fontSize: 8,
          alignment: 'center',
          margin: [0, 4, 0, 4]
        },
        impresa: {
          fontSize: 7,
          alignment: 'center'
        },
        centrar: {
          alignment: 'center'
        },
        body2: {
          fontSize: 8,
          bold: true,
          color: '#012042'
        },
        bodyCantidad2: {
          fontSize: 8,
          alignment: 'right'
        },
      }
    };
    pdfMake.createPdf(documentDefinition).download(data[0].NUM_DOCUMENTO + '_' + fechaActual);
    //pdfMake.createPdf(documentDefinition).open();
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

