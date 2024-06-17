// script.js
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const addOptionButton = document.getElementById('add-option');
const removeOptionButton = document.getElementById('remove-option');
const optionInput = document.getElementById('option-input');
const spinButton = document.getElementById('spin');
const stopButton = document.getElementById('stop');
const modal = document.getElementById('result-modal');
const modalContent = document.getElementsByClassName('modal-content')[0];
const resultText = document.getElementById('result-text');
const closeButton = document.getElementsByClassName('close')[0];
const toggleRoulette = document.getElementById('toggle-roulette');
const removeOptionInput1 = document.getElementById('remove-option-input1');
const infoContainer = document.getElementById("info-container");

let optionsPrimary = [
    "1. No subir campeones de estrellas.",    
    "2. No usar oro (ni rolear ni actualizar tienda, ni subir de nivel) hasta la ronda 4-2",
    "3. La partida se juega por equipos 4v4",
    "4. La partida se juega por equipos 2v2v2v2",
    "5. Debes elegir siempre el primer aumento de la izquierda"
];
let optionsSecondary = [
    "1. Se te asigna una legendaria, sólo tu la puedes comprar, + no se gasta oro & sólo 1 champ en tablero hasta la ronda 5-1",
    "2. Se te asigna una épica, sólo tu la puedes comprar, + no se gasta oro & sólo 1 champ en tablero hasta la ronda 4-2",
    "3. Sólo puedes jugar la partida con costes 1 y 2",
    "4. Sólo puedes jugar la partida con costes 2 y 3",
    "5. Sólo puedes jugar la partida con costes 4 y 5 en tu tablero"
];
let options = optionsPrimary;  // Default to primary options

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

function drawRouletteWheel() {
    if (canvas.getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 125;

        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.font = 'bold 30px Helvetica, Arial';

        for (let i = 0; i < options.length; i++) {
            const angle = startAngle + i * arc;
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = 'black';
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                          250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = i + 1 ;
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        // Arrow
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function getColor(item, maxitem) {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;
    
    const red = Math.sin(frequency * item + 2 + phase) * width + center;
    const green = Math.sin(frequency * item + 0 + phase) * width + center;
    const blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return `rgb(${red},${green},${blue})`;
}

function rotateWheel() {
    spinTime += 30;
    if (!isSpinning) {
        stopRotateWheel();
        return;
    }

    let spinAngle = 0;
    /*
    if (toggleRoulette.checked) {
        // Girar en un solo sentido (horario)
        spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    } else {
        // Girar en un sentido aleatorio
        spinAngle = Math.random() * 50 + 50;
    }
    */
    spinAngle = Math.random() * 50 + 50; // eliminar si descomentas lo de arriba
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    const text = options[index];
    resultText.innerText = `${text}!`;
    modal.style.display = 'block';
    ctx.restore();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (-1 * ts * ts + 3 * ts - 3 * t + 1);
}

function startSpin() {
    isSpinning = true;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
    spinButton.style.display = 'none';
    stopButton.style.display = 'inline';
}

function stopSpin() {
    isSpinning = false;
    stopRotateWheel();
    spinButton.style.display = 'inline';
    stopButton.style.display = 'none';
}

function updateOptions() {
    options = toggleRoulette.checked ? optionsSecondary : optionsPrimary;
    arc = Math.PI / (options.length / 2);
    drawRouletteWheel();
    fillInfoContainer();
}

// addOptionButton.addEventListener('click', () => {
//     const option = optionInput.value.trim();
//     if (option) {
//         if (toggleRoulette.checked) {
//             optionsSecondary.push(option);
//         } else {
//             optionsPrimary.push(option);
//         }
//         updateOptions();
//         optionInput.value = '';
//     }
// });

// removeOptionButton.addEventListener('click', () => {
//     const optionToRemove = removeOptionInput1.value.trim();
//     if (toggleRoulette.checked) {
//         const index = optionsSecondary.indexOf(optionToRemove);
//         if (index > -1) {
//             optionsSecondary.splice(index, 1);
//         }
//     } else {
//         const index = optionsPrimary.indexOf(optionToRemove);
//         if (index > -1) {
//             optionsPrimary.splice(index, 1);
//         }
//     }
//     updateOptions();
// });

// Botones para iniciar y detener el giro
spinButton.addEventListener('click', startSpin);
stopButton.addEventListener('click', stopSpin);

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
toggleRoulette.addEventListener('change', () => {
    updateOptions();
    stopButton.style.display = 'none';  // Ocultar botón de detener al cambiar el toggle
    spinButton.style.display = 'inline'; // Asegurar que el botón de girar esté visible
});

function fillInfoContainer(){
    infoContainer.innerHTML = "";
    options.forEach((option)=>{
        const info = document.createElement("p");
        info.classList.add("infoText")
        info.textContent = option;
        infoContainer.appendChild(info)
    })
}

updateOptions();
drawRouletteWheel();
fillInfoContainer();
