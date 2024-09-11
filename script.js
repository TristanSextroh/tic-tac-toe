let fields = [
    null,
    'circle',
    'cross',
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

function init() {
    render();
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

function makeMove(index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        let td = event.target;
        td.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        td.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
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