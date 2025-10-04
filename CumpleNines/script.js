// script.js
// Lógica de los acertijos y navegación

const acertijos = [
    mostrarAcertijo1,
    mostrarAcertijo2,
    mostrarAcertijo3,
    mostrarAcertijo4,
    mostrarAcertijo5,
    mostrarAcertijo6
];
let paso = 0;

// CONFIGURACIÓN DEL PUZZLE
// Cambia estas variables para ajustar el puzzle
const PUZZLE_ROWS = 3; // filas
const PUZZLE_COLS = 5; // columnas
const PUZZLE_MODE = 'swap'; // 'swap' para intercambiar piezas, 'slide' para deslizar

function mostrarAcertijo1() {
    document.getElementById('app').innerHTML = `
        <h1>Regalo Nines</h1>
        <h2>Acertijo 1: ¡Resuelve el puzzle!</h2>
        <div id="puzzle-container"></div>
        <button id="puzzle-next" style="display:none">Siguiente</button>
    `;
    iniciarPuzzle();
}

function mostrarAcertijo2() {
    document.getElementById('app').innerHTML = `
        <h1>Regalo Nines</h1>
        <h2>Acertijo 2</h2>
        <p>Todo empezó siendo el equipo...</p>
        <input type="text" id="respuesta" placeholder="Respuesta...">
        <button onclick="comprobarClave('calamarsi')">Comprobar</button>
    `;
}

function mostrarAcertijo3() {
    document.getElementById('app').innerHTML = `
        <h1>Regalo Nines</h1>
        <h2>Acertijo 3</h2>
        <p>Ahora con Otto somos el equipo...:</p>
        <input type="text" id="respuesta" placeholder="Respuesta...">
        <button onclick="comprobarClave('boniato')">Comprobar</button>
    `;
}

function mostrarAcertijo4() {
    document.getElementById('app').innerHTML = `
        <h1>Regalo Nines</h1>
        <h2>Acertijo 4</h2>
        <p>Pista: Buscando donde está el motor de un ferrari</p>
        <input type="text" id="respuesta" placeholder="Respuesta...">
        <button onclick="comprobarClave('elefante')">Comprobar</button>
    `;
}

function mostrarAcertijo5() {
    document.getElementById('app').innerHTML = `
        <h1>Regalo Nines</h1>
        <h2>Acertijo 5</h2>
        <p>Adivina adivinanza: Brillan mucho y saben bailar, danzan sobre la tarta y con un soplido se van</p>
        <input type="text" id="respuesta" placeholder="Respuesta...">
        <button onclick="comprobarClave('velas')">Comprobar</button>
    `;
}

function mostrarAcertijo6() {
    document.getElementById('app').innerHTML = `
        <h1>Regalo Nines</h1>
        <h2>¡Último acertijo resuelto!</h2>
        <div class="cake">
            <img src="TartaNines.png" alt="Tarta de cumpleaños" class="cake-img" style="max-width: 220px; border-radius: 16px; box-shadow: 0 2px 12px #d2691e33;"/>
            <div class="felicidades">¡Felicidades Nines!</div>
        </div>
        <a class="download-link" href="regaloNines.pdf" download>Descargar tu regalo 🎁</a>
        <audio id="audio-nines" src="musicaNines.mp3" autoplay loop></audio>
    `;
    const audio = document.getElementById('audio-nines');
    if (audio) {
        audio.play().catch(()=>{});
    }
}

function siguienteAcertijo() {
    paso++;
    acertijos[paso]();
}
 

function comprobarClave(clave) {
    const val = document.getElementById('respuesta').value.trim().toLowerCase();
    if (val === clave) {
        siguienteAcertijo();
    } else {
        alert('¡Respuesta incorrecta! Intenta de nuevo.');
    }
}

