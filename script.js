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

class workout {
  id = (Date.now() + '').slice(-10);
  date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Running extends workout {
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.calcPace();
    this.type = 'running';
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends workout {
  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this.type = 'cycling';
  }

  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts;
  constructor() {
    this.#workouts = [];
    this._getPosition();
    inputType.addEventListener('change', this._toogleElevationField);
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert(`Unable to get your position`);
      }
    );
  }

  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toogleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const positiveChecker = (...inputs) => inputs.every(input => input > 0);
    const finiteChecker = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    // 1) Get The Data From The Form
    let distance = +inputDistance.value;
    let duration = +inputDuration.value;
    let type = inputType.value;
    const { lat, lng } = this.#mapEvent.latlng;

    console.log(type);
    // 2) Check If The Data is valid

    // 3) if the workout is running create running object
    let newWorkout;
    if (type === 'running') {
      let cadence = +inputCadence.value;
      if (
        !finiteChecker(distance, duration, cadence) ||
        !positiveChecker(distance, duration)
      )
        return alert('The Values Must Be Greater than Zero!');

      newWorkout = new Running(distance, duration, [lat, lng], cadence);
    }

    if (type == 'cycling') {
      let elevation = +inputElevation.value;
      if (
        !finiteChecker(distance, duration, elevation) ||
        !positiveChecker(distance, duration)
      ) {
        return alert('The Values Must Be Greater than Zero!');
      }
      // 4) Otherwise if the workout is cycling create cycling object
      newWorkout = new Cycling(distance, duration, [lat, lng], elevation);
    }
    // 5) Add This new created object to the workout array
    this.#workouts.push(newWorkout);
    console.log(newWorkout);
    // 6) Render This Workout in map as a marker

    // 7) Render This Workout in the list
    this.renderMarker(newWorkout);
    // 8) Empty the field input and hide the form
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
  }

  renderMarker(newWorkout) {
    L.marker(newWorkout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${newWorkout.type}-popup`,
        })
      )
      .setPopupContent('Rendering Wotkout!')
      .openPopup();
  }
}

const app = new App();
