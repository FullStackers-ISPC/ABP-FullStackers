import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { NavbarHorizontal } from '../navbar-horizontal/navbar-horizontal';

@Component({
  selector: 'app-public-layout',
  imports: [Footer, NavbarHorizontal, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
