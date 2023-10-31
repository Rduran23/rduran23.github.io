let WeatherData = []
let CurrentWeatherData = []


let CURRENT_CITY = ""
let CURRENT_PARENT_CITY = ""
let CURRENT_LATITUDE = 0
let CURRENT_LONGITUDE = 0

let MAX_TEMPERATURE = 0
let MIN_TEMPERATURE = 0

let CURRENT_TEMPERATURE = 0
let CURRENT_HUMIDITY = 0

let CURRENT_PAGE = 0

const containerTemperature = document.querySelector('.city h2')
const containerCity = document.querySelector('.city p')

const timethisday = document.querySelector('.timethisday')
const parentdiv = document.querySelector('.timebyhours')

let nofind = document.querySelector('.nocity')
let home = document.querySelector('.home')

let buttonfavorite = document.querySelector('.favorite')



const currentHour = new Date().getHours()

const hour = new Date().getHours()

  async function loadWeatherAPP(lat,lon){
    let curr_hour = hour
    let call = `
https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,rain&
hourly=temperature_2m,precipitation_probability,rain,windspeed_10m,winddirection_10m,cloudcover,snowfall,weathercode&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`
    
    const response = await fetch(call);
    const weather = await response.json();


    CURRENT_TEMPERATURE = weather.current.temperature_2m
    CURRENT_HUMIDITY = weather.current.relativehumidity_2m
    MAX_TEMPERATURE = weather.daily.temperature_2m_max[0]
    MIN_TEMPERATURE = weather.daily.temperature_2m_min[0]


    displayCurrentWeather()
    let hourlyresults = weather.hourly

    WeatherData = []
    CurrentWeatherData = []
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
            "weathercode": hourlyresults.weathercode[i],
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
    const prevpage = document.getElementById("goPreviousDay")
    prevpage.style = "display: none"


    if (CURRENT_CITY != localStorage.getItem("favoriteLocation")){
        let buttonfavorite = document.querySelector('.favorite')
        buttonfavorite.innerHTML = `<i class="fa-regular fa-star" title="Marcar como favorito"></i>`
    }
    
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
    let parentlistresults = document.querySelector('.results')
    let listresults = document.querySelector(".cityresults")

   

    if (coords.results.length > 1){
        listresults.innerHTML = ""
        parentlistresults.style = "display: block"

        for (let i = 0; i < coords.results.length; i++){
            let r = coords.results[i]
            let imgsrc = r.country_code.toLowerCase()

            let parent = ""
            if (coords.results[i].admin1){parent = coords.results[i].admin1}
            listresults.innerHTML += `<li onclick="pickCity(this)" class="cityresult" data-name="${r.name}" data-parent="${r.admin1}" data-lat="${r.latitude}" data-lon="${r.longitude}">
            ${r.name}, ${parent} <img width="32" height="16" alt="${r.country}" title="${r.country}" src="images/flags/${imgsrc}.svg">
            </li>`
        }
       
    }else{
        search.placeholder = "Buscar por ciudad o código postal"
        search.classList.remove("error")
        noresults.style = "display:none"
        let latitude = coords.results[0].latitude
        let longitude = coords.results[0].longitude
        
        CURRENT_CITY = coords.results[0].name
        CURRENT_PARENT_CITY = coords.results[0].admin1
        CURRENT_PAGE = 0


        loadWeatherAPP(latitude,longitude)
    }
    
  }

  function pickCity(t){
    let parentlistresults = document.querySelector('.results')
    CURRENT_CITY = t.getAttribute('data-name')
    CURRENT_PARENT_CITY = t.getAttribute('data-parent')
    CURRENT_PAGE = 0
    loadWeatherAPP(t.getAttribute('data-lat'), t.getAttribute('data-lon'))
    parentlistresults.style = "display: none"
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
    let containerHumidity = document.querySelector('.humidity')
    let icon = document.querySelector('.temperature img')
    containerTemperature.innerHTML = `${CURRENT_TEMPERATURE}<span>º</span>`
    containerCity.innerHTML = `${CURRENT_CITY}, ${CURRENT_PARENT_CITY}`
    containerHumidity.innerHTML = `Humedad: <span class="humiditypercentage">${CURRENT_HUMIDITY}</span>%`

    let minmaxtext = document.querySelector('.minmaxtemperature span')
    minmaxtext.innerHTML = `<b>MAX: ${MAX_TEMPERATURE}º / MIN:</b> ${MIN_TEMPERATURE}º`
}

