import './css/styles.css';
import { CountryApiService } from './fetchCountries';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const countryListEl = document.querySelector('.country-list');
const inputEl = countryListEl.previousElementSibling;
const countryCardEl = countryListEl.nextElementSibling;

const countryApiService = new CountryApiService();

const clearHTML = () => {
  countryListEl.innerHTML = '';
  countryCardEl.innerHTML = '';
};

const displayCountryList = countries => {
  const markup = countries
    .map(country => {
      const { name, flags } = country;
      return `<li class="country-item">
        <img class="country-img" src='${flags.svg}' width='30' height='20'>
        <p class="country-text">${name.official}</p>
      </li>`;
    }).join('');

  countryListEl.innerHTML = markup;
};

const displayCountryCard = countries => {
  countryListEl.firstElementChild.lastElementChild.classList.add(
    'country-text-card'
  );
  const markupCard = countries
    .map(country => {
      const { capital, population, languages } = country;
      const countryLanguage = Object.values(languages);
      return `<p><span>Capital:</span> ${capital}</p>
            <p><span>Population:</span> ${population}</p>
            <p><span>Lenguages:</span> ${countryLanguage.join(', ')}</p>`;
    }).join('');

  countryCardEl.innerHTML = markupCard;
};

const handleSearchCountries = (event) => {
  const nameCountry = event.target.value.trim();
  if (nameCountry === '') {
    clearHTML();
    return;
  }

  countryApiService
    .fetchCountries(nameCountry)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.');
        return;
      }
      if (2 <= countries.length <= 10) {
        displayCountryList(countries);
      }
      if (countries.length === 1) {
        displayCountryCard(countries);
      }
    })
    .catch(error => {
      clearHTML();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

inputEl.addEventListener(
  'input',
  debounce(handleSearchCountries, DEBOUNCE_DELAY)
);