let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];

let currentPlayer = 'circle';
let gameFinished = false;

let circleScore = 0; // Punktzahl für circle
let crossScore = 0; // Punktzahl für cross

function init() {
    render();
    updateScores();
    crossDisplayTurn();
    circleDisplayTurn();
 
}

function render() {
    const contentDiv = document.getElementById('content');

    // Generate table HTML
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    // Set table HTML to contentDiv
    contentDiv.innerHTML = tableHtml;
}

function handleClick(cell, index) {
    if (fields[index] === null && !gameFinished) {
        fields[index] = currentPlayer;
        if (currentPlayer === 'circle') {
            cell.innerHTML = generateCircleSVG();
            crossDisplayTurn();
        } else {
            cell.innerHTML = generateCrossSVG();
            circleDisplayTurn();
        }
        
        cell.onclick = null;

        if (isGameFinished()) {
            gameFinished = true;
            const winCombination = getWinningCombination();
            if (winCombination) {
                // Erhöht die Punktzahl des Gewinners nur einmal
                if (currentPlayer === 'circle') {
                    circleScore++;
                } else if (currentPlayer === 'cross') {
                    crossScore++;
                }
                drawWinningLine(winCombination);
                updateScores();
            }
        }

        // Wechselt den aktuellen Spieler nach der Überprüfung auf Gewinn
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}

function generateCircleSVG(width = 70,height = 70) {
    const color = '#FF0000';

    return `<svg width="${width}" height="${height}">
              <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.4s" fill="freeze" />
              </circle>
            </svg>`;
} 

function generateCrossSVG(width = 70,height = 70) {
    const color = '#00B0EF';
  

    const svgHtml = `
      <svg width="${width}" height="${height}">
        <line x1="0" y1="0" x2="${width}" y2="${height}"
          stroke="${color}" stroke-width="5">
          <animate attributeName="x2" values="0; ${width}" dur="300ms" />
          <animate attributeName="y2" values="0; ${height}" dur="300ms" />
        </line>
        <line x1="${width}" y1="0" x2="0" y2="${height}"
          stroke="${color}" stroke-width="5">
          <animate attributeName="x2" values="${width}; 0" dur="300ms" />
          <animate attributeName="y2" values="0; ${height}" dur="300ms" />
        </line>
      </svg>
    `;

    return svgHtml;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;
  
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
  
    const contentRect = document.getElementById('content').getBoundingClientRect();
  
    const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
  
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}

function updateScores() {
    // Aktualisiert die Punktzahl-Anzeige auf der Webseite
    document.getElementById('circleScore').innerText = `Circle: ${circleScore}`;
    document.getElementById('crossScore').innerText = `Cross: ${crossScore}`;
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    gameFinished = false;
    render();
}

// Initialisiere das Spiel beim Laden der Seite

function circleDisplayTurn () {
    let displayCircle = document.getElementById('display-circle');
    let displayCross = document.getElementById('display-cross');
    const width = 70;
    const height = 70;
    displayCircle.innerHTML = generateCircleSVG(width,height)
    displayCircle.classList.remove('opacity');
    displayCross.classList.add('opacity');


}

function crossDisplayTurn() {
    let displayCircle = document.getElementById('display-circle');
    let displayCross = document.getElementById('display-cross');
    const width = 70;
    const height = 70;
    generateCrossSVG(width,height)
    displayCross.innerHTML = generateCrossSVG(width,height);
    displayCircle.classList.add('opacity');
    displayCross.classList.remove('opacity');
}

function equalStart () {
    let displayCircle = document.getElementById('display-circle');
    let displayCross = document.getElementById('display-cross');
    displayCircle.classList.add('opacity');
   
}