function displayNext24Hours(){
    const next24hoursDIV = document.querySelector('.timebyhours')

    let content = ""
    let hprefix = ""
    let weathericon = "sun"
    let isnight = false
    for (let i = 0; i <= 24; i++){
        let h = currentHour + i
        if (h >= 24){h = h - 24}
        if (h < 10){hprefix = "0"}else{hprefix=""}
        let wline = WeatherData[currentHour+i]
        let design = MAX_TEMPERATURE - wline.temperature
        if (design <0){design = 0}

        let weathercode = wline.weathercode
        if (weathercode == 0){weathericon = "sun"}
        if (weathercode >0 && weathercode <= 3){weathericon = "cloud"}
        if (weathercode >= 45 && weathercode <= 48){weathericon = "fog"}
        if (weathercode >= 51 && weathercode <= 55) { weathericon = "rain"}
        if (weathercode >= 56 && weathercode <= 57){weathericon = "rain"}
        if (weathercode >= 61 && weathercode <= 65){weathericon = "rain"}
        if (weathercode >= 71 && weathercode <= 77){weathericon = "snowy"}
        if (weathercode >= 80 && weathercode <= 82){weathericon = "rain"}
        if (weathercode >= 85 && weathercode <= 86){weathericon = "snowy"}
        if (weathercode >= 95 && weathercode <= 99){weathericon = "thunderstorm"}

        if (h >= 6 && h <= 20){isnight = false}else{isnight=true}
        if (isnight){
            if (weathericon == "sun"){weathericon = "night"}
            if (weathericon == "rain"){weathericon = "night-rain"}
            if (weathericon == "cloud"){weathericon = "night-cloud"}
        }

       


        content += `<div class="hourbyhour">
        <p style="font-weight: bold">${hprefix}${h}:00</p>
        <div class="hourbyhour-temperature">
            <div class="temperatureimg" style="margin-top: ${design*13}px;">
                <img src="images/${weathericon}.svg" alt="${weathercode}" class="${weathericon}">
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
    let icon = document.querySelector('.temperature img')
    icon.src = "images/" + weathericon + ".svg"
    icon.classList = ""
    icon.classList.add(weathericon)
   
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
        <div class="ttd-col onlydesktop"><p>${wline.stormpercentage} %</p></div>
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

// APP START
startAPP()


function startAPP(){
    const geoLocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
    // 1. If Have a favorite location in localStorage load this info by default
    if (localStorage.getItem("favoriteLocation")){
        CURRENT_CITY = localStorage.getItem("favoriteLocation")
        CURRENT_PARENT_CITY = localStorage.getItem("favoriteParent")
        loadWeatherAPP(localStorage.getItem("favoriteLatitude"),localStorage.getItem("favoriteLongitude"))
        buttonfavorite.innerHTML = `<i class="fa fa-star" title="Localización favorita"></i>`
        console.log("Loaded APP By Favorite Location")
        return
    }else{
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, geoLocationOptions);
            console.log("Loaded APP By Navigator Location")
        }
        else{
            // Navegador can't obtain geolocation (no permission, or other problems)
            startAPPWithIP()
            console.log("Loaded APP By IP")
        }
    }
}

/*
Si no encuentra la geolocalización mediante navegador usaremos
la IP para intentar obtener la posición del usuario
*/
async function startAPPWithIP(){
    let call = "https://api.geoapify.com/v1/ipinfo?apiKey=9731c0cd79ed423eb296dd94c8fbd779"
    const response = await fetch(call);
    const results = await response.json();
    CURRENT_CITY = results.city.name
    CURRENT_PARENT_CITY = results.city.name
    CURRENT_LATITUDE = results.location.latitude
    CURRENT_LONGITUDE = results.location.longitude
    loadWeatherAPP(results.location.latitude, results.location.longitude)
}


async function geoLocationSuccess(pos){
    const crd = pos.coords;
    let call = `https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json&apiKey=9731c0cd79ed423eb296dd94c8fbd779`
    const response = await fetch(call);
    const results = await response.json();
    CURRENT_CITY = results.results[0].city
    CURRENT_PARENT_CITY = results.results[0].county
    loadWeatherAPP(crd.latitude,crd.longitude)
}

function geoLocationError(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
    //getLocationByIp()
}
  

const favoritelocation = () => {
    buttonfavorite.addEventListener("click", function() {
        localStorage.setItem("favoriteLocation", CURRENT_CITY)
        localStorage.setItem("favoriteLocationParent", CURRENT_PARENT_CITY)
        localStorage.setItem("favoriteLongitude", CURRENT_LONGITUDE)
        localStorage.setItem("favoriteLatitude", CURRENT_LONGITUDE)
        buttonfavorite.innerHTML = `<i class="fa fa-star" title="Localización favorita"></i>`
    })
}

const previousPage = document.getElementById("goPreviousDay")
const nextPage = document.getElementById("goNextDay")

previousPage.addEventListener("click", function (e) {
    CURRENT_PAGE--
    displayToday(CURRENT_PAGE)
    if (CURRENT_PAGE < 1){
        nextPage.style = "display:block;"
        previousPage.style = "display: none;"
    }
})

nextPage.addEventListener("click", function (e) {
    CURRENT_PAGE++;
    displayToday(CURRENT_PAGE)
    if (CURRENT_PAGE >= 6){
        nextPage.style = "display: none;"
    }
    previousPage.style = "display:block;"
})


window.addEventListener("mouseup", function(event){
    const divSearch = document.querySelector('.results')
    if (event.target != divSearch && event.target.parentNode != divSearch){
        divSearch.style = "display: none"
    }
});