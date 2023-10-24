const API_KEY = '60aecc6e15c24a90a0a20239232310'
const API_BASE = 'http://api.weatherapi.com/v1'

let CURRENT_CITY = ""
let CURRENT_PARENT_CITY = ""

let MAX_TEMPERATURE = 0
let MIN_TEMPERATURE = 0

let CURRENT_TEMPERATURE = 0

const containerTemperature = document.querySelector('.city h2')
const containerCity = document.querySelector('.city p')

const hour = new Date().getHours()
console.log("Son las",hour)

  async function test(lat,lon){
    let curr_hour = hour
    let call = `
https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,rain&
hourly=temperature_2m,precipitation_probability,rain,windspeed_10m,winddirection_10m,cloudcover,snowfall&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`
    
    const response = await fetch(call);
    const weather = await response.json();

    CURRENT_TEMPERATURE = weather.current.temperature_2m
    MAX_TEMPERATURE = weather.daily.temperature_2m_max[0]
    MIN_TEMPERATURE = weather.daily.temperature_2m_min[0]

    console.log(weather);


    CreateCurrent()
    let h = hour
    for (let i = 0; i <= 23; i++){
        let temp = weather.hourly.temperature_2m[hour+i]
        let rain = weather.hourly.rain[hour+i]
        let rainprobability = weather.hourly.precipitation_probability[hour+i]
        let dirviento = weather.hourly.winddirection_10m[hour+i]
        let velviento = weather.hourly.windspeed_10m[hour+i]
        let nubes = weather.hourly.cloudcover[hour+i]

        h++;
        if (h == 24){h = 0}
        
        CreateHours(h, temp ,rain, rainprobability, dirviento, velviento, nubes)


        addtable(
            i,weather.hourly.temperature_2m[i], weather.hourly.winddirection_10m[i],
            weather.hourly.windspeed_10m[i], weather.hourly.rain[i],weather.hourly.snowfall[i],
            weather.hourly.cloudcover[i], weather.hourly.precipitation_probability[i]
            )
    }




    
  }

  async function getCoords(city){
    let call = "https://geocoding-api.open-meteo.com/v1/search?name="+city+"&count=10&language=es&format=json"
    const response = await fetch(call);
    const coords = await response.json();

    let latitude = coords.results[0].latitude
    let longitude = coords.results[0].longitude
    
    CURRENT_CITY = coords.results[0].name
    CURRENT_PARENT_CITY = coords.results[0].admin1

    console.log(coords.results)

    test(latitude,longitude)


  }

  function CreateCurrent(){
    let icon = document.querySelector('.temperature img')
    containerTemperature.innerHTML = `${CURRENT_TEMPERATURE}<span>º</span>`
    containerCity.innerHTML = `${CURRENT_CITY},${CURRENT_PARENT_CITY}`
    icon.src = 'images/sun.svg'
  }

  function CreateHours(hora,temperatura,lluviamm,porcentajelluvia,dirviento,velocidadviento,nubes){
    let parentdiv = document.querySelector('.timebyhours')
    let hora_c = hora

    if (hora < 10){hora_c = `0${hora_c}`}

    let calc = MAX_TEMPERATURE - MIN_TEMPERATURE
    let calcdos = MAX_TEMPERATURE - temperatura
    let ultcalc = calcdos * 15
    let icon = "sun"
    if (nubes >= 0 && nubes < 40){icon = "sun"}
    if (nubes >= 40 && nubes <= 100){icon = "cloud"}
    if (hora_c >= 22 || hora_c <= 6){
        if (nubes >= 0 && nubes < 40){icon = "night"}
        if (nubes >= 40 && nubes <= 100){icon = "night-cloud"}
    }else{
        if (nubes >= 0 && nubes < 40){icon = "sun"}
        if (nubes >= 40 && nubes <= 100){icon = "cloud"}
    }



    let constructor = `
    <div class="hourbyhour">
            <p>${hora_c}:00</p>
            <div class="hourbyhour-temperature">
                <div class="temperatureimg" style="margin-top:${ultcalc}px">
                    <img src="images/${icon}.svg">
                    <span>${temperatura}º</span>
                </div>
               
            </div>
            <div class="hourbyhour-stats">
            <p>${lluviamm}mm</p>
            <p>${porcentajelluvia}%</p>
            <i class="fa fa-arrow-down" style="transform: rotate(${dirviento}deg)"></i>
            <p>${velocidadviento}km/h</p>
            </div>
        </div>
        `
    parentdiv.innerHTML += constructor
  }

  getCoords("Alzira")

  function clonediv(){
    let num = 10
    let parentdiv = document.querySelector('.timebyhours')
    let coddiv = parentdiv.innerHTML
    for (let i = 0; i < num; i++){
        parentdiv.innerHTML += coddiv
    }
  }



  function addtable(hora,tempeteratura, dirviento, velviento, lluviamm,nieve, nubes, probtormenta){
    let addh = ""
    if (hora >0 && hora < 10){let addh = "0"}
    console.log(velviento)

    let content = `
    <div class="ttd-row">
        <p>${addh}${hora}:00</p>
        <p>${tempeteratura}º</p>
        <p><i class="fa fa-arrow-down" style="transform: rotate(${dirviento}deg)"></i></p>
        <p>${velviento} km/h</p>
        <p>${lluviamm} mm</p>
        <p>${nieve} cm</p>
        <p>${nubes} %</p>
        <p>${probtormenta} %</p>
        <p class="moreinfobutton"><i data-row="${hora}" onclick="displaymoreinfo(this)" class="fa fa-caret-down"></i></p>
    </div>

    <div class="info-row" style="display: none">
                <div class="more-data">
                    <h2>Sensación termica</h2>
                    <i class="fa fa-temperature-2"></i>20º
                </div>
                <div class="more-data">
                    <h2>Sensación termica</h2>
                    <i class="fa fa-temperature-2"></i>20º
                </div>
                <div class="more-data">
                    <h2>Sensación termica</h2>
                    <i class="fa fa-temperature-2"></i>20º
                </div>
                <div class="more-data">
                    <h2>Sensación termica</h2>
                    <i class="fa fa-temperature-2"></i>20º
                </div>
                <div class="more-data">
                    <h2>Sensación termica</h2>
                    <i class="fa fa-temperature-2"></i>20º
                </div>
                <div class="more-data">
                    <h2>Sensación termica</h2>
                    <i class="fa fa-temperature-2"></i>20º
                </div>
            </div>
    ` 

    let timethisday = document.querySelector('.timethisday')
    timethisday.innerHTML += content
  }

function displaymoreinfo(event){
    console.log(event)
    let row = event.dataset.row
    console.log(row)
    let rowdiv = document.querySelectorAll('.info-row')[row]
    console.log(rowdiv)
    let currentMode = rowdiv.style.display
    console.log(currentMode)
    if (currentMode == "none"){
        event.classList.replace("fa-caret-down", "fa-caret-up")
        rowdiv.style = "display: flex"
    }else{
        event.classList.replace("fa-caret-up", "fa-caret-down")
        rowdiv.style = "display: none"
    }
}