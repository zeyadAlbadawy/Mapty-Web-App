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
    this._renderListFromLocalStorage();
    this._getPosition();
    containerWorkouts.addEventListener(
      'click',
      this._movePositionToMarker.bind(this)
    );
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

    this.#workouts.forEach(dt => this._renderMarker(dt));
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
        inputCadence.value =
          inputDistance.value =
          inputDuration.value =
          inputElevation.value =
            '';
        return alert('The Values Must Be Greater than Zero!');
      }
      // 4) Otherwise if the workout is cycling create cycling object
      newWorkout = new Cycling(distance, duration, [lat, lng], elevation);
    }
    // 5) Add This new created object to the workout array
    this.#workouts.push(newWorkout);
    // 6) Render This Workout in map as a marker
    this._renderListWorkout(newWorkout);
    // 7) Render This Workout in the list
    this._renderMarker(newWorkout);
    // 8) Empty the field input and hide the form
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    this._hideForm(newWorkout);
    this._storeInLocalStorage();
  }

  _renderMarker(newWorkout) {
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
      .setPopupContent(
        `${newWorkout.type == 'running' ? '🏃‍♂️ Running on ' : '🚴‍♀️ Cycling on'} ${
          newWorkout.date
        } `
      )
      .openPopup();
  }

  _renderListWorkout(newWorkout) {
    form.insertAdjacentHTML(
      'afterend',
      `<li class="workout workout--${newWorkout.type}" data-id="${
        newWorkout.id
      }">
          <h2 class="workout__title">${
            newWorkout.type == 'running' ? 'Running' : 'Cycling'
          } on ${newWorkout.date}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              newWorkout.type == 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${newWorkout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${newWorkout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              newWorkout.type == 'running'
                ? newWorkout.pace.toFixed(1)
                : newWorkout.speed.toFixed(1)
            }</span>
            <span class="workout__unit"> ${
              newWorkout.type == 'running' ? 'min/km' : 'km/h'
            }</span>
          </div>
          <div class="workout__details">
         
            <span class="workout__icon">${
              newWorkout.type == 'running' ? '🦶🏼' : '⛰'
            }</span>
            <span class="workout__value">${
              newWorkout.type == 'running'
                ? newWorkout.cadence
                : newWorkout.elevationGain
            }</span>
            <span class="workout__unit">${
              newWorkout.type == 'running' ? 'spm' : 'm'
            }</span>
          </div>
        </li>`
    );
  }

  _hideForm(newWorkout) {
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _movePositionToMarker(e) {
    const workoutElmnt = e.target.closest('.workout');
    if (!workoutElmnt) return;
    const targettedid = workoutElmnt.dataset.id;
    const targettedworkout = this.#workouts.find(
      work => work.id == targettedid
    );

    this.#map.setView(targettedworkout.coords, 13, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _storeInLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _renderListFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workouts = data;
    data.forEach(dt => this._renderListWorkout(dt));
  }
}

const app = new App();
