const boardElement = document.querySelector('#board');
const status = document.querySelector('#status');
const moveForm = document.querySelector('#move-form');
const positionInput = document.querySelector('#position');
const markInput = document.querySelector('#mark');
const resetButton = document.querySelector('#reset');
const submitButton = moveForm.querySelector('button');
const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill('');
let currentPlayer = 1;
let gameOver = false;

function renderBoard() {
    const marks = board.map((mark, index) => mark || String(index + 1));
    boardElement.textContent = [
        '                oreja izquierda       oreja derecha',
        `                       ${marks[0]}     ${marks[1]}     ${marks[2]}`,
        `                bigotes ${marks[3]}     ${marks[4]}     ${marks[5]} bigotes`,
        `                       ${marks[6]}     ${marks[7]}     ${marks[8]}`,
        '                mejilla izquierda     mejilla derecha'
    ].join('\n');
}

function play(position, mark) {
    const index = position - 1;

    if (!Number.isInteger(position) || position < 1 || position > 9) {
        status.textContent = 'Escribe una posicion del 1 al 9';
        return false;
    }

    if (mark !== 'X' && mark !== 'O') {
        status.textContent = 'La marca debe ser X u O';
        return false;
    }

    const expectedMark = currentPlayer === 1 ? 'X' : 'O';
    if (mark !== expectedMark) {
        status.textContent = `Al Jugador ${currentPlayer} le toca escribir ${expectedMark}`;
        return false;
    }

    if (board[index] !== '') {
        status.textContent = 'Esa posicion ya esta ocupada';
        return false;
    }

    board[index] = mark;
    renderBoard();

    const hasWinner = winningLines.some(line => line.every(cell => board[cell] === mark));

    if (hasWinner) {
        status.textContent = `Gano el Jugador ${currentPlayer} con ${mark}`;
        gameOver = true;
    } else if (board.every(cell => cell !== '')) {
        status.textContent = 'La partida termino en empate';
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        const nextMark = currentPlayer === 1 ? 'X' : 'O';
        status.textContent = `Turno del Jugador ${currentPlayer}. Escribe ${nextMark}`;
    }

    if (gameOver) {
        positionInput.disabled = true;
        markInput.disabled = true;
        submitButton.disabled = true;
    }

    return true;
}

moveForm.addEventListener('submit', event => {
    event.preventDefault();
    const position = Number(positionInput.value.trim());
    const mark = markInput.value.trim().toUpperCase();
    const moveAccepted = play(position, mark);

    if (moveAccepted) {
        positionInput.value = '';
        markInput.value = '';
    }

    if (!gameOver) {
        positionInput.focus();
    }
});

resetButton.addEventListener('click', () => {
    board = Array(9).fill('');
    currentPlayer = 1;
    gameOver = false;
    status.textContent = 'Turno del Jugador 1. Escribe X';
    positionInput.disabled = false;
    markInput.disabled = false;
    submitButton.disabled = false;
    positionInput.value = '';
    markInput.value = '';
    renderBoard();
    positionInput.focus();
});

renderBoard();