// --- Puzzle de 16 piezas ---
function iniciarPuzzle() {
    const rows = PUZZLE_ROWS;
    const cols = PUZZLE_COLS;
    const piezas = [];
    const totalPiezas = PUZZLE_MODE === 'swap' ? rows * cols : rows * cols;
    for (let i = 0; i < totalPiezas; i++) piezas.push(i);
    if (PUZZLE_MODE === 'swap') {
        do {
            piezas.sort(() => Math.random() - 0.5);
        } while (puzzleResueltoRect(piezas, rows, cols));
    } else {
        do {
            piezas.sort(() => Math.random() - 0.5);
        } while (!esSolucionableRect(piezas, rows, cols));
    }
    renderPuzzle(piezas, rows, cols);
}

let swapState = { first: null, piezas: null, rows: null, cols: null };

function renderPuzzle(piezas, rows, cols) {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    container.className = `puzzle-board puzzle-board-${rows}x${cols}`;
    swapState = { first: null, piezas, rows, cols };
    piezas.forEach((pieza, idx) => {
        const div = document.createElement('div');
        let isEmpty = (PUZZLE_MODE === 'slide' && pieza === rows*cols-1);
        div.className = 'puzzle-piece' + (isEmpty ? ' empty' : '');
        const x = pieza % cols;
        const y = Math.floor(pieza / cols);
        div.style.backgroundImage = 'url(imagepuzzle.jpg)';
        div.style.backgroundPosition = `${(x/(cols-1))*100}% ${(y/(rows-1))*100}%`;
        div.style.backgroundSize = `${cols*100}% ${rows*100}%`;
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.display = 'block';
        if (isEmpty && PUZZLE_MODE === 'slide') {
            div.style.background = '#eee';
            div.style.backgroundImage = '';
        }
        if (PUZZLE_MODE === 'slide') {
            div.addEventListener('click', () => moverPiezaRect(idx, piezas, rows, cols));
        } else {
            div.addEventListener('click', () => swapPiezaRect(idx, piezas, rows, cols, div));
        }
        container.appendChild(div);
    });
    if (puzzleResueltoRect(piezas, rows, cols)) {
        document.getElementById('puzzle-next').style.display = 'block';
        document.getElementById('puzzle-next').onclick = siguienteAcertijo;
    } else {
        document.getElementById('puzzle-next').style.display = 'none';
    }
}

function swapPiezaRect(idx, piezas, rows, cols, div) {
    if (swapState.first === null) {
        swapState.first = idx;
        div.classList.add('selected');
    } else if (swapState.first !== null && swapState.first !== idx) {
        [piezas[swapState.first], piezas[idx]] = [piezas[idx], piezas[swapState.first]];
        swapState.first = null;
        renderPuzzle(piezas, rows, cols);
    } else if (swapState.first === idx) {
        swapState.first = null;
        div.classList.remove('selected');
    }
}

function moverPiezaRect(idx, piezas, rows, cols) {
    const emptyIdx = piezas.indexOf(rows*cols-1);
    const [ex, ey] = [emptyIdx % cols, Math.floor(emptyIdx / cols)];
    const [px, py] = [idx % cols, Math.floor(idx / cols)];
    if ((Math.abs(ex-px) + Math.abs(ey-py)) === 1) {
        [piezas[emptyIdx], piezas[idx]] = [piezas[idx], piezas[emptyIdx]];
        renderPuzzle(piezas, rows, cols);
    }
}

function puzzleResueltoRect(piezas, rows, cols) {
    for (let i = 0; i < rows*cols; i++) {
        if (piezas[i] !== i) return false;
    }
    return true;
}

function esSolucionableRect(piezas, rows, cols) {
    let inv = 0;
    for (let i = 0; i < piezas.length; i++) {
        for (let j = i+1; j < piezas.length; j++) {
            if (piezas[i] !== rows*cols-1 && piezas[j] !== rows*cols-1 && piezas[i] > piezas[j]) inv++;
        }
    }
    const emptyRow = Math.floor(piezas.indexOf(rows*cols-1) / cols);
    if (cols % 2 === 1) return inv % 2 === 0;
    return (inv + emptyRow) % 2 === 1;
}

// Iniciar primer acertijo al cargar
window.onload = () => {
    acertijos[0]();
};
