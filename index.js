// script.js
const canvas = document.getElementsByClassName('wheel');
const ctx = [canvas[0].getContext('2d'), canvas[1].getContext('2d')];
// const addOptionButton = document.getElementById('add-option');
// const removeOptionButton = document.getElementById('remove-option');
// const optionInput = document.getElementById('option-input');
const spinButton = document.getElementsByClassName('spin');
const stopButton = document.getElementsByClassName('stop');
const modal = document.getElementById('result-modal');
const modalContent = document.getElementsByClassName('modal-content')[0];
const resultText = document.getElementById('result-text');
const closeButton = document.getElementsByClassName('close')[0];
// const toggleRoulette = document.getElementById('toggle-roulette');
// const removeOptionInput1 = document.getElementById('remove-option-input1');
const infoContainer = document.getElementsByClassName("info-container");
const music = document.getElementsByClassName("myAudio");

let optionsMagic = [
    "1. No subir campeones de estrellas.",    
    "2. No usar oro (ni rolear ni actualizar tienda, ni subir de nivel) hasta la ronda 4-2",
    "3. La partida se juega por equipos 4v4",
    "4. La partida se juega por equipos 2v2v2v2",
    "5. Debes elegir siempre el primer aumento de la izquierda"
];
let optionsChaos = [
    "1. Se te asigna una legendaria, sólo tu la puedes comprar, + no se gasta oro & sólo 1 champ en tablero hasta la ronda 5-1",
    "2. Se te asigna una épica, sólo tu la puedes comprar, + no se gasta oro & sólo 1 champ en tablero hasta la ronda 4-2",
    "3. Sólo puedes jugar la partida con costes 1 y 2",
    "4. Sólo puedes jugar la partida con costes 2 y 3",
    "5. Sólo puedes jugar la partida con costes 4 y 5 en tu tablero"
];

let opciones = [optionsMagic,optionsChaos];
const colors = ['gray', 'green', 'blue', 'purple', 'gold'];

const N = 3; 

let options = optionsMagic;  // Default to primary options

let startAngle = [Math.floor(Math.random() * 7),Math.floor(Math.random() * 7)];
let arc = [Math.PI / (opciones[0].length / 2), Math.PI / (opciones[1].length / 2)];
let spinTimeout = [null,null];
let spinAngleStart = [10,10];
let spinTime = [0,0];
let spinTimeTotal = [0,0];
let isSpinning = [false,false];

function drawRouletteWheel(unit) {
    const repeatedOptions = [[],[]];
    for (let i = 0; i < N; i++) {
        repeatedOptions[unit].push(...opciones[unit]);
    }
    const repeatedOptionsCount = repeatedOptions[unit].length;
    arc[unit] = Math.PI / (repeatedOptionsCount / 2);

    if (canvas[unit].getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 50;
        ctx[unit].clearRect(0, 0, 500, 500);

        ctx[unit].strokeStyle = 'black';
        ctx[unit].lineWidth = 2;

        ctx[unit].font = 'bold 30px Helvetica, Arial';
        for (let i = 0; i < repeatedOptionsCount; i++) {
            const angle = startAngle[unit] + i * arc[unit];
            //ctx[unit].fillStyle = getColor({item: i, maxitem: repeatedOptionsCount}); // multicolores
            ctx[unit].fillStyle = getColor({index:i}); // multicolores

            ctx[unit].beginPath();
            ctx[unit].arc(250, 250, outsideRadius, angle, angle + arc[unit], false);
            ctx[unit].arc(250, 250, insideRadius, angle + arc[unit], angle, true);
            ctx[unit].fill();
            
            ctx[unit].save();
            ctx[unit].fillStyle = 'black';
            ctx[unit].translate(250 + Math.cos(angle + arc[unit] / 2) * textRadius,
            250 + Math.sin(angle + arc[unit] / 2) * textRadius);
            ctx[unit].rotate(angle + arc[unit] / 2 + Math.PI / 2);
            const text = (i % opciones[unit].length) + 1 ;
            ctx[unit].fillText(text, -ctx[unit].measureText(text).width / 2, 0);
            ctx[unit].restore();
            
            if (i < repeatedOptionsCount - 1) {
                ctx[unit].strokeStyle = 'black';
                ctx[unit].lineWidth = 2;
                ctx[unit].beginPath();
                ctx[unit].moveTo(250, 250);
                ctx[unit].lineTo(250 + Math.cos(angle) * outsideRadius, 250 + Math.sin(angle) * outsideRadius);
                ctx[unit].stroke();
            }

        }

        // Arrow
        ctx[unit].fillStyle = 'black';
        ctx[unit].beginPath();
        ctx[unit].moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx[unit].lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx[unit].lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx[unit].lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx[unit].lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx[unit].lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx[unit].lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx[unit].lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx[unit].fill();
    }
}

