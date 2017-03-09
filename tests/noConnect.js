let arr = [[], [], [], [], []];
let min = 1;
let max = 7;
let wild = 8;
let combLines = 10;
let initObject = {};
let rollObject = {};
let winComb = [[2, 2, 2, 2, 2], [3, 3, 3, 3, 3], [1, 1, 1, 1, 1], [3, 2, 1, 2, 3], [1, 2, 3, 2, 1], [3, 3, 2, 3, 3], [1, 1, 2, 3, 3], [2, 3, 3, 3, 2], [2, 1, 1, 1, 2], [1, 2, 2, 2, 1], [3, 2, 2, 2, 3], [3, 2, 2, 2, 1], [1, 2, 2, 2, 3], [3, 3, 2, 1, 1], [1, 1, 2, 3, 3], [3, 3, 3, 2, 1], [1, 1, 1, 2, 3], [3, 2, 1, 1, 1], [1, 2, 3, 3, 3], [2, 2, 1, 2, 2], [2, 2, 3, 2, 2]];
let lines =
    [[{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 1}],
    [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 1}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 1}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 1}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 1}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 1}],
    [{X: 0, Y: 1}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 1}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 2}]];
let wins = {};
let Modes = {
    Chibi: ['root', 'fsBonus1', 'shuriken1', 'shuriken2', 'shuriken3', 'shuriken4', 'shuriken5'],
    GoldSea: []
};

let Symbols = {
    Chibi: [{Name: 'Jack', Symbol: '1'}, {Name: 'Queen', Symbol: '3'}, {Name: 'King', Symbol: '5'},
    {Name: 'Ace', Symbol: '7'}, {Name: 'Warrior', Symbol: '2'}, {Name: 'Ninja', Symbol: '4'},
    {Name: 'Samurai', Symbol: '6'}, {Name: 'Geisha', Symbol: '8'}, {Name: 'Wild', Symbol: '9'},
    {Name: 'Scatter', Symbol: '10'}, {Name: 'fsScatter', Symbol: '11'}, {Name: 'Shuriken', Symbol: '12'}]
};


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
            wins[`line${k + 1}`] = win;
        }
    }
}

function addWilds() {
    let numOfWild = Math.round(Math.random() * (5 - 0) + 0);

    for (let i = 1; i < numOfWild; i++) {
        arr[i][Math.round(Math.random() * (4 - 1) + 1)] = wild;
    }
}

generateArray();
addWilds();
logMatrix();
checkForWinLines();

console.log(wins);

initObject = {
    Balance: {
        BetLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        CoinValue: [1, 2, 5, 10, 20, 50, 100],
        Currency: 'USD',
        ScoreCents: 500000,
        ScoreCons: 500000
    },
    FirstScreen: arr,
    Lines: lines,
    Modes: Modes.Chibi,
    Saved: null,
    SessionID: 753,
    Symbols: Symbols.Chibi
};

rollObject = {
    Balance: {
        BetLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        CoinValue: [1, 2, 5, 10, 20, 50, 100],
        Currency: 'USD',
        ScoreCents: 500000,
        ScoreCons: 500000
    },
    FreeSpinsLeft: 0,
    FreeSpinsWin: 0,
    FsBonus: null,
    LinesCouns: combLines,
    Mode: 'root',
    NextMode: 'root',
    Screen: arr,
    WinLines: []
};
