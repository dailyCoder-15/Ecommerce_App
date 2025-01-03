import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = 'http://localhost:8080/countries';
  private statesUrl = 'http://localhost:8080/states';

  constructor(private httpClient: HttpClient) { }

  getStates(theCountryCode: string): Observable<State[]> {
    //search Url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    //build an array for "Month" dropdown list
    //start at desired startMonth and loop until 12


    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];//data array
    const startYear: number = new Date().getFullYear();
    //build an array for "Year" dropdown list
    //start at current year and loop for next 10

    const endYear: number = startYear + 10;

    for(let theYear= startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}//Form Service ends here

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}
