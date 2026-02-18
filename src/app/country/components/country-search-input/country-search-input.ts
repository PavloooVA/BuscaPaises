import { Component, effect, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'app-country-search-input',
  imports: [],
  templateUrl: './country-search-input.html',
})
export class CountrySearchInput {
  placeholder = input.required<string>()
  initialValue = input<string>()

  value = output<string>()
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '')

  debounceEffect = effect((onCleanUp) => {
    const value = this.inputValue()

    const timeout = setTimeout(() => {
      this.value.emit(value)
    }, 500)

    onCleanUp(() => {
      clearTimeout(timeout)
    })
  })

  /* sendValue(value: string){
    this.value.emit(value)
  } */
}
