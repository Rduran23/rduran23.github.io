let WeatherData = []
let CurrentWeatherData = []


const API_KEY = '60aecc6e15c24a90a0a20239232310'
const API_BASE = 'http://api.weatherapi.com/v1'

let CURRENT_CITY = ""
let CURRENT_PARENT_CITY = ""

let MAX_TEMPERATURE = 0
let MIN_TEMPERATURE = 0

let CURRENT_TEMPERATURE = 0
let CURRENT_HUMIDITY = 0

let CURRENT_PAGE = 0

const containerTemperature = document.querySelector('.city h2')
const containerCity = document.querySelector('.city p')

let timethisday = document.querySelector('.timethisday')
let parentdiv = document.querySelector('.timebyhours')

let nofind = document.querySelector('.nocity')
let home = document.querySelector('.home')

let prev = document.getElementById("goPreviousDay")
let next = document.getElementById("goNextDay")

const next24hoursDIV = document.querySelector('.timebyhours')

const currentHour = new Date().getHours()

const hour = new Date().getHours()

  async function loadWeatherAPP(lat,lon){
    let curr_hour = hour
    let call = `
https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,rain&
hourly=temperature_2m,precipitation_probability,rain,windspeed_10m,winddirection_10m,cloudcover,snowfall&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`
    
    const response = await fetch(call);
    const weather = await response.json();

    console.log(weather)

    CURRENT_TEMPERATURE = weather.current.temperature_2m
    CURRENT_HUMIDITY = weather.current.relativehumidity_2m
    MAX_TEMPERATURE = weather.daily.temperature_2m_max[0]
    MIN_TEMPERATURE = weather.daily.temperature_2m_min[0]





    displayCurrentWeather()
    let hourlyresults = weather.hourly

    WeatherData = []
    CurrentWeatherData = []

    if (CURRENT_CITY != ""){
        nofind.style = "display: none"
        home.style = "display: flex"
        prev.style = "display: none"
        next.style = "display: block"
    }

    for (let i = 0; i < 168; i++){
        
        WeatherData.push({
            "index":i,
            "time": hourlyresults.time[i],
            "temperature" : hourlyresults.temperature_2m[i],
            "rainquantity": hourlyresults.rain[i],
            "rainpercentage": hourlyresults.precipitation_probability[i],
            "winddirection":hourlyresults.winddirection_10m[i],
            "windspeed":hourlyresults.windspeed_10m[i],
            "clouds":hourlyresults.cloudcover[i],
            "snow":hourlyresults.snowfall[i],
            "stormpercentage": hourlyresults.snowfall[i],
        })
    }
    CurrentWeatherData.push(
        {
            "temperature": weather.current.temperature_2m,
            "rainpercentage": weather.current.precipitation,
            "humidity": weather.current.relativehumidity_2m,
        }
    )


    displayNext24Hours()
    displayToday(0)




    
  }

  async function getCoords(city){
    let call = "https://geocoding-api.open-meteo.com/v1/search?name="+city+"&count=10&language=es&format=json"
    const response = await fetch(call);
    const coords = await response.json();
    let noresults = document.querySelector('.noresults')
    let search = document.querySelector('input[name=search]')
    if (!coords.results){
        search.placeholder = "No se encontraron resultados"
        search.classList.add("error")
        return
    }
    search.placeholder = "Buscar por ciudad o código postal"
    search.classList.remove("error")
    noresults.style = "display:none"
    let latitude = coords.results[0].latitude
    let longitude = coords.results[0].longitude
    
    CURRENT_CITY = coords.results[0].name
    CURRENT_PARENT_CITY = coords.results[0].admin1
    CURRENT_PAGE = 0


    loadWeatherAPP(latitude,longitude)
    if (CURRENT_CITY != ""){
        nofind.style = "display: none"
        home.style = "display: flex"
    }
    //resetTable()

  }


function displaymoreinfo(event){
    let row = event.dataset.row
    let rowdiv = document.querySelectorAll('.info-row')[row]
    let currentMode = rowdiv.style.display
    if (currentMode == "none"){
        event.classList.replace("fa-caret-down", "fa-caret-up")
        rowdiv.style = "display: flex"
    }else{
        event.classList.replace("fa-caret-up", "fa-caret-down")
        rowdiv.style = "display: none"
    }
}




let formulario = document.getElementById("Buscador")
formulario.addEventListener("submit", function (e) {
    let search = document.querySelector('input[name=search]')
    e.preventDefault()
    getCoords(search.value)
    search.value = ""
})

function displayCurrentWeather(){
    let containerHumidity = document.querySelector('.humiditypercentage')
    let icon = document.querySelector('.temperature img')
    containerTemperature.innerHTML = `${CURRENT_TEMPERATURE}<span>º</span>`
    containerCity.innerHTML = `${CURRENT_CITY},${CURRENT_PARENT_CITY}`
    containerHumidity.innerHTML = CURRENT_HUMIDITY
    icon.src = 'images/sun.svg'
    icon.classList.add("sun")

    let minmaxtext = document.querySelector('.minmaxtemperature span')
    minmaxtext.innerHTML = `<b>MAX: ${MAX_TEMPERATURE}º / MIN:</b> ${MIN_TEMPERATURE}º`
}

