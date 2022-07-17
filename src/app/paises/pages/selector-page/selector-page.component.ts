import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Country } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    'region'  : ['', [Validators.required]],
    'pais'    : ['', [Validators.required]],
    'frontera': ['', [Validators.required]],
    // 'frontera': [{ value: '', disabled: true }, [Validators.required]],
  });

  regiones : string[]    = [];
  paises   : PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService,
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // # 1
    // cuando cambia la region
    // this.miFormulario.get('region')?.valueChanges.subscribe(region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion(region).subscribe( paises => {
    //     console.log(paises);
    //     this.paises = paises;
    //   });

    // });

    // # 2 Rjx
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) => {
        // console.log(region);
        this.miFormulario.get('pais')?.reset('');
        // this.miFormulario.get('frontera')?.disable();
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region)),
    )
    .subscribe(paises => {
      //console.log(paises);
      this.paises = paises;
      this.cargando = false;
    });

    // Cuando cambia a pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(() => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        // this.miFormulario.get('frontera')?.enable();
        this.cargando = true;
      }),
      switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
      switchMap( pais => {
        if (pais !== null) {
          if (pais.length > 0) {
            return this.paisesService.getPaisesPorCodigos(pais![0]?.borders);
          }
        }

        return this.paisesService.getPaisesPorCodigos([]);
      })
    )
    .subscribe((paises) => {
      if (paises !== null) {
        if (paises.length > 0) {
          // this.fronteras = pais[0].borders || [];
          this.fronteras = paises;
        }
      }
      this.cargando = false;
    })
  }

  guardar() {
    console.log(this.miFormulario.value);
  }

}
