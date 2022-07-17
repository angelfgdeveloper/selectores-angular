import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';

import { Country, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1';
  //https://restcountries.com/v3.1/alpha?codes=col,pe,at

  private _regiones: string[] = [
    'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'
  ];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<Country[] | null> {

    if (!codigo) {
      return of(null);
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Country[]>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    //https://restcountries.com/v3.1/alpha/COL?fields=cca3,name
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });


    return combineLatest(peticiones);
  }
}
