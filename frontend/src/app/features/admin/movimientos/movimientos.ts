import { Component, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movimiento, MovimientosService } from '../../../core/services/movimientos.service';


@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css'
})
export class MovimientosComponent implements OnInit {
  private movimientosService = inject(MovimientosService);
  movimientos: Movimiento[] = [];

  ngOnInit(): void {
    this.movimientos = this.movimientosService.getMovimientos();
  }
}