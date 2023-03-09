import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { AdminPresenter } from './../../../admin.presenter';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ AdminPresenter ]
})
export class MenuComponent implements OnInit {
  display: boolean = false;
  items: MenuItem[];

  constructor(public presenter: AdminPresenter) { }

  ngOnInit() {
    this.items = [
        {
            label:'Home',
            icon:'',
            routerLink: 'home'
        },
        /*{
            label:'Recibo de Servicios',
            icon:'pi pi-fw pi-file',
            routerLink: 'documents'
        },*/
        {
          label: 'Recibo de Servicios',
          icon: 'pi pi-fw pi-file',
          routerLink: 'documents'
        },
        {
          label: 'Comprobantes',
          icon: 'pi pi-fw pi-file',
          routerLink: 'comprobantes'
        },
        {
            label:'Medir Velocidad',
            icon:'pi pi-fw pi-file',
            routerLink: 'medirvelocidad'
        },
        {
            label:'Servicios PostVenta',
            icon:'pi pi-fw pi-file',
            routerLink: 'postventa'
        },
        {
          label: 'Libro de Reclamaciones',
          icon: 'pi pi-fw pi-book',
          routerLink: 'reclamaciones'
        },
        {
          label: 'Mi perfil',
          icon: 'pi pi-fw pi-user',
          routerLink: 'mypage'
        },
        {
            label:'Cerrar sesión',
            icon:'pi pi-fw pi-power-off',
            command: (e) => {
                this.presenter.closeSession()
            }
        }
    ];
    }

}
