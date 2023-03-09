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
  selector: 'app-comprobantes-documents',
  templateUrl: './comprobantes-documents.component.html',
  styleUrls: ['./comprobantes-documents.component.scss']
})
export class ComprobantesDocumentsComponent implements OnInit {
  private logo = '../../../../assets/img/gallery/logo2.jpg';
  documents: DocumentoxCobrarResponse[];

  selectedDocuments: PendingDocument[];
  // states: string;

  cols: any[];

  loading: boolean = true;

  userDni: string;
  idpersona: string;

  constructor(private documentService: DocumentService,
    private http: OseMaestroHttp,
    private dialog: MatDialog,
    private session: OseSession,
  ) {
    // this.states
    this.userDni = this.session.userDni;
    this.idpersona = this.session.idpersona;
  }

  ngOnInit(): void {
    this.Listar();
  }

  public Listar() {
    //const loading = this.dialog.open(OseLoadingComponent, { disableClose: true });
    this.http.Listar(this.idpersona)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (documents) => {
          this.documents = documents;
          /*this.cols = [
            { field: 'nroComprobante', header: 'Nro. Comprobante' },
            { field: 'tipoComprobante', header: 'Tipo Comprobante' },
            { field: 'fecha', header: 'Fecha' },
            { field: 'importe', header: 'Importe' },
            { field: ' <button mat-icon-button color="primary" (click)="descargarPDF(document)" aria-label="Descargar PDF"><mat-icon>picture_as_pdf</mat-icon></button>', header: '' },
          ];*/
        },
        (err) => {
          console.log(err);
        }
      );

  }

  async descargarPDF(item) {
    let nota = ''
    let idDocumento = item.ID_Documento
    let detraccion = item.Flag_Detraccion
    let iddoc = (item.ID_DocVenta).toString()
    this.http.Impresion(iddoc)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        data => {
          if (idDocumento == 301) {
            // Sin DETRACCION = 0, Con DETRACCION = 1
            this.pdfFactura(data, detraccion)
            console.log('Factura::: ', data)
          }
          else if (idDocumento == 303) {
            this.pdfBoleta(data)
            console.log('Boleta::: ', data)
          }
          else if (idDocumento == 307 || idDocumento == 315) {
            if (idDocumento == 307) {
              nota = 'CRÉDITO'
            } else if (idDocumento == 315) {
              nota = 'DÉBITO'
            }
            this.pdfCreditoDebito(data, nota)
            console.log('Credito - Debito::: ', data)
          }
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

  async pdfBoleta(data) {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let fechaActual = anio + '' + (mes < 10 ? '0' : '') + mes + '' + (dia < 10 ? '0' : '') + dia;
    let body = [[
      { text: 'CANT.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'U.M.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'DESCRIPCIÓN', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'P. UNITARIO', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'IMPORTE', style: 'headerTableDet', border: [true, true, true, false] }
    ]];
    for (let det of data) {
      body.push([
        { text: det.CANTIDAD, style: 'bodyTableDetCantidad2', border: [true, false, true, false] },
        { text: det.Cod_unidad, style: 'bodyTableDetCantidad2', border: [true, false, true, false] },
        { text: det.Glosa, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: this.separatorNumero(det.PRECIO.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] },
        { text: this.separatorNumero(det.IMPORTE.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] }
      ])
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
                    [{ text: data[0].NRO_DOCUMENTO, style: 'header1', border: [true, false, true, true] }]
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
              {}
              //{
              //  margin: [10, 2, 0, 2],
              //  table: {
              //    widths: [140],
              //    body: [
              //      [{ text: 'FECHA DE VENCIMIENTO', style: 'headerFecha', border: [true, true, true, false] }],
              //      [{ text: '05/12/2021', style: 'headerFecha', border: [true, false, true, true] }]
              //    ]
              //  },
              //}
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
            widths: [55, 318, 35, 100],
            heights: [12, 12, 12],
            body: [
              [{ text: 'Cliente:', style: 'bodyLabel' }, { text: data[0].NOMBRE_CLIENTE, colSpan: 3, style: 'body' }, {}, {}],
              [{ text: data[0].DOCUMENTO, style: 'bodyLabel' }, { text: data[0].CLIE_NRODOCUMENTO, style: 'body' }, { text: 'Fecha:', style: 'bodyLabel' }, { text: data[0].Fecha, style: 'body' }],
              [{ text: 'Dirección:', style: 'bodyLabel' }, { text: data[0].CLIE_DIRECCION, colSpan: 3, style: 'body' }, {}, {}],
            ]
          }
        },
        {
          margin: [5, 5, 5, 0],
          table: {
            headerRows: 1,
            widths: [30, 23, '*', 50, 70],
            //heights: [15, 15, 15, 15, 15],
            body: body
          }
        },
        {
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
        },
        {
          margin: [5, 5, 5, 5],
          layout: 'noBorders',
          table: {
            widths: [200, 340],
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
                  margin: [44, 0, 0, 0],
                  layout: 'noBorders',
                  table: {
                    //widths: [297, 160, 60],
                    widths: [209, 60],
                    heights: [15],
                    body: [
                      [
                        {
                          margin: [0, -3, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Gratuitas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -3, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Gratuito.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Inafectas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Inafecto.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Exoneradas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Exonerada.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Gravadas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Neto.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'IGV: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Impuestos.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'ISC: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Isc.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Otros Impuestos: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].OtrosImp.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Total.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
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
        }
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
    pdfMake.createPdf(documentDefinition).download(data[0].NRO_DOCUMENTO + '_' + fechaActual);
    //pdfMake.createPdf(documentDefinition).open();
  }

  async pdfFactura(data, detraccion) {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let fechaActual = anio + '' + (mes < 10 ? '0' : '') + mes + '' + (dia < 10 ? '0' : '') + dia;
    let body = [[
      { text: 'CANT.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'U.M.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'DESCRIPCIÓN', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'P. UNITARIO', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'IMPORTE', style: 'headerTableDet', border: [true, true, true, false] }
    ]];
    for (let det of data) {
      body.push([
        { text: det.CANTIDAD, style: 'bodyTableDetCantidad2', border: [true, false, true, false] },
        { text: det.Cod_unidad, style: 'bodyTableDetCantidad2', border: [true, false, true, false] },
        { text: det.Glosa, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: this.separatorNumero(det.PRECIO.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] },
        { text: this.separatorNumero(det.IMPORTE.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] }
      ])
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
                    [{ text: data[0].NRO_DOCUMENTO, style: 'header1', border: [true, false, true, true] }]
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
              {}
              //{
              //  margin: [10, 2, 0, 2],
              //  table: {
              //    widths: [140],
              //    body: [
              //      [{ text: 'FECHA DE VENCIMIENTO', style: 'headerFecha', border: [true, true, true, false] }],
              //      [{ text: '05/12/2021', style: 'headerFecha', border: [true, false, true, true] }]
              //    ]
              //  },
              //}
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
            widths: [45, 17, 190, 50, 62, 58, 60],
            heights: [12, 12, 12, 12],
            body: [
              [{ text: 'Cliente:', style: 'bodyLabel' }, { text: data[0].NOMBRE_CLIENTE, colSpan: 4, style: 'body' }, {}, {}, {}, { text: 'Forma Pago:', style: 'bodyLabel' }, { text: data[0].FORMA_PAGO, style: 'body' }],
              [{ text: data[0].DOCUMENTO, style: 'bodyLabel' }, { text: data[0].CLIE_NRODOCUMENTO, style: 'body', colSpan: 2 }, {}, { text: 'F. Emisión:', style: 'bodyLabel' }, { text: data[0].Fecha, style: 'body' }, { text: 'Fecha Vcto:', style: 'bodyLabel' }, { text: data[0].F_vcto, style: 'body' }],
              [{ text: 'Dirección:', style: 'bodyLabel' }, { text: data[0].CLIE_DIRECCION, colSpan: 6, style: 'body' }, {}, {}, {}, {}, {}],
              [{ text: 'Observaciones:', style: 'bodyLabel', colSpan: 2 }, {}, { text: data[0].OBSERVCACIONES, colSpan: 5, style: 'body' }, {}, {}, {}, {}],
            ]
          }
        },
        {
          margin: [5, 5, 5, 0],
          table: {
            headerRows: 1,
            widths: [30, 23, '*', 50, 70],
            //heights: [15, 15, 15, 15, 15],
            body: body
          }
        },
        {
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
        },
        {
          margin: [5, 5, 5, 5],
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
                          margin: [0, -3, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Gratuitas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -3, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Gratuito.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Inafectas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Inafecto.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Exoneradas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Exonerada.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Gravadas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Neto.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'IGV: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Impuestos.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'ISC: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Isc.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Otros Impuestos: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].OtrosImp.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Total.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
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
        {
          //margin: [5, 5, 5, 5],
          style: detraccion == 0 ? "creditoHide" : "creditoShow", // Para mostrar, ocultar Credito/Detalle Cuotas
          layout: 'noBorders',
          table: {
            widths: [200, 340],
            //heights: [15],
            body: [
              [
                {
                  margin: [0, 0, 0, 0],
                  //layout: 'noBorders',
                  table: {
                    widths: [32, 45, 32, 55],
                    //heights: [12, 12, 12],
                    body: [
                      [{ text: 'AL CRÉDITO - DETALLE CUOTAS', style: 'creditoCabecera', colSpan: 4, margin: [1, 0, 0, 1], border: [false, false, false, true] }, {}, {}, {}],
                      [{ text: 'Nro. Cuotas', style: 'creditoCabecera', alignment: 'center' }, { text: 'Fecha Vencimiento', style: 'creditoCabecera', alignment: 'center' }, { text: 'Tipo Moneda', style: 'creditoCabecera', alignment: 'center' }, { text: 'Monto a Pagar', style: 'creditoCabecera', alignment: 'center', margin: [0, 5, 0, 0] }],
                      [{ text: data[0].NroCuotas, style: 'creditoBody', alignment: 'center' }, { text: data[0].F_vcto, style: 'creditoBody', alignment: 'center' }, { text: data[0].MonDescripcion, style: 'creditoBody', alignment: 'center' }, { text: this.separatorNumero(data[0].IMPORTE_CUOTA.toFixed(2)), style: 'creditoBody', alignment: 'center' }],
                    ]
                  }
                },
                {
                }
              ]
            ]
          }
        }
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
        creditoCabecera: {
          fontSize: 8,
          bold: true,
          color: '#012042',
          //alignment: 'center'
        },
        creditoBody: {
          fontSize: 8,
          //bold: true,
          //color: '#012042',
          //alignment: 'center',
          margin: [0, 2, 0, 2]
        },
        creditoHide: {
          margin: [-300, 0, 0, 0]
        },
        creditoShow: {
          margin: [5, 5, 5, 5],
        },
      }
    };
    pdfMake.createPdf(documentDefinition).download(data[0].NRO_DOCUMENTO + '_' + fechaActual);
    //pdfMake.createPdf(documentDefinition).open();
  }

  async pdfCreditoDebito(data, nota) {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let fechaActual = anio + '' + (mes < 10 ? '0' : '') + mes + '' + (dia < 10 ? '0' : '') + dia;
    let body = [[
      { text: 'CANT.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'U.M.', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'DESCRIPCIÓN', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'P. UNITARIO', style: 'headerTableDet', border: [true, true, true, false] },
      { text: 'IMPORTE', style: 'headerTableDet', border: [true, true, true, false] }
    ]];
    for (let det of data) {
      body.push([
        { text: det.CANTIDAD, style: 'bodyTableDetCantidad2', border: [true, false, true, false] },
        { text: det.Cod_unidad, style: 'bodyTableDetCantidad2', border: [true, false, true, false] },
        { text: det.Glosa, style: 'bodyTableDet', border: [true, false, true, false] },
        { text: this.separatorNumero(det.PRECIO.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] },
        { text: this.separatorNumero(det.IMPORTE.toFixed(2)), style: 'bodyTableDetCantidad', border: [true, false, true, false] }
      ])
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
                    [{ text: data[0].NRO_DOCUMENTO, style: 'header1', border: [true, false, true, true] }]
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
              {}
              //{
              //  margin: [10, 2, 0, 2],
              //  table: {
              //    widths: [140],
              //    body: [
              //      [{ text: 'FECHA DE VENCIMIENTO', style: 'headerFecha', border: [true, true, true, false] }],
              //      [{ text: '05/12/2021', style: 'headerFecha', border: [true, false, true, true] }]
              //    ]
              //  },
              //}
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
            widths: [395, 130],
            //heights: [15],
            body: [
              [
                {
                  margin: [0, 0, 0, 0],
                  layout: 'noBorders',
                  table: {
                    widths: [45, 330],
                    heights: [12, 12, 12],
                    body: [
                      [{ text: 'Cliente:', style: 'bodyLabel' }, { text: data[0].NOMBRE_CLIENTE, style: 'body' }],
                      [{ text: data[0].DOCUMENTO, style: 'bodyLabel' }, { text: data[0].CLIE_NRODOCUMENTO, style: 'body' }],
                      [{ text: 'Fecha:', style: 'bodyLabel' }, { text: data[0].Fecha, style: 'body' }],
                      [{ text: 'Dirección:', style: 'bodyLabel' }, { text: data[0].CLIE_DIRECCION, style: 'body' }],
                    ]
                  }
                },
                {
                  margin: [0, 0, 0, 0],
                  layout: 'noBorders',
                  table: {
                    //widths: [297, 160, 60],
                    widths: [120],
                    heights: [15],
                    body: [
                      [{ text: 'Referencia ' + data[0].TIPO_NOTA_CREDITO + ' que Modifica:  \nN° : ' + data[0].Nro_NCredito, style: 'bodyLabel' }],
                      [{ text: 'Fecha Emisión Documento que Modifica: ' + data[0].F_Compra, style: 'bodyLabel' }],
                    ]
                  }
                }
              ]
            ]
          }
        },
        //{
        //  margin: [5, 0, 5, 5],
        //  layout: 'noBorders',
        //  table: {
        //    widths: [55, 300, 35, 118],
        //    heights: [12, 12, 12],
        //    body: [
        //      [{ text: 'Cliente:', style: 'bodyLabel' }, { text: data[0].nombre_cliente, colSpan: 3, style: 'body' }, {}, {}],
        //      [{ text: data[0].documento, style: 'bodyLabel' }, { text: data[0].clie_nro_documento, style: 'body' }, {}, {}],
        //      [{ text: 'Fecha:', style: 'bodyLabel' }, { text: data[0].clie_direccion, colSpan: 3, style: 'body' }, {}, {}],
        //      [{ text: 'Dirección:', style: 'bodyLabel' }, { text: data[0].clie_direccion, colSpan: 3, style: 'body' }, {}, {}],
        //    ]
        //  }
        //},
        {
          margin: [5, 5, 5, 0],
          table: {
            headerRows: 1,
            widths: [30, 23, '*', 50, 70],
            //heights: [15, 15, 15, 15, 15],
            body: body
          }
        },
        {
          margin: [5, 0, 5, 5],
          //layout: 'noBorders',
          table: {
            widths: [535],
            //widths: [304, 160, 60],
            //heights: [15],
            body: [
              [
                { text: 'MOTIVO DE LA EMISIÓN DE LA NOTA DE ' + nota + ': ' + data[0].DESP_NOTA_CREDITO, style: 'bodyLabel', alignment: 'left', border: [true, true, true, true], margin: [0, 3, 0, 3] }
              ],
              [
                { text: 'SON: ' + data[0].NUMERO_LETRAS, style: 'body', alignment: 'left', border: [true, true, true, true], margin: [0, 3, 0, 3] }
              ]
            ]
          }
        },
        {
          margin: [5, 5, 5, 5],
          layout: 'noBorders',
          table: {
            widths: [200, 340],
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
                  margin: [44, 0, 0, 0],
                  layout: 'noBorders',
                  table: {
                    //widths: [297, 160, 60],
                    widths: [209, 60],
                    heights: [15],
                    body: [
                      [
                        {
                          margin: [0, -3, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Gratuitas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -3, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Gratuito.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Inafectas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Inafecto.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Exoneradas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Exonerada.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total Valor de Venta Operaciones Gravadas: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Neto.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'IGV: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Impuestos.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'ISC: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Isc.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Otros Impuestos: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].OtrosImp.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        //[], [{ text: 'Total Pendiente: S/ ', style: 'body', alignment: 'right' }], [{ text: '99.00', style: 'bodyCantidad' }],
                      ],
                      [
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [204],
                            //heights: [13],
                            body: [
                              [{ text: 'Total: ' + data[0].SIMBOLO_MONEDA, style: 'body2', alignment: 'right', margin: [0, 3, 0, 3] }],
                            ]
                          },
                        },
                        {
                          margin: [0, -5, 0, 0],
                          table: {
                            widths: [66],
                            //heights: [13],
                            body: [
                              [{ text: this.separatorNumero(data[0].Total.toFixed(2)), style: 'bodyCantidad2', margin: [0, 3, 0, 3] }],
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
        }
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
    pdfMake.createPdf(documentDefinition).download(data[0].NRO_DOCUMENTO + '_' + fechaActual);
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
