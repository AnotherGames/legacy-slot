// import { config } from 'config';
const mongoose = require('mongoose');

let config = {
    Chibi: {
        Modes: ['root', 'fsBonus1', 'shuriken1', 'shuriken2', 'shuriken3', 'shuriken4', 'shuriken5'],
        Symbols: [
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
        SymbolValue: {
            '1': [0, 0, 3, 5, 10],
            '2': [0, 0, 25, 50, 100],
            '3': [0, 0, 5, 10, 25],
            '4': [0, 0, 50, 100, 200],
            '5': [0, 0, 10, 15, 35],
            '6': [0, 0, 100, 200, 500],
            '7': [0, 0, 10, 25, 50],
            '8': [0, 0, 200, 500, 1000]},
        WildSymbol: 9,
        WildSymbolPercent: [
            {Name: 0, Percent: 10},
            {Name: 1, Percent: 20},
            {Name: 2, Percent: 20},
            {Name: 3, Percent: 20},
            {Name: 4, Percent: 20},
            {Name: 5, Percent: 10}
        ],
        NormalSymbolPercent: [
            {Name: 1, Percent: 8},
            {Name: 2, Percent: 18},
            {Name: 3, Percent: 8},
            {Name: 4, Percent: 16},
            {Name: 5, Percent: 18},
            {Name: 6, Percent: 4},
            {Name: 7, Percent: 18},
            {Name: 8, Percent: 10}
        ],
        WinLines: 10,
        BetLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        CoinValue: [1, 2, 5, 10, 20, 50, 100]
    },

    winCombinations: [
        [2, 2, 2, 2, 2],
        [3, 3, 3, 3, 3],
        [1, 1, 1, 1, 1],
        [3, 2, 1, 2, 3],
        [1, 2, 3, 2, 1],
        [3, 3, 2, 3, 3],
        [1, 1, 2, 3, 3],
        [2, 3, 3, 3, 2],
        [2, 1, 1, 1, 2],
        [1, 2, 2, 2, 1],
        [3, 2, 2, 2, 3],
        [3, 2, 2, 2, 1],
        [1, 2, 2, 2, 3],
        [3, 3, 2, 1, 1],
        [1, 1, 2, 3, 3],
        [3, 3, 3, 2, 1],
        [1, 1, 1, 2, 3],
        [3, 2, 1, 1, 1],
        [1, 2, 3, 3, 3],
        [2, 2, 1, 2, 2],
        [2, 2, 3, 2, 2]
    ],

    CandyLand: {
        Modes: ['root', 'fsBonus1', 'fsBonus2', 'fsBonus3', 'fsBonus4', 'fsBonus5', 'fsBonus6', 'fsBonus7'],
        Symbols: [
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
        ],
        SymbolValue: {
            '1': [3, 5, 10],
            '2': [25, 50, 100],
            '3': [5, 10, 25],
            '4': [50, 100, 200],
            '5': [10, 15, 35],
            '6': [100, 200, 500],
            '7': [10, 25, 50],
            '8': [200, 500, 1000]},
        WildSymbol: 9,
        MinSymbol: 1,
        MaxSymbol: 8
    }
};

class Connect {
    constructor(game) {
        this.game = game;
        this.finalScreen = [[], [], [], [], []];
        this.modes = config[game].Modes;
        this.symbols = config[game].Symbols;
        this.symbolValue = config[game].SymbolValue;
        this.wildSymbol = config[game].WildSymbol;
        this.wildSymbolPercent = config[game].WildSymbolPercent;
        this.normalSymbolPercent = config[game].NormalSymbolPercent;
        this.betLevel = config[game].BetLevel;
        this.coinValue = config[game].CoinValue;
        this.winLines = config[game].WinLines;
        this.winCombinations = config.winCombinations.filter((comb, index) => index < this.winLines);
    }

    intRandom(end, start = 0) {
        return Math.round(Math.random() * (end - start) + start);
    }

    logMatrix(array) {
        for ( let i = 0; i < 5; i++) {
            console.log(`${array[i][0]} ${array[i][1]} ${array[i][2]} ${array[i][3]} ${array[i][4]}`);
        }
    }

    getRandomElem(array) {
        let random = Math.random();
        for (let i = 0; i < array.length; i++) {
            array[i].Percent /= 100;
        }
        let sumPercent = 0;
        for (let i = 0; i < array.length; i++) {
            sumPercent += array[i].Percent;
        }

        if (sumPercent > 1) {
            console.error(`Too much percents in your config. ${sumPercent * 100} of 100`);
        }
        let currentPercent = 0;

        for (let i = 0; i < array.length; i++) {
            if (currentPercent === sumPercent) {
                break;
            }
            let value = array[i].Percent;

            if (random > currentPercent && random < currentPercent + value) {
                for (let i = 0; i < array.length; i++) {
                    array[i].Percent *= 100;
                }
                return array[i].Name;
            } else {
                currentPercent += value;
            }
        }
    }

    changePercent(array, position, percent) {
        let delta = array[position].Percent - percent;
        array[position].Percent = percent;

        let sumPercent = 0;
        for (let i = 0; i < array.length; i++) {
            if (i === position) {
                continue;
            }
            sumPercent += array[i].Percent;
        }

        let arrOfP = [];
        let remainP = 1;
        for (let i = 0; i < array.length; i++) {
            if (i === position) {
                continue;
            }

            if (i === array.length - 1) {
                arrOfP[i] = remainP;
            }

            arrOfP[i] = array[i].Percent / sumPercent;
            remainP -= arrOfP[i].Percent;
        }

        sumPercent += delta;
        let remain;
        for (let i = 0; i < arrOfP.length; i++) {
            if (i === position) {
                continue;
            }

            if (i === array.length - 1) {
                array[i].Percent = remain;
            }

            array[i].Percent = sumPercent * arrOfP[i];
            remain = sumPercent - array[i].Percent;
        }
    }

    fiveWildInLine() {
        let wildsInLine = 0;
        for (let k = 0; k < this.winLines; k++) {
            for (let i = 0; i < 5; i++) {
                if (this.finalScreen[i][this.winCombinations[k][i]] === this.wildSymbol) {
                    wildsInLine++;
                }
            }
            if (wildsInLine === 5) {
                return true;
            } else {
                wildsInLine = 0;
            }
        }
    }

    addWildsInArray(numOfWilds) {
        while (numOfWilds) {
            let randomX = this.intRandom(4, 1);
            let randomY = this.intRandom(4, 1);
            let elem = this.finalScreen[randomX][randomY];

            if (elem) {
                continue;
            } else {
                elem = this.wildSymbol;
                if (this.fiveWildInLine()) {
                    elem = undefined;
                } else {
                    --numOfWilds;
                }
            }
        }
    }

    addWildsOrNot() {
        let numberOfWilds = this.getRandomElem(this.wildSymbolPercent);
        if (numberOfWilds === 0) {
            return;
        } else {
            this.addWildsInArray(numberOfWilds);
        }
    }

    addNormalSymbols() {
        for (let i = 0; i < 5; i++) {
            for (let k = 0; k < 5; k++) {
                if (this.finalScreen[i][k]) {
                    continue;
                } else {
                    this.finalScreen[i][k] = +this.getRandomElem(this.normalSymbolPercent);
                }
            }
        }
    }

    firstNumberInWinLine(combinationArray) {
        for (let i = 0; i < 5; i++) {
            let elem = this.finalScreen[i][combinationArray[i]];
            if (elem !== this.wildSymbol) {
                return elem;
            }
        }
    }

    checkForWinLines() {
        let winCounter = 0;
        this.wins = [];
        this.totalWin = 0;
        for (let k = 0; k < this.winLines; k++) {
            let win = 0;

            let winNumber = this.firstNumberInWinLine(this.winCombinations[k]);
            for (let i = 0; i < 5; i++) {
                let numberFromCombination = this.winCombinations[k][i];
                let elementInScreen = this.finalScreen[i][numberFromCombination];
                if (elementInScreen === winNumber || elementInScreen === this.wildSymbol) {
                    win++;
                } else {
                    break;
                }
            }

            if (win > 2) {
                let currentSymbolValue = this.symbolValue[winNumber][win - 1];
                let winValue = currentSymbolValue * this.betLevel;
                let symbolName = this.symbols[+winNumber - 1].Name;
                this.wins[winCounter] = {
                    Count: win,
                    Line: k + 1,
                    Name: symbolName,
                    Symbol: winNumber,
                    Win: winValue
                };
                this.totalWin += winValue;
                winCounter++;
            }
        }
    }

    generateAnswer() {
        return {
            Balance: {
                BetLevel: this.betLevel,
                CoinValue: this.coinValue,
                Currency: this.currency, // server
                ScoreCents: this.money,
                ScoreCoins: this.money / this.coinValue,
                TotalWiNCents: this.totalWin,
                TotalWinCoins: this.totalWin / this.coinValue
            },
            FreeSpinsLeft: 0,
            FreeSpinsWin: 0,
            FsBonus: null,
            LinesCount: this.winLines,
            Mode: this.currentMode,
            NextMode: this.nextMode,
            Screen: this.finalScreen,
            WinLines: this.wins
        };
    }

    generateFs() {
        switch (this.game) {
            case 'candyLand': this.generateCandyFs();
                break;
            case 'chibi': this.generateChibiFs();
                break;
            default:
                break;
        }

        return this.generateAnswer();
    }

    connectToDB() {
        mongoose.connect('mongodb://honey:nohoney@ds143340.mlab.com:43340/nomoneynohoney');
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('connected');
            // we're connected!
        });
        let balanceSchema = mongoose.Schema({
            currentBalance: Number,
            currency: String,
            sessionID: Number
        });
        let Balance = mongoose.model('Balance', balanceSchema);
        let initBalance = new Balance({
            currentBalance: 5000,
            currency: '$',
            sessionID: generateSessionID()
        });
        // initBalance.save((err, init) => {
        //     if (err) return console.error('Wrong init');
        //     console.log('Init Balance saved', init);
        // });
        Balance.find({sessionID: 207693}, (err, init) => {
            return init;
        });
    }

    getInitialize() {
        this.addNormalSymbols();
        // this.init = this.connectToDB();
        // console.log(this.init.currency);
        this.betLevel = 1;
        this.coinValue = 1;
        this.currency = '$';
        this.money = 5000000;
        return {
            Balance: {
                BetLevel: this.betLevel, //server
                CoinValue: this.coinValue, //server
                Currency: this.currency, // server
                ScoreCents: this.money, // server
                ScoreCoins: this.money / this.coinValue
            },
            FirstScreen: this.finalScreen,
            Lines: this.winLines,
            Modes: config[this.game].Modes,
            Saved: null, // TODO session recovery
            SessionID: 753,
            Symbols: config[this.game].Symbols
        };
    }

    getRoll(bet) {
        this.betLevel = bet;
        this.finalScreen = [[],[],[],[],[]];
        this.money -= this.betLevel * this.winLines;
        this.addWildsOrNot();
        this.addNormalSymbols();
        this.checkForWinLines();
        this.money += this.totalWin;

        // return this.generateAnswer();
    }
    // request(rGame, rMode, rBetLevel, rCoinValue) {
    //     game = rGame;
    //     betLevel = rBetLevel;
    //     coinValue = rCoinValue;
    //     let answer;
    //     switch (rMode) {
    //         case 'init':
    //         // money = 500000;
    //             answer = this.generateInit();
    //             break;
    //         case 'roll':
    //             currentMode = nextMode;
    //             if (numOfSpins > 0) {
    //                 answer = this.generateFs();
    //                 numOfSpins--;
    //                 if (numOfSpins === 0) {
    //                     nextMode = 'root';
    //                 }
    //             }
    //             if (numOfSpins <= 0) {
    //                 checkForFs();
    //                 answer = this.generateRoot();
    //             }
    //             break;
    //         case 'ready':
    //             answer = 'ready';
    //
    //             break;
    //         default: answer = 'Undefined request';
    //             break;
    //     }
    //
    //     return answer;
    // }

}
let timer;
console.time(timer);
let chibi = new Connect('Chibi');
chibi.getInitialize();
for(let i = 0; i < 100000; i++){
    chibi.getRoll(chibi.intRandom(10, 1));
}
console.timeEnd(timer);
// console.log(chibi.generateAnswer());
console.log(chibi.money / 5000000 * 100);
