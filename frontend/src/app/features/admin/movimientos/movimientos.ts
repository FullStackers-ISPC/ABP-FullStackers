import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { Movimiento } from '../../../core/models/movimiento.model';


@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css'
})
export class MovimientosComponent implements OnInit {
  private movimientosService = inject(MovimientosService);
  private cdr = inject(ChangeDetectorRef);
  
  movimientos: Movimiento[] = [];

  ngOnInit(): void {
    this.movimientosService.getProductos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar movimientos:', err);
      }
    });
  }
}