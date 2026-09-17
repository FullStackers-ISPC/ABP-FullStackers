import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Integrante } from '../models/integrante.model';

@Injectable({
    providedIn: 'root'
})
export class IntegrantesService {

    private apiUrl = 'http://localhost:3000/integrantes';

    constructor(private http: HttpClient) {}

    getIntegrantes(): Observable<Integrante[]> {
        return this.http.get<Integrante[]>(this.apiUrl);
    }
}