function getColor({item, maxitem, index}) {
    /* Multicolores */
    // const phase = 0;
    // const center = 128;
    // const width = 127;
    // const frequency = Math.PI * 2 / maxitem;
    
    // const red = Math.sin(frequency * item + 2 + phase) * width + center;
    // const green = Math.sin(frequency * item + 0 + phase) * width + center;
    // const blue = Math.sin(frequency * item + 4 + phase) * width + center;

    // return `rgb(${red},${green},${blue})`;
    /* 5 Colores predefinidos arriba */
    return colors[index % colors.length];
}

function rotateWheel(unit) {
    spinTime[unit] += 30;
    let spinAngle;
    if (!isSpinning[unit]) {
        // stopRotateWheel();
        // return;
        if(spinAngle > 1){

            spinAngle = spinAngleStart[unit] - easeOut(spinTime[unit], 0, 5, spinTimeTotal[unit]);  // Reduce the spin angle gradually
        }else{
            spinAngle = spinAngleStart[unit] / easeOut(spinTime[unit], 0, 5, spinTimeTotal[unit]);  // Reduce the spin angle gradually

        }
        console.log({spinAngle})
        if (spinAngle < 0.15) {  // Small threshold to stop the wheel
            console.log({spinAngle})
            stopRotateWheel(unit);
            return;
        }
    }

    
    /*
    if (toggleRoulette.checked) {
        // Girar en un solo sentido (horario)
        spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    } else {
        // Girar en un sentido aleatorio
        spinAngle = Math.random() * 50 + 50;
    }
    */
   else{
       spinAngle = Math.random() * 20 + 20; // eliminar si descomentas lo de arriba
       if(music[unit].currentTime > 163){
           music[unit].currentTime = 120;
       }
       
   }
    startAngle[unit] += (spinAngle * Math.PI / 180); // radianes
    drawRouletteWheel(unit);
    spinTimeout = setTimeout(()=>rotateWheel(unit), 30);
}

function stopRotateWheel(unit) {
    clearTimeout(spinTimeout);
    const degrees = startAngle[unit] * 180 / Math.PI + 90;
    const arcd = arc[unit] * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd) % opciones[unit].length;
    ctx[unit].save();
    ctx[unit].font = 'bold 30px Helvetica, Arial';
    const text = opciones[unit][index];
    resultText.innerText = `${text}!`;
    modal.style.display = 'block';
    ctx[unit].restore();
    spinButton[unit].classList.toggle("disable");
    // Lanzar confeti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function easeOut(t, b, c, d) {
    // const ts = (t /= d) * t;
    // const tc = ts * t;
    // return b + c * (-1 * ts * ts + 3 * ts - 3 * t + 1);
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function startSpin(unit) {
    isSpinning[unit] = true;
    spinTime[unit] = 0;
    spinTimeTotal[unit] = Math.random() * 3 + 4 * 1000;
    rotateWheel(unit);
    spinButton[unit].style.display = 'none';
    stopButton[unit].style.display = 'inline';
    startMusic(unit)
}

function stopSpin(unit) {
    isSpinning[unit] = false;
    //stopRotateWheel();
    spinTime[unit] = 0;  // Reset spin time for a smooth stop
    spinTimeTotal[unit] = 3000;  // Total time to stop (in milliseconds)
    spinButton[unit].style.display = 'inline';
    spinButton[unit].classList.toggle("disable");
    stopButton[unit].style.display = 'none';
    music[unit].currentTime = 160;
    music[unit].play();
}


function  startMusic(unit){
    music[unit].currentTime = 120;
    music[unit].play();
}

// function updateOptions() {
//     options = toggleRoulette.checked ? optionsChaos : optionsMagic;
//     arc = Math.PI / (options.length / 2);
//     drawRouletteWheel();
//     fillInfoContainer();
// }

// Botones para iniciar y detener el giro
Array.from(spinButton).forEach((spinBtn,i)=>{
    spinBtn.addEventListener('click', ()=>{
        startSpin(i);
        stopSpin(i);
    });    
})
Array.from(stopButton).forEach((stopBtn,i)=>{
    stopBtn.addEventListener('click', ()=>stopSpin(i));
    
})

// Botón de cierre del modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cierre del modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Manejar el cambio en el toggle de ruleta alternativa
// toggleRoulette.addEventListener('change', () => {
//     updateOptions();
//     stopButton.style.display = 'none';  // Ocultar botón de detener al cambiar el toggle
//     spinButton.style.display = 'inline'; // Asegurar que el botón de girar esté visible
// });

function fillInfoContainer(unit){
    infoContainer.innerHTML = "";
    opciones[unit].forEach((option, i)=>{
        const info = document.createElement("p");
        info.style.backgroundColor = `${colors[i]}`
        info.classList.add("infoText")
        info.textContent = option;
        infoContainer[unit].appendChild(info)
    })
}

// updateOptions();
drawRouletteWheel(0);
fillInfoContainer(0);

drawRouletteWheel(1);
fillInfoContainer(1);
