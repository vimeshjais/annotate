import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap';
import { AnnotatorModule } from '../annotator/annotator.module';
import { MainComponent } from './main.component';


export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


        TooltipModule.forRoot(),
        AnnotatorModule
    ],
    declarations: [
        MainComponent
    ],

    exports: [
        MainComponent,
    ],
})
export class MainModule { }
