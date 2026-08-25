import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shared/nav/nav';
import { FooterPanel } from './shared/footer-panel/footer-panel';
import { Footer } from './shared/footer-public/footer';

@Component({
  imports: [RouterOutlet, Nav, FooterPanel, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
