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

let currentPlayer = 'circle';
let gameOver = false;

function init() {
    render();
    document.querySelector('.restart-button').addEventListener('click', restartGame);
}

function render() {
    let content = document.getElementById('content');
    let tableHTML = '<table>';
    
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let value = fields[index];
            let symbol = '';
            
            if (value === 'circle') {
                symbol = generateCircleSVG();
            } else if (value === 'cross') {
                symbol = generateCrossSVG();
            }
            
            tableHTML += `<td onclick="makeMove(${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    content.innerHTML = tableHTML;
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentPlayer = 'circle';
    gameOver = false;
    render();
    const svg = document.querySelector('svg');
    if (svg) {
        svg.remove();
    }
}


function makeMove(index) {
    if (fields[index] === null && !gameOver) {
        fields[index] = currentPlayer;
        let td = event.target;
        td.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        td.onclick = null;
        
        if (checkGameOver()) {
            gameOver = true;
            drawWinningLine();
        } else {
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}

function generateCircleSVG() {
    return `
    <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5">
            <animate 
                attributeName="stroke-dasharray" 
                from="0 188.5" 
                to="188.5 0" 
                dur="1s" 
                repeatCount="1"
                fill="freeze"
            />
        </circle>
    </svg>
    `;
}

function generateCrossSVG() {
    return `
    <svg width="70" height="70" viewBox="0 0 70 70">
        <path d="M15 15 L55 55 M55 15 L15 55" fill="none" stroke="#FFC000" stroke-width="5" stroke-linecap="round">
            <animate 
                attributeName="stroke-dasharray" 
                from="0 113" 
                to="113 0" 
                dur="1s" 
                repeatCount="1"
                fill="freeze"
            />
        </path>
    </svg>
    `;
}

function checkGameOver() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combination of winningCombinations) {
        if (
            fields[combination[0]] &&
            fields[combination[0]] === fields[combination[1]] &&
            fields[combination[0]] === fields[combination[2]]
        ) {
            return combination;
        }
    }

    if (fields.every(field => field !== null)) {
        return 'draw';
    }

    return false;
}

function drawWinningLine() {
    const winningCombination = checkGameOver();
    if (winningCombination === 'draw') {
        return;
    }

    const [a, b, c] = winningCombination;
    const table = document.querySelector('table');
    const cells = table.getElementsByTagName('td');

    const startCell = cells[a].getBoundingClientRect();
    const endCell = cells[c].getBoundingClientRect();

    const tableRect = table.getBoundingClientRect();

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startCell.left + startCell.width / 2 - tableRect.left);
    line.setAttribute('y1', startCell.top + startCell.height / 2 - tableRect.top);
    line.setAttribute('x2', endCell.left + endCell.width / 2 - tableRect.left);
    line.setAttribute('y2', endCell.top + endCell.height / 2 - tableRect.top);
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '5');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.appendChild(line);

    table.style.position = 'relative';
    table.appendChild(svg);

    line.innerHTML = `
        <animate 
            attributeName="stroke-dasharray" 
            from="0 ${line.getTotalLength()}" 
            to="${line.getTotalLength()} 0" 
            dur="0.5s" 
            repeatCount="1"
            fill="freeze"
        />
    `;
}