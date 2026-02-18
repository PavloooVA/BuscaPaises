import { Component, inject, linkedSignal } from '@angular/core';
import { CountryList } from "../../components/country-list/country-list";
import { CountryService } from '../../services/country';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { Region } from '../../interfaces/region.interface';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(queryParam: string): Region {

  queryParam = queryParam.toLowerCase()

  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic',
  }

  return validRegions[queryParam] ?? 'Africa'
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryList],
  templateUrl: './by-region-page.html',
})
export class ByRegionPage {

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  countryService = inject(CountryService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? ''
  selectedRegion = linkedSignal<Region>(() => validateQueryParam(this.queryParam))

  selectRegion(region: Region) {
    this.selectedRegion.set(region)
  }

  regionResource = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if(!params.region) return of([])

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: params.region
        }
      })

      return this.countryService.searchCountriesByRegion(params.region)
    }
  })
}
