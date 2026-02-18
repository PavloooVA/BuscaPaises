import { Component, inject, linkedSignal, resource } from '@angular/core';
import { CountrySearchInput } from "../../components/country-search-input/country-search-input";
import { CountryList } from "../../components/country-list/country-list";
import { CountryService } from '../../services/country';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [CountrySearchInput, CountryList],
  templateUrl: './by-country-page.html',
})
export class ByCountryPage {

  countryService = inject(CountryService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? ''
  query = linkedSignal<string>(() => this.queryParam)

  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      if (!params.query) return [];

      this.router.navigate(['/country/by-country'], {
        queryParams: {
          query: params.query
        }
      })

      return await firstValueFrom(
        this.countryService.searchByName(params.query)
      );
    }
  });
}
