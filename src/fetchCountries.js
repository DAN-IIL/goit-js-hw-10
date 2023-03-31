export class CountryApiService {
    #BASE_URL = 'https://restcountries.com/v3.1/name/';
  
    fetchCountries(name) {
      return fetch(
        `${this.#BASE_URL}${name}?fields=name,capital,population,flags,languages`
      ).then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      });
    }
  }