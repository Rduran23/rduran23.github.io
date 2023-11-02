let voices
let canUseVoice = false
let VolumeOn = true
let isOnPause = true

const grid = document.querySelector('.grid')
const currentnumber = document.querySelector('.currentnumber')

const pauseButton = document.querySelector('.pause')

let bolas = 0
let bolas_fuera = []
let bolas_bombo = []
let interval = null



function createBoard(){
    grid.innerHTML = ""
    let content = ""
    bolas_fuera = []
    bolas_bombo = []

    for (let i = 1; i<= 90;i++){
        bolas_bombo.push(i)
        if (/.*1$/.test(i)) {
            content += `<div class="grid-row">`
        }
        content += `<div class="box" id="box-${i}"><span>${i}</span></div>`
        if (/.*0$/.test(i)) {
            content += `</div>`
        }
    }
    grid.innerHTML = content
}

function speak(texto){
    voices = window.speechSynthesis.getVoices();
    const message = new SpeechSynthesisUtterance();
    message.text = texto;
    message.volume = 1; // Volume range = 0 - 1
    message.rate = 1.5; // Speed of the text read , default 1
    message.voice = voices[2]; // change voice
    message.lang = 'es-ES'; // Language, default 'en-US'
    message.pitch = 1
    window.speechSynthesis.speak(message);
}

function num(){
    let ultimos = document.querySelector('.last_numbers .last')
    const terminaencinco = /5$/;

    if (bolas_fuera.length >= 90){
        console.log("Ya están las 90 bolas fuera")
        return
    }
    let n = Math.floor(Math.random()*bolas_bombo.length);
    let item = bolas_bombo[n]
    if (canUseVoice && VolumeOn){
        speak(item)
    }
   // if (item != 22){speak("Los dos patitos")}
   //if (terminaencinco.test(item)){speak("por el culo te la hinco")}


    bolas_fuera.push(bolas_bombo[n])
    bolas_bombo.splice(n,1)

    let b = document.querySelector(`#box-${item}`)
    b.style = "background-color: green; color: white;"
    currentnumber.innerHTML = `<span>${item}</span>`
    if (bolas_fuera.length > 1){
        ultimos.innerHTML += `<span>${bolas_fuera[bolas_fuera.length-2]}</span>`
    }
}

function startBingo(){
    createBoard()
    isOnPause = false
    pauseButton.style = "display: block"

}


function pausarBingo(){
    let button = document.querySelector('header .pause')
    if (isOnPause){
        isOnPause = false
        button.innerHTML = "PAUSAR"
    }else{
        isOnPause = true
        button.innerHTML = "Cont"
    }
}

function toggleVoice(){
    let iconbutton = document.querySelector("header button i")
    if (VolumeOn){
        iconbutton.classList.replace("fa-volume-xmark", "fa-volume-high")
        VolumeOn = false;
    }else{
        iconbutton.classList.replace("fa-volume-high","fa-volume-xmark")
        VolumeOn = true;
    }
}


if ( 'speechSynthesis' in window ) {
    canUseVoice = true;
    window.speechSynthesis.onvoiceschanged = function() {
        voices = window.speechSynthesis.getVoices();
      };
}

const playingBingo = function(){
    if (isOnPause){
        console.log("intervalo en pausa")
        return
    }else{
        num()
    }
}

interval = setInterval(playingBingo, 5000);



