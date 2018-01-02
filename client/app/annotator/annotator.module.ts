import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap';
import { DirectivesModule } from '../../components/directives.module';

import { AnnotatorComponent } from './annotator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule,
    RouterModule,
    DirectivesModule
  ],
  declarations: [
    AnnotatorComponent
  ],
  exports: [
    AnnotatorComponent,
    DirectivesModule
  ],
   entryComponents: [
      AnnotatorComponent
   ]
})
export class AnnotatorModule { }
