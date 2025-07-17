import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from '../../interfaces/login/login/login.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginRoutingModule,
    LoginComponent 
  ]
})
export class LoginModule { }
