'use strict';
btn.addEventListener('click', e => {
  const selectElement = document.getElementById('activityType').value;

  // const type = inputType.value;
  const distance = inputDistance.value;
  const duration = inputDuration.value;
  const cadence = inputCadence.value;
  e.preventDefault();
  const today = new Date();
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  form.insertAdjacentHTML(
    'afterend',
    `${selectElement}<li class="workout workout--running" data-id="1234567890">
      <h2 class="workout__title">${
        selectElement == 'running' ? 'Running' : 'Cycling'
      } on ${formattedDate}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          selectElement == 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value">${distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">4.6</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
     
        <span class="workout__icon">${
          selectElement == 'running' ? '🦶🏼' : '⛰'
        }</span>
        <span class="workout__value">${cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`
  );
});
