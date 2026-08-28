import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-horizontal',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-horizontal.html',
  styleUrl: './navbar-horizontal.css',
})
export class NavbarHorizontal {}
