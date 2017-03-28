import { config } from './config'

export class Connect {
    constructor(game) {
        this.finalScreen = [[], [], [], [], []];
        this.modes = config[game]['Modes'];
        this.symbols = config[game]['Symbols'];
        this.symbolValue = config[game]['SymbolValue'];
        this.wildSymbol = config[game]['WildSymbol'];
        this.wildSymbolPercent = config[game]['wildSymbolPercent'];
        this.normalSymbolPercent = config[game]['NormalSymbolPercent'];
        this.betLevel = config[game]['BetLevel'];
        this.coinValue = config[game]['CoinValue'];
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
            array[i]['Percent'] /= 100;
        }
        let sumPercent = 0;
        for (let i = 0; i < array.length; i++) {
            sumPercent += array[i]['Percent'];
        }

        if (sumPercent > 1) {
            console.error(`Too much percents in your config. ${sumPercent * 100} of 100`);
        }

        let currentPercent = 0;
        for (let i = 0; i < array.length; i++) {
            if (currentPercent === sumPercent) {
                break;
            }

            let value = array[i]['Name'];
            if (random > currentPercent && random < currentPercent + value) {
                return array[i]['Name'];
            } else {
                currentPercent += value;
            }
        }
    }

    changePercent(array, position, percent) {
        let delta = array[position]['Percent'] - percent;
        array[position]['Percent'] = percent;

        let sumPercent = 0;
        for (let i = 0; i < array.length; i++) {
            if (i === position) {
                continue;
            }
            sumPercent += array[i]['Percent'];
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

            arrOfP[i] = array[i]['Percent'] / sumPercent;
            remainP -= arrOfP[i]['Percent'];
        }

        sumPercent += delta;
        let remain;
        for (let i = 0; i < arrOfP.length; i++) {
            if (i === position) {
                continue;
            }

            if (i === array.length - 1) {
                array[i]['Percent'] = remain;
            }

            array[i]['Percent'] = sumPercent * arrOfP[i];
            remain = sumPercent - array[i]['Percent'];
        }
    }

    fiveWildInLine() {
        let wildsInLine = 0;
        for (let k = 0; k < this.winLines; k++) {
            for (let i = 0; i < 5; i++) {
                if (this.finalScreen[i][this.combinationArray[k][i]] === this.wildSymbol) {
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
                elem = wildSymbol;
                if(this.fiveWildInLine()) {
                    elem = undefined;
                } else {
                    --numOfWilds;
                }
            }
        }
    }

    addWildsOrNot() {
        let numberOfWilds = +this.getRandomElem(config.wildSymbolPercent);
        if (numberOfWilds === 0) {
            return;
        } else {
            addWildsInArray(numberOfWilds);
        }
    }

    addNormalSymbols(array) {
        for (let i = 0; i < 5; i++) {
            for (let k = 0; k < 5; k++) {
                if (array[i][k]) {
                    continue;
                } else {
                    array[i][k] = +this.getRandomElem(config.normalSymbolPercent);
                }
            }
        }
    }

    firstNumberInWinLine(combinationArray) {
        for (let i = 0; i < 5; i++) {
            let elem = this.finalScreen[i][combinationArray[i]];
            if (elem !== config.wildSymbol) {
                return elem;
            }
        }
    }

    checkForWinLines(numberOfLines) {
        let winCounter = 0;
        this.wins = [];
        for (let k = 0; k < numberOfLines; k++) {
            let win = 0;
            let winNumber = firstNumberInWinLine(this.arrayOfCombination[k]);

            for (let i = 0; i < 5; i++) {
                let numberFromCombination = this.arrayOfCombination[k][i];
                let elementInScreen = this.finalScreen[i][numberFromCombination]
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
                this.money += winValue;
                winCounter++;
            }
        }
    }

    generateInit() {
        // connectToDB();
        this.addNormalSymbols();
        return {
            Balance: {
                BetLevel: this.betLevel,
                CoinValue: this.coinValue,
                Currency: this.Currency, // server
                ScoreCents: this.money, //server
                ScoreCoins: this.money  // изначально money / coinValue но при ините coinvalue = 1
            },
            FirstScreen: this.finalScreen,
            Lines: this.numberOfLines,
            Modes: config[this.game]['Modes'],
            Saved: null, //TODO session recovery
            SessionID: 753,
            Symbols: config[this.game]['Symbols']
        };
    }

    generateRoot() {
        this.money -= betLevel * numberOfLines;
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
}
