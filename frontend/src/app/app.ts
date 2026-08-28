import { Component } from '@angular/core';
import { QuienesSomos } from './quienes-somos/quienes-somos';

@Component({
    selector: 'app-root',
    imports: [QuienesSomos],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
}