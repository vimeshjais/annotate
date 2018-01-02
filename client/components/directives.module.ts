import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap';

import { AuthModule } from './auth/auth.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RightSideBarComponent } from './rightsidebar/rightsidebar.component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CollapseModule,
    AuthModule,
    RouterModule,
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    RightSideBarComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    RightSideBarComponent
  ]
})
export class DirectivesModule { }
