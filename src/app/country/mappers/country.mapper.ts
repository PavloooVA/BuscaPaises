import type { Country } from "../interfaces/country.interface";
import type { RESTCountry } from "../interfaces/rest-countries.interfaces";


export class CountryMapper {

  static mapRestCountryItemToCountry(item: RESTCountry): Country {

    return {
      cca2: item.cca2,
      flagSvg: item.flags.svg,
      name: item.translations['spa'].common ?? 'No Spanish name',
      capital: item.capital ?? 'No definida',
      population: item.population
    }
  }

  static mapCountryItemsToCountryArray(items: RESTCountry[]): Country[] {
    //return items.map((item) => this.mapRestCountryItemToCountry(item))
    return items.map(this.mapRestCountryItemToCountry)
  }

}