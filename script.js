'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const btn = document.querySelector('.form__btn');
let mapEvent, map;

navigator.geolocation.getCurrentPosition(
  function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];
    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    ////////////////////////

    map.on('click', function (e) {
      mapEvent = e;
      form.classList.remove('hidden');
      inputDistance.focus();

      ///////////////////////////////////////////// Handle the clicking
    });
  },
  function () {
    alert(`Unable to get your position`);
  }
);

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const selectElement = document.getElementById('activityType').value;

  // const type = inputType.value;

  // Creating the date of the event
  const today = new Date();
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Adding this new Event to the side list
  form.insertAdjacentHTML(
    'afterend',
    `${selectElement}<li class="workout workout--${selectElement}" data-id="1234567890">
      <h2 class="workout__title">${
        selectElement == 'running' ? 'Running' : 'Cycling'
      } on ${formattedDate}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          selectElement == 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value">${inputDistance.value}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${inputDuration.value}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">4.6</span>
        <span class="workout__unit"> ${
          selectElement == 'running' ? 'min/km' : 'km/h'
        }</span>
      </div>
      <div class="workout__details">
     
        <span class="workout__icon">${
          selectElement == 'running' ? '🦶🏼' : '⛰'
        }</span>
        <span class="workout__value">${inputCadence.value}</span>
        <span class="workout__unit">${
          selectElement == 'running' ? 'spm' : 'm'
        }</span>
      </div>
    </li>`
  );

  // Display the marker
  inputDistance.value = '';
  inputDuration.value = '';
  inputCadence.value = '';
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${selectElement}-popup`,
      })
    )
    .setPopupContent('Rendering Wotkout!')
    .openPopup();
});

inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
