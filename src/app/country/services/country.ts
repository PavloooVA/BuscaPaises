import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.interface';

const API_URL = 'https://restcountries.com/v3.1'

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient)
  private queryCacheCapital = new Map<string, Country[]>()
  private queryCacheCountry = new Map<string, Country[]>()
  private queryCacheRegion = new Map<Region, Country[]>()

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase()

    if(this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? [])
    }

    return this.http.get<RESTCountry[]>(`${ API_URL }/capital/${ query }`)
    .pipe(
      map((res) => CountryMapper.mapCountryItemsToCountryArray(res)),
      tap(countries => this.queryCacheCapital.set(query, countries)),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error(`No se encontraron países con la capital '${query}'`))
      })
    )
  }

  searchByName(query: string): Observable<Country[]> {
    query = query.toLowerCase()

    if(this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query)! ?? [])
    }

    return this.http.get<RESTCountry[]>(`${ API_URL }/name/${ query }`)
    .pipe(
      map((res) => CountryMapper.mapCountryItemsToCountryArray(res)),
      tap(countries => this.queryCacheCountry.set(query, countries)),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error(`No se encontraron países con el nombre '${query}'`))
      })
    )
  }

  searchCountryByAlphaCode(code: string) {
    return this.http.get<RESTCountry[]>(`${ API_URL }/alpha/${ code }`)
    .pipe(
      map((res) => CountryMapper.mapCountryItemsToCountryArray(res)),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error(`No se encontró país con el código '${code}'`))
      })
    )
  }

  searchCountriesByRegion(region: Region){

    if(this.queryCacheCountry.has(region)) {
      return of(this.queryCacheCapital.get(region)! ?? [])
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe(
      map((res) => CountryMapper.mapCountryItemsToCountryArray(res)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error(`No se encontraron países en la region '${region}'`))
      })
    )
  }
}
