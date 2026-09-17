import { Component, OnInit } from '@angular/core';
import { Integrante } from '../core/models/integrante.model';
import { IntegrantesService } from '../core/services/integrantes.service';

@Component({
  selector: 'app-quienes-somos',
  imports: [],
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.css',
})
export class QuienesSomos implements OnInit {

  integrantes: Integrante[] = [];

  constructor(private integrantesService: IntegrantesService) {}

  ngOnInit(): void {
    this.integrantesService.getIntegrantes().subscribe({
      next: (datos) => {
        this.integrantes = datos;
      },
      error: (error) => {
        console.error('Error al cargar los integrantes:', error);
      }
    });
  }
}