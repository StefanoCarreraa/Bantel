import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SignInPresenter } from './sign-in.presenter';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.view.html',
  styleUrls: ['./sign-in.view.scss'],
  providers: [ SignInPresenter,MessageService ],

})
export class SignInView implements OnInit {

  constructor(public presenter: SignInPresenter) { }

  ngOnInit(): void {
  }

}