function displayNext24Hours(){
    let content = ""
    let hprefix = ""
    let weathericon = "sun"
    for (let i = 0; i <= 24; i++){
        let h = currentHour + i
        if (h >= 24){h = h - 24}
        if (h < 10){hprefix = "0"}else{hprefix=""}
        let wline = WeatherData[currentHour+i]
        let design = MAX_TEMPERATURE - wline.temperature

        if (wline.rainpercentage < 20){
            if (h > 6 && h < 20){weathericon = "sun"}else{weathericon = "night"}
        }
        if (wline.rainpercentage >= 20){
            if (h > 6 && h < 20){weathericon = "rain"}else{weathericon = "night-rain"}
        }

        content += `<div class="hourbyhour">
        <p style="font-weight: bold">${hprefix}${h}:00</p>
        <div class="hourbyhour-temperature">
            <div class="temperatureimg" style="margin-top: ${design*16}px;">
                <img src="images/${weathericon}.svg" class="${weathericon}">
                <span>${wline.temperature}º</span>
            </div>
        </div>
        <div class="hourbyhour-stats">
            <p>${wline.rainquantity} mm <i style="color: blue" class="fa-solid fa-droplet"></i></p>
            <p>${wline.rainpercentage} % <i style="color: brown" class="fa-solid fa-cloud-rain"></i></p>
            <i class="fa fa-arrow-down" style="transform: rotate(${wline.winddirection}deg)"></i>
            <p>${wline.windspeed} km/h </p>
        </div>
    </div>`
    }
   
    next24hoursDIV.innerHTML = content

}

function displayToday(page){
    let p = page
    let content = ""
    timethisday.innerHTML = ""

    let headerContent = `
    <div class="ttd-row header-row">
            <div class="ttd-col"><p>HORAS</p></div>
            <div class="ttd-col"><p>PREVISIÓN</p></div>
            <div class="onlydesktop ttd-col"><p>VIENTO</p></div>
            <div class="ttd-col"><p>RACHAS</p></div>
            <div class="ttd-col"><p>LLUVIAS</p></div>
            <div class="ttd-col onlydesktop"><p>NIEVE</p></div>
            <div class="ttd-col onlydesktop"><p>NUBES</p></div>
            <div class="ttd-col onlydesktop"><p>% TORMENTA</p></div>
        </div>
        `
    content += headerContent
    let hprefix = ""
    for (let i = 0; i < 24; i++){
        let wline = WeatherData[i + p * 24]
        if (i < 10){hprefix = "0"}else{hprefix=""}
        content += `
        <div class="ttd-row">
        <div class="ttd-col"><p>${hprefix}${i}:00</p></div>
        <div class="ttd-col"><p>${wline.temperature}º</p></div>
        <div class="ttd-col onlydesktop"><p><i class="fa fa-arrow-down" style="transform: rotate(${wline.winddirection}deg)"></i></p></div>
        <div class="ttd-col"><p>${wline.windspeed} km/h</p></div>
        <div class="ttd-col"><p>${wline.rainquantity} mm</p></div>
        <div class="ttd-col onlydesktop"><p>${wline.snow} cm</p></div>
        <div class="ttd-col onlydesktop"><p>${wline.clouds} %</p></div>
        <div class="ttd-col onlydesktop"><p>${wline.stormpercentage} % <i style="margin-left: 10px; cursor: pointer;" data-row="${i}" onclick="console.log(this)" class="fa fa-caret-down"></i></p></div>
    </div>
        `
    }
    timethisday.innerHTML += content

    let text = document.getElementById("textTimeToday")
    let pageday = new Date();
    pageday.setDate(pageday.getDate() + page)

    let dd = pageday.getDate();
    let mm = pageday.getMonth() + 1;
    let yyyy = pageday.getFullYear();

    text.innerHTML = `${dd}/${mm}/${yyyy}`


}

paginationButton()

function paginationButton(){
   

    prev.addEventListener("click", function (e) {
        CURRENT_PAGE--

        displayToday(CURRENT_PAGE)
        if (CURRENT_PAGE < 1){
            next.style = "display:block;"
            prev.style = "display: none;"
        }
        
       
        
    })

    next.addEventListener("click", function (e) {
        CURRENT_PAGE++;

        displayToday(CURRENT_PAGE)
        if (CURRENT_PAGE >= 6){
            next.style = "display: none;"
        }
        prev.style = "display:block;"
    })
}


const geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
}

function geoLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, geoLocationOptions);
    }
    else{
        alert('problem has ocurred')
    }
}

async function geoLocationSuccess(pos){
    const crd = pos.coords;
    let call = `https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json&apiKey=9731c0cd79ed423eb296dd94c8fbd779`
    const response = await fetch(call);
    const results = await response.json();

    console.log(results)

    CURRENT_CITY = results.results[0].city
    CURRENT_PARENT_CITY = results.results[0].county
    loadWeatherAPP(crd.latitude,crd.longitude)


    console.log("Your current position is:");
    console.log(crd)
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
}

function geoLocationError(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
    getLocationByIp()
}

/*
Si no encuentra la geolocalización mediante navegador usaremos
la IP para intentar obtener la posición del usuario
*/
async function getLocationByIp(){
    let call = "https://api.geoapify.com/v1/ipinfo?apiKey=9731c0cd79ed423eb296dd94c8fbd779"
    const response = await fetch(call);
    const results = await response.json();
    console.log("Resultados ip")
    console.log(results)
    CURRENT_CITY = results.city.name
    CURRENT_PARENT_CITY = results.city.name
    loadWeatherAPP(results.location.latitude, results.location.longitude)
}

geoLocation()
  
