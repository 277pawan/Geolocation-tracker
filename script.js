'use strict'



const forms = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const resetbutton=document.querySelector(".reset");

// let map;
// let mapEvent;


class Workout{

    date=new Date();
    id = (Date.now() + '').slice(-10);
    // id=
    constructor(coord,distance,duration){
        this.coord=coord;
        this.distance=distance;
        this.duration=duration;
    }

    _setdescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
          months[this.date.getMonth()]
        } ${this.date.getDate()}`;
      }
    }
class running extends Workout{
    type='running';
    constructor(coord,distance,duration,cadence){
        super(coord,distance,duration);
        this.cadence=cadence;
        this.calcpace();
        this._setdescription();

    }
    calcpace(){
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}
class cycling extends Workout{
    type='cycling';
    constructor(coord,distance,duration,elevationgain){
        super(coord,distance,duration);
        this.elevationgain=elevationgain;
        this.calcspeed();
        this._setdescription();
    }
    calcspeed(){
     this.speed=this.distance/(this.duration/60);
     return this.speed;
    //  console.log(this.speed);
    }
}

// const run1=new running([39,23],5.2,24,12);
// console.log(run1);


class App
{
    #map;
    #mapEvent;
    #workouts = [];
    constructor(){
        this._getposition();
        this._getLocalStorage();
        forms.addEventListener('submit',this._newworkout.bind(this));
    
        inputType.addEventListener('change',this._toogleElevationField.bind(this));
    }

    _getposition() {
        
if(navigator.geolocation)
{
    navigator.geolocation.getCurrentPosition(this._loadmap.bind(this),  
    function(){
            alert('Sorry!, could not get your current position.');
        });
}    
}


_loadmap(position) {
        
            const latitude=position.coords.latitude;
            const longitude=position.coords.longitude;
            console.log('https://www.google.co.in/maps/@${latitude},${longitude},10z');
            const coord=[latitude,longitude];
            this.#map = L.map('map').setView(coord, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(this.#map);

this.#map.on('click',this._showform.bind(this));
// forms.classList.add('hidden');

//     console.log(mapEvent);
// const {lat,lng}=mapEvent.latlng;

// L.marker([lat,lng]).addTo(map)
//     .bindPopup(L.popup({
//      maxWidth:250,
//      minwidth:100,
//      autoClose:false,
//      closeOnClick:false,
//      className:'running-popup',   
//     })
//     )
//    
this.#workouts.forEach(work => {
    this._renderWorkoutMarker(work);
  });
}

    _showform(mapE) {  
        this.#mapEvent=mapE;
        forms.classList.remove("hidden");
        inputDistance.focus();
        }
    
    _toogleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

_newworkout(e) {
    e.preventDefault();
//  for clearing all the values from the form
const validInputs=(...inputs)=>inputs.every(inp=>Number.isFinite(inp));

const type=inputType.value;
const distance=+inputDistance.value;
const duration=+inputDuration.value;
const { lat, lng } = this.#mapEvent.latlng;
let workout;
function allPositive(num)
{
    if(num>=0)
    {
        return num;
    }
}
if(type==='running')
{
    const cadence=+inputCadence.value;
  if(!Number.isFinite(distance)||!Number.isFinite(duration)||!Number.isFinite(cadence))
  return alert("Inputs have to be positive numbers");

  if(!allPositive(distance)||!allPositive(duration)||!allPositive(cadence))
  return alert("Input only positive number.");
  workout=new running([lat,lng],distance,duration,cadence);

}

if(type==='cycling')
{
    
    const elevation=+inputElevation.value;
    if(!Number.isFinite(distance)||!Number.isFinite(duration)||!Number.isFinite(elevation))
        return alert("Inputs have to be positive numbers");

    if(!allPositive(distance)||!allPositive(duration))
        return alert("Input only positive number.");
        workout=new cycling([lat,lng],distance,duration,elevation);

    }

    this.#workouts.push(workout);
    
    // console.log(workout);

    this._renderWorkoutMarker(workout);


    this._renderworkout(workout);


    this._setLocalStorage();


inputDistance.value=inputDuration.value=inputCadence.value=
inputElevation .value=" ";
// console.log(mapEvent);
    }
    _renderWorkoutMarker(workout) {
        L.marker(workout.coord)
          .addTo(this.#map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: `${workout.type}-popup`,
            })
          )  .setPopupContent(` ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}  ${workout.type}`)
              .openPopup();
      }
      _renderworkout(workout) {
        let html = `
          <li class="workout workout--${workout.type}" data-id="${workout.id}">
        
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
              <span class="workout__icon">${
                workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
              }</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>
        `;
        console.log(workout.type);
        console.log(workout.description);
        
    
        if (workout.type === 'running')
          html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(2)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">spm</span>
            </div>
          </li>
          `;
    
        if (workout.type === 'cycling')
          html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevationgain}</span>
              <span class="workout__unit">m</span>
            </div>
          </li>
          `;
    
        forms.insertAdjacentHTML('afterend', html);
      }

      _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
      }
    
      _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));
    
        if (!data) return;
    
        this.#workouts = data;
    
        this.#workouts.forEach(work => {
          this._renderworkout(work);
        });
      }
     reset() {
        localStorage.removeItem('workouts');
        location.reload();
      }
      
     
}

const app=new App();
// resetbutton.addEventListener('click',reset());



