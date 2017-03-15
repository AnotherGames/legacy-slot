let arr = [[], [], [], [], []];
let min = 1;
let game = 'candyLand';
let max = 8;
let wild = 9;
let combLines = 10;
let initObject = {};
let rollObject = {};
let winComb = [[2, 2, 2, 2, 2], [3, 3, 3, 3, 3], [1, 1, 1, 1, 1], [3, 2, 1, 2, 3], [1, 2, 3, 2, 1], [3, 3, 2, 3, 3], [1, 1, 2, 3, 3], [2, 3, 3, 3, 2], [2, 1, 1, 1, 2], [1, 2, 2, 2, 1], [3, 2, 2, 2, 3], [3, 2, 2, 2, 1], [1, 2, 2, 2, 3], [3, 3, 2, 1, 1], [1, 1, 2, 3, 3], [3, 3, 3, 2, 1], [1, 1, 1, 2, 3], [3, 2, 1, 1, 1], [1, 2, 3, 3, 3], [2, 2, 1, 2, 2], [2, 2, 3, 2, 2]];
let lines =
    [[{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 1}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 1}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 1}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 1}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 1}],
    [{X: 0, Y: 1}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 1}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 2}]];
let wins = [];
let Modes = {
    chibi: ['root', 'fsBonus1', 'shuriken1', 'shuriken2', 'shuriken3', 'shuriken4', 'shuriken5'],
    goldSea: [],
    candyLand: ['root', 'fsBonus1', 'fsBonus2', 'fsBonus3', 'fsBonus4', 'fsBonus5', 'fsBonus6', 'fsBonus7']
};

let Symbols = {
    chibi: [{Name: 'Jack', Symbol: '1'}, {Name: 'Warrior', Symbol: '2'}, {Name: 'Queen', Symbol: '3'},
     {Name: 'Ninja', Symbol: '4'}, {Name: 'King', Symbol: '5'}, {Name: 'Samurai', Symbol: '6'},
    {Name: 'Ace', Symbol: '7'}, {Name: 'Geisha', Symbol: '8'}, {Name: 'Wild', Symbol: '9'},
    {Name: 'Scatter', Symbol: '10'}, {Name: 'fsScatter', Symbol: '11'}, {Name: 'Shuriken', Symbol: '12'}],
    candyLand: [{Name: 'Jack', Symbol: '1'}, {Name: 'CandyCane', Symbol: '2'}, {Name: 'Queen', Symbol: '3'},
     {Name: 'Lollypop', Symbol: '4'}, {Name: 'King', Symbol: '5'}, {Name: 'Icecream', Symbol: '6'},
    {Name: 'Ace', Symbol: '7'}, {Name: 'Donut', Symbol: '8'},
    {Name: 'GreenBottleTop', Symbol: '9'}, {Name: 'GreenBottleMid', Symbol: '10'}, {Name: 'GreenBottleBottom', Symbol: '11'},
    {Name: 'OrangeBottleTop', Symbol: '12'}, {Name: 'OrangeBottleMid', Symbol: '13'}, {Name: 'OrangeBottleBottom', Symbol: '14'},
    {Name: 'CherryBottleTop', Symbol: '15'}, {Name: 'CherryBottleMid', Symbol: '16'}, {Name: 'CherryBottleBottom', Symbol: '17'},
    {Name: 'fsWild', Symbol: '21'}]
};

let SymbolsValue = {
    '1': [3, 5, 10], '2': [25, 50, 100], '3': [25, 50, 100], '4': [25, 50, 100], '5': [25, 50, 100],
    '6': [25, 50, 100], '7': [25, 50, 100], '8': [25, 50, 100],
}

function generateArray() {
    for (let i = 0; i < 5; i++) {
        for (let k = 0; k < 5; k++) {
            arr[i][k] = Math.round(Math.random() * (max - min) + min);
        }
    }
}

function logMatrix() {
    for ( let i = 0; i < 5; i++) {
        console.log(`${arr[i][0]} ${arr[i][1]} ${arr[i][2]} ${arr[i][3]} ${arr[i][4]}`);
    }
}

function firtNumberInWinLine(arrComb) {
    for (let k = 0; k < 5; k++) {
        for (let i = 0; i < 5; i++) {
            if (arr[i][arrComb[i]] !== wild) {
                return arr[i][arrComb[i]];
            }
        }
    }
}

function checkForWinLines() {
    let numinWins = 0;
    for (let k = 0; k < combLines; k++) {
        let win = 0;
        let winNumber = firtNumberInWinLine(winComb[k]);

        for (let i = 0; i < 5; i++) {
            if (arr[i][winComb[k][i]] === winNumber || arr[i][winComb[k][i]] === wild) {
                win++;
            } else {
                break;
            }
        }

        if (win > 2) {
            wins[numinWins] = {
                Count: win,
                Line: k + 1,
                Name: Symbols[game][k].Name,
                Symbol: winNumber,
                Win: winNumber * 2
            };
            numinWins++;
        }
    }
}

