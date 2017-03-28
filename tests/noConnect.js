const mongoose = require('mongoose');

let noConnect = (function() {

    let arr = [[], [], [], [], []];
    let min = 1;
    let game = 'candyLand';
    let max = 8;
    let wild = 9;
    let numberOfLines = 10;
    let initObject = {};
    let rollObject = {};
    let winComb = [[2, 2, 2, 2, 2], [3, 3, 3, 3, 3], [1, 1, 1, 1, 1], [3, 2, 1, 2, 3], [1, 2, 3, 2, 1], [3, 3, 2, 3, 3], [1, 1, 2, 3, 3], [2, 3, 3, 3, 2], [2, 1, 1, 1, 2], [1, 2, 2, 2, 1], [3, 2, 2, 2, 3], [3, 2, 2, 2, 1], [1, 2, 2, 2, 3], [3, 3, 2, 1, 1], [1, 1, 2, 3, 3], [3, 3, 3, 2, 1], [1, 1, 1, 2, 3], [3, 2, 1, 1, 1], [1, 2, 3, 3, 3], [2, 2, 1, 2, 2], [2, 2, 3, 2, 2]];

    let lines = [
    [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 1}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 1}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 1}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 1}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 1}],
    [{X: 0, Y: 1}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 1}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 2}],
    [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 0}],
    [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 2}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 0}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 1}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 1}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 2}],
    [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 0}],
    [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 2}],
    [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 0}],
    [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}],
    [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 1}]
    ];

    let wins = [];
    let Modes = {
        chibi: ['root', 'fsBonus1', 'shuriken1', 'shuriken2', 'shuriken3', 'shuriken4', 'shuriken5'],
        goldSea: [],
        candyLand: ['root', 'fsBonus1', 'fsBonus2', 'fsBonus3', 'fsBonus4', 'fsBonus5', 'fsBonus6', 'fsBonus7']
    };

    let Symbols = {
        chibi:
            [
                {Name: 'Jack', Symbol: '1'},
                {Name: 'Warrior', Symbol: '2'},
                {Name: 'Queen', Symbol: '3'},
                {Name: 'Ninja', Symbol: '4'},
                {Name: 'King', Symbol: '5'},
                {Name: 'Samurai', Symbol: '6'},
                {Name: 'Ace', Symbol: '7'},
                {Name: 'Geisha', Symbol: '8'},
                {Name: 'Wild', Symbol: '9'},
                {Name: 'Scatter', Symbol: '10'},
                {Name: 'fsScatter', Symbol: '11'},
                {Name: 'Shuriken', Symbol: '12'}
            ],

        candyLand:
            [
                {Name: 'Jack', Symbol: '1'},
                {Name: 'CandyCane', Symbol: '2'},
                {Name: 'Queen', Symbol: '3'},
                {Name: 'Lollypop', Symbol: '4'},
                {Name: 'King', Symbol: '5'},
                {Name: 'Icecream', Symbol: '6'},
                {Name: 'Ace', Symbol: '7'},
                {Name: 'Donut', Symbol: '8'},
                {Name: 'GreenBottleTop', Symbol: '9'},
                {Name: 'GreenBottleMid', Symbol: '10'},
                {Name: 'GreenBottleBottom', Symbol: '11'},
                {Name: 'OrangeBottleTop', Symbol: '12'},
                {Name: 'OrangeBottleMid', Symbol: '13'},
                {Name: 'OrangeBottleBottom', Symbol: '14'},
                {Name: 'CherryBottleTop', Symbol: '15'},
                {Name: 'CherryBottleMid', Symbol: '16'},
                {Name: 'CherryBottleBottom', Symbol: '17'},
                {Name: 'fsWild', Symbol: '21'}
            ]
    };

    let SymbolsValue = {
        candyLand: {
            '1': [3, 5, 10],
            '2': [25, 50, 100],
            '3': [5, 10, 25],
            '4': [50, 100, 200],
            '5': [10, 15, 35],
            '6': [100, 200, 500],
            '7': [10, 25, 50],
            '8': [200, 500, 1000]}
    };

    function intRandom(end, start = 0) {
        return Math.round(Math.random() * (end - start) + start);
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    let someArr = [{'1':18}, {'2': 9}, {'3': 15}, {'4': 9}, {'5': 15}, {'6': 9}, {'7': 15}, {'8': 9}];

    function generateArray() {
        for (let i = 0; i < 5; i++) {
            for (let k = 0; k < 5; k++) {
                if(arr[i][k]){
                    continue;
                } else {
                    arr[i][k] = +getRandomElem(someArr);
                }
            }
        }
    }

    function logMatrix() {
        for ( let i = 0; i < 5; i++) {
            console.log(`${arr[i][0]} ${arr[i][1]} ${arr[i][2]} ${arr[i][3]} ${arr[i][4]}`);
        }
    }

    function firstNumberInWinLine(arrComb) {
        for (let k = 0; k < 5; k++) {
            for (let i = 0; i < 5; i++) {
                if (arr[k][arrComb[i]] !== wild) {
                    return arr[k][arrComb[i]];
                }
            }
        }
    }

    function checkForWinLines() {
        let numinWins = 0;
        for (let k = 0; k < numberOfLines; k++) {
            let win = 0;
            let winNumber = firstNumberInWinLine(winComb[k]);

                for (let i = 0; i < 5; i++) {
                    if (arr[i][winComb[k][i]] === winNumber || arr[i][winComb[k][i]] === wild) {
                        win++;
                    } else {
                        break;
                    }
            }

            if (win > 2) {
                let symbolValue = SymbolsValue[game][winNumber][win - 3];
                let winValue = symbolValue * betLevel;
                let symbolName = Symbols[game][winNumber].Name;
                wins[numinWins] = {
                    Count: win,
                    Line: k + 1,
                    Name: symbolName,
                    Symbol: winNumber,
                    Win: winValue
                };
                money += winValue;
                numinWins++;
            }
        }
    }

    let chanceArray = [40, 9, 20 ,30 ,1];
    function setPercent(position, number) {
        let delta = chanceArray[position] - number;
        chanceArray[position] = number;

        let sum = 0;
        for(let i = 0; i < chanceArray.length; i++){
            if (i == position) continue;
            sum += chanceArray[i];
        }
        let arrOfP = [];
        let remainP = 1;
        for(let i = 0; i < chanceArray.length; i++){
            if (i == position) continue;
            if (i == chanceArray.length - 1) {
                arrOfP[i] = remainP;
            }
            arrOfP[i] = chanceArray[i] / sum;
            remainP -= arrOfP[i];
        }
        sum += delta;
        let remain;
        for(let i = 0; i < arrOfP.length; i++){
            if (i == position) continue;
            if (i == chanceArray.length - 1) {
                chanceArray[i] = remain;
            }
            chanceArray[i] = sum * arrOfP[i];
            remain = sum - chanceArray[i];
        }
    }



    function getRandomElem(array) {
        let sortedArray = array;
        let random = Math.random();

        for (let i = 0; i < sortedArray.length; i++) {
            sortedArray[i][Object.keys(sortedArray[i])[0]] /= 100;
        }
        let percentInArr = 0;
        for (let i = 0; i < sortedArray.length; i++) {
            percentInArr += sortedArray[i][Object.keys(sortedArray[i])[0]];
        }

        if(percentInArr > 1) {
            console.error(`Too much percents in your config. ${percentInArr * 100} at least of 100`);
        }

        let percent = 0;
        for (let i = 0; i < sortedArray.length; i++){
            if (percent === percentInArr) break;

            let value = sortedArray[i][Object.keys(sortedArray[i])[0]];
            if (random > percent && random < percent + value) {
                for (let i = 0; i < sortedArray.length; i++) {
                    sortedArray[i][Object.keys(sortedArray[i])[0]] *= 100;
                }
                return Object.keys(sortedArray[i])[0];
            } else {
                percent += value;
            }
        }
    }


    function addWildsOrNot() {
        let wildChance = intRandom(100);
        if(wildChance < 80) {
            return;
        }
        if(wildChance >= 80 && wildChance < 86) {
            addWildsInArray(1)
        }
        if(wildChance >= 86 && wildChance < 91) {
            addWildsInArray(2)
        }
        if(wildChance >= 91 && wildChance < 94) {
            addWildsInArray(3)
        }
        if(wildChance >= 95 && wildChance < 98) {
            addWildsInArray(4)
        }
        if(wildChance >= 98) {
            addWildsInArray(5)
        }

    }

    function addWildsInArray(numOfWilds) {
        while(numOfWilds) {
            let randomX = intRandom(4, 1);
            let randomY = intRandom(4, 1);
            let elem = arr[randomX][randomY];

            if(elem) {
            } else {
                elem = wild;
                --numOfWilds;
            }
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

    let sessionID;
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
        let goFs = (intRandom(1000) > 980);
        if (goFs) {
            let bottleChance = intRandom(100);
            if(bottleChance < 90) {
                numOfBottles = 1;
            }
            if(bottleChance >= 90 && bottleChance < 95) {
                numOfBottles = 2
            }
            if(bottleChance >= 95) {
                numOfBottles = 3;
            }
            numOfSpins = 7;
            nextMode = 'fsBonus';
        } else {
            nextMode = 'root';
        }
    }

    let betLevel = 1;
    let coinValue = 1;
    // в копейках
    let money = 1000000;
    let startmoney = 1000000;
    let totalWin = 0;

    function generateRoot() {
        money -= betLevel * numberOfLines;
        addWildsOrNot();
        generateArray();
        checkForWinLines();
        return {
            Balance: {
                BetLevel: betLevel,
                CoinValue: coinValue,
                Currency: 'USD',
                ScoreCents: money,
                ScoreCoins: money / coinValue,
                TotalWiNCents: totalWin,
                TotalWinCoins: totalWin / coinValue
            },
            FreeSpinsLeft: numOfSpins,
            FreeSpinsWin: 0,
            FsBonus: null,
            LinesCount: numberOfLines,
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
                ScoreCoins: money / coinValue,
                TotalWiNCents: totalWin,
                TotalWinCoins: totalWin / coinValue
            },
            FreeSpinsLeft: numOfSpins,
            FreeSpinsWin: 0,
            FsBonus: fsBonus,
            LinesCount: numberOfLines,
            Mode: currentMode,
            NextMode: nextMode,
            Screen: arr,
            WinLines: wins
        };
    }

    function generateSessionID() {
        return Math.round(Math.random() * 1000000);
    }

    function connectToDB() {
        mongoose.connect('mongodb://honey:nohoney@ds143340.mlab.com:43340/nomoneynohoney');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('connected');
            // we're connected!
        });
        var balanceSchema = mongoose.Schema({
            currentBalance: Number,
            currency: String,
            sessionID: Number
        });
        var Balance = mongoose.model('Balance', balanceSchema);
        let initBalance = new Balance({
            currentBalance: 5000,
            currency: '$',
            sessionID: generateSessionID()
        });
        initBalance.save((err, init) => {
            if (err) return console.error('Wrong init');
            console.log('Init Balance saved', init);
        });
    }

    function generateInit() {
        generateArray();
        connectToDB();
        console.log(money / startmoney * 100);
        return {
            Balance: {
                BetLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                CoinValue: [1, 2, 5, 10, 20, 50, 100],
                Currency: 'USD',
                ScoreCents: money,
                ScoreCoins: money / coinValue
            },
            FirstScreen: arr,
            Lines: numberOfLines,
            Modes: Modes[game],
            Saved: null,
            SessionID: 753,
            Symbols: Symbols[game]
        };
    }

    function returnParams(mode) {
        switch (mode) {
            case 'root':
                return generateRoot();
                break;
            case 'fsBonus':
                return generateFs();
                break;
            case 'init':
                return generateInit();
                break;
            default: {
                return 'Uncorrect mode';
            }
        }
    }

    function request(rGame, rMode, rBetLevel, rCoinValue) {
        game = rGame;
        betLevel = rBetLevel;
        coinValue = rCoinValue;
        let answer;
        switch (rMode) {
            case 'init':
            // money = 500000;
                answer = returnParams('init');
                break;
            case 'roll':
                currentMode = nextMode;
                if (numOfSpins > 0) {
                    answer = returnParams('fsBonus');
                    numOfSpins--;
                    if (numOfSpins === 0) {
                        nextMode = 'root';
                    }
                }
                if (numOfSpins <= 0) {
                    checkForFs();
                    answer = returnParams('root');
                }
                break;
            case 'ready':
                answer = 'ready';

                break;
            default: answer = 'Undefined request';
                break;
        }
        arr = [[], [], [], [], []];
        return answer;
    }

    // let button = document.createElement('button');
    // button.innerHTML = 'Request';

    // let input = document.createElement('input');
    // input.classList.add('requestValue')

    // let body = document.getElementsByTagName('body')[0];
    // body.appendChild(button);
    // body.appendChild(input);

    // button.addEventListener('click', () => {
    //     request(document.querySelector('requestValue').value);
    // });


    return {
        request
    };
})();

// for(let i = 0; i < 100000; i++) {
//     noConnect.request('candyLand', 'roll', 1, 1);
// }
console.log(noConnect.request('candyLand', 'init', 1, 1));



