import { Component, inject, linkedSignal } from '@angular/core';
import { CountryList } from "../../components/country-list/country-list";
import { CountrySearchInput } from "../../components/country-search-input/country-search-input";
import { CountryService } from '../../services/country';
import { rxResource } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-by-capital-page',
  imports: [CountryList, CountrySearchInput],
  templateUrl: './by-capital-page.html'
})
export class ByCapitalPage { 

  countryService = inject(CountryService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? ''
  
  query = linkedSignal<string>(() => this.queryParam)
  
  countryResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if (!params.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: {
          query: params.query
        }
      })

      return this.countryService.searchByCapital(params.query)
    }
  });
  
/*   isLoading = signal(false)
  isError = signal<string|null>(null)
  countries = signal<Country[]>([])
  
  onSearch(query: string) {
    if(this.isLoading()) return
  
    this.isLoading.set(true)
  
    this.countryService.searchByCapital(query)
    .subscribe({
      next: (res) => {
        this.isLoading.set(false)
        this.countries.set(res)
        console.log(res);
      },
      error: (err) => {
        this.isLoading.set(false)
        this.countries.set([])
        this.isError.set(err)
      },
    })
  } */

}