function addWilds() {
    let numOfWilds = Math.round(Math.random() * (5 - 0) + 0);

    for (let i = 1; i < numOfWilds; i++) {
        arr[i][Math.round(Math.random() * (4 - 1) + 1)] = wild;
    }
}


function addBottleFS(num) {
    switch (num) {
        case 3:
            for (let k = 1; k < 4; k++) {
                arr[4][k] = wild;
            }
        case 2:
            for (let k = 1; k < 4; k++) {
                arr[2][k] = wild;
            }
        case 1:
            for (let k = 1; k < 4; k++) {
                arr[0][k] = wild;
            }
            break;
        default: {
            break;
        }
    }
}

function changeWildsToBottles(num) {
    let green = 9;
    let orange = 12;
    let cherry = 15;
    switch (num) {
        case 3:
            for (let k = 1; k < 4; k++) {
                arr[4][k] = orange++;
            }
        case 2:
            for (let k = 1; k < 4; k++) {
                arr[2][k] = cherry++;
            }
        case 1:
            for (let k = 1; k < 4; k++) {
                arr[0][k] = green++;
            }
            break;
        default: {
            break;
        }
    }
}

let numOfSpins = 0;
let nextMode = 'root';
let currentMode = 'root';
let numOfBottles;
let fsBonus = {
    CountFS: numOfSpins,
    Level: 0,
    Multi: numOfBottles,
    TotalFSWinCentes: 0,
    TotalFSWinCoins: 0
};
function checkForFs() {
    let goFs = (Math.round(Math.random() * (1000 - 0) + 1) > 100) ? true : false;
    if (goFs) {
        numOfBottles = Math.round(Math.random() * (3 - 1) + 1);
        numOfSpins = 5;
        nextMode = 'fsBonus';
    } else {
        nextMode = 'root';
    }
}

console.log(wins);
let betLevel = 1;
let coinValue = 2;
// в копейках
let money = 50000;
let totalWin = 0;

function generateRoot() {
    generateArray();
    addWilds();
    checkForWinLines();
    return {
        Balance: {
            BetLevel: betLevel,
            CoinValue: coinValue,
            Currency: 'USD',
            ScoreCents: money,
            ScoreCons: money / coinValue,
            TotalWiNCents: totalWin,
            TotalWinCoins: totalWin / coinValue
        },
        FreeSpinsLeft: numOfSpins,
        FreeSpinsWin: 0,
        FsBonus: null,
        LinesCount: combLines,
        Mode: currentMode,
        NextMode: nextMode,
        Screen: arr,
        WinLines: wins
    };
}

function generateCandyFs() {
    generateArray();
    addBottleFS(numOfBottles);
    checkForWinLines();
    changeWildsToBottles(numOfBottles);
}

function generateFs() {
    switch (game) {
        case 'candyLand': generateCandyFs();
            break;
        default:
            break;
    }

    return {
        Balance: {
            BetLevel: betLevel,
            CoinValue: coinValue,
            Currency: 'USD',
            ScoreCents: money,
            ScoreCons: money / coinValue,
            TotalWiNCents: totalWin,
            TotalWinCoins: totalWin / coinValue
        },
        FreeSpinsLeft: numOfSpins,
        FreeSpinsWin: 0,
        FsBonus: fsBonus,
        LinesCount: combLines,
        Mode: currentMode,
        NextMode: nextMode,
        Screen: arr,
        WinLines: wins
    };
}

function generateInit() {
    generateArray();
    addWilds();
    return {
        Balance: {
            BetLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            CoinValue: [1, 2, 5, 10, 20, 50, 100],
            Currency: 'USD',
            ScoreCents: 500000,
            ScoreCoins: 500000
        },
        FirstScreen: arr,
        Lines: lines,
        Modes: Modes[game],
        Saved: null,
        SessionID: 753,
        Symbols: Symbols[game]
    };
}

function returnParams(mode) {
    switch (mode) {
        case 'root':
            console.log(generateRoot());
            break;
        case 'fsBonus':
            console.log(generateFs());
            break;
        case 'init':
            console.log(generateInit());
            break;
        default: {
            console.log('Uncorrect mode');
        }
    }
}

function request(reqMode) {
    switch (reqMode) {
        case 'init':
            returnParams('init');
            break;
        case 'roll':
            currentMode = nextMode;
            if (numOfSpins > 0) {
                returnParams('fsBonus');
                numOfSpins--;
                if (numOfSpins === 0) {
                    nextMode = 'root';
                }
            }
            if (numOfSpins <= 0) {
                checkForFs();
                returnParams('root');
            }
            break;
        case 'ready':
            console.log('123');

            break;
        default: console.log('Undefined request');
            break;
    }
}

let button = document.createElement('button');
button.innerHTML = 'Request';

let input = document.createElement('input');

let body = document.getElementsByTagName('body')[0];
body.appendChild(button);
body.appendChild(input);

button.addEventListener('click', () => {
    request(document.querySelector('input').value);
});
