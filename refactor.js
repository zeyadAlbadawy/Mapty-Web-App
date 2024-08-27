e.preventDefault();
const selectElement = document.getElementById('activityType').value;
const today = new Date();
const options = { month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);
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
