import { Component } from '@angular/core';
import { NavbarHorizontal } from './navbar-horizontal/navbar-horizontal';
import { QuienesSomos } from './quienes-somos/quienes-somos';

@Component({
    selector: 'app-root',
    imports: [NavbarHorizontal, QuienesSomos],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
}
