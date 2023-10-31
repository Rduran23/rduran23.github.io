// GAME OPTIONS
let TOTAL_CARDS = 12
const CARDS_BY_DIFFICULT = [0,12,16,20,24]
const DEFAULT_TIME = 60

let CURRENT_DIFFICULT = 0

const fruits = ["🍏","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥔","​🥕","​🌽","🌶️","​🫑","🥒","​🥬","​🥦","​🧄","​🧅","🥜"]

let selectedfruits = []
let fruits_finded = 0
let clickedFruits = []
let lastPicked

const preGameContainer = document.querySelector('.pregame')
const gameContainer = document.querySelector('.game')
const footerGameContainer = document.querySelector('.footergame')

const contador = document.querySelector('.timer p')
const playedgamesspan = document.querySelector('.stats p span')
const winnedgamesspan = document.querySelector('.score p span')
console.log(playedgamesspan)

let countdowngame


let contadorTimer = DEFAULT_TIME
let blockSelection = false

let PLAYED_GAMES = 0
let WINNED_GAMES = 0

function loadStats(){
    PLAYED_GAMES = window.localStorage.getItem("playedgames") ?? 0
    WINNED_GAMES = window.localStorage.getItem("winnedgames") ?? 0
    console.log(PLAYED_GAMES, WINNED_GAMES)

    PLAYED_GAMES = parseInt(PLAYED_GAMES)
    window.localStorage.setItem("playedgames", PLAYED_GAMES)
    playedgamesspan.innerHTML = PLAYED_GAMES
    winnedgamesspan.innerHTML = WINNED_GAMES


}
loadStats()


function startGame(difficult){
    window.localStorage.setItem("playedgames", parseInt(PLAYED_GAMES) + 1)
    playedgamesspan.innerHTML = PLAYED_GAMES + 1
    CURRENT_DIFFICULT = difficult
    if (CURRENT_DIFFICULT > 1){
        gameContainer.classList.replace("smallboard","bigboard")
    }else{
        gameContainer.classList.replace("bigboard", "smallboard")
    }
    TOTAL_CARDS = CARDS_BY_DIFFICULT[difficult]
    selectedfruits = []
    gameContainer.style = "display: flex;"
    footerGameContainer.style = "display: block"
    preGameContainer.style = "display: none"
    selectCards()
    
}

function selectCards(){
    selectedfruits = []
    clickedFruits = []
    for (let i = 0; i < TOTAL_CARDS / 2; i++){
        let randomfruit = Math.floor(Math.random() * fruits.length)
        if (!selectedfruits.includes(fruits[randomfruit])){
            selectedfruits.push(fruits[randomfruit])
            selectedfruits.push(fruits[randomfruit])
        }else{
           i--;
        }
    }
    fisher_yates()
}

function fisher_yates(){
    let array = selectedfruits;
    let i = array.length;
    while (--i > 0) {
       let temp = Math.floor(Math.random() * (i + 1));
       [array[temp], array[i]] = [array[i], array[temp]];
    }
    loadCards()
 };

 function loadCards(){
    gameContainer.innerHTML = ""
    lastPicked = []
    fruits_finded = 0
    blockSelection = false;

    for (let i = 0; i < TOTAL_CARDS; i++){
        let cardconstructor = `<div id="card-${i}" class="card" onclick="selectCard(this)"><div class="front"><p>❔</p></div><div class="back"><p>${selectedfruits[i]}</p></div></div>`
        gameContainer.innerHTML += cardconstructor
    }
 }

 function selectCard(e){
    if (blockSelection) {return}
    if (e.classList.contains("picked")){return}
    if (contadorTimer >= DEFAULT_TIME){
        countdowngame = setInterval(countdown, 1000)
    }
    let v = e.childNodes[1].childNodes[0].innerHTML
    let step = clickedFruits.length
    e.classList.add("picked")
    let winround = false
    

    if (step == 0){
        clickedFruits.push(v)
        lastPicked = e
    }
    if (step == 1){
        if (clickedFruits.includes(v)){
            fruits_finded++;
            winround = true
            setTimeout(() => {
                e.style = "background: #10760f;"
                lastPicked.style = "background: #10760f;"
            }, 750);
            console.log(fruits_finded, TOTAL_CARDS, TOTAL_CARDS / 2)
            if (fruits_finded >= TOTAL_CARDS / 2){
                clearInterval(countdowngame)
                winnedgamesspan.innerHTML = parseInt(winnedgamesspan.innerHTML) + 1
                window.localStorage.setItem("winnedgames", parseInt(winnedgamesspan.innerHTML))
            }
        }else{
            blockSelection = true
            setTimeout(() => {
                e.classList.remove("picked")
                lastPicked.classList.remove("picked")
                blockSelection = false
            }, 1000);  
        }
        clickedFruits = []
    }
 }

 function finishGame(){
    let cards = document.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++){
        if (!cards[i].classList.contains("picked")){
            console.log(cards[i])
            cards[i].classList.add("picked")
            cards[i].style = "background: #730000;"
        }
    }
 }

 function returnToMenu(){
    gameContainer.style = "display: none;"
    footerGameContainer.style = "display: none"
    preGameContainer.style = "display: flex"
    gameContainer.innerHTML = ""
    clearInterval(countdowngame)
    contador.style = style='visibility: hidden;'
 }

 function restartGame(){
    contadorTimer = DEFAULT_TIME
    clearInterval(countdowngame)
    startGame(CURRENT_DIFFICULT)
    gameContainer.innerHTML = ""
    startGame(CURRENT_DIFFICULT)
    contador.style =  style='visibility: hidden;'
 }


function countdown(){
    contadorTimer--
    if (contadorTimer <= 0){
        contadorTimer = 0
        clearInterval(countdowngame)
        blockSelection = true;
        setTimeout(() => {
            finishGame()
        }, 1000);  
    }else{
        contador.style =  style='visibility: visible;'
        contador.innerHTML = contadorTimer + "s"
    }
   
}

const returntoMenuButton = document.querySelector('.returnToMenu')
returntoMenuButton.addEventListener("click", (e) => {returnToMenu()})

const restartGameButton = document.querySelector('.restartGame')
restartGameButton.addEventListener("click", (e) => {restartGame()})


function restartscores(){
    window.localStorage.setItem("playedgames",0)
    window.localStorage.setItem("winnedgames",0)
    
}