import { model } from 'modules/Model/Model';

export let noConnect = {
    fsLength: 3,

    Initialise: {
        Balance: {
            BetLevel: [1,2,3,4,5,6,7,8,9,10],
            CoinValue: [1,2,5,10,20,50,100],
            Currency: 'USD',
            ScoreCents: 12797167,
            ScoreCoins: 12797167
        },
        FirstScreen: [
            [1,2,7,2,3],
            [1,2,7,2,3],
            [1,2,7,2,3],
            [1,2,7,2,3],
            [1,2,7,2,3]
        ],
        Lines: JSON.parse('[[{"X":0,"Y":1},{"X":1,"Y":1},{"X":2,"Y":1},{"X":3,"Y":1},{"X":4,"Y":1}],[{"X":0,"Y":0},{"X":1,"Y":0},{"X":2,"Y":0},{"X":3,"Y":0},{"X":4,"Y":0}],[{"X":0,"Y":2},{"X":1,"Y":2},{"X":2,"Y":2},{"X":3,"Y":2},{"X":4,"Y":2}],[{"X":0,"Y":0},{"X":1,"Y":1},{"X":2,"Y":2},{"X":3,"Y":1},{"X":4,"Y":0}],[{"X":0,"Y":2},{"X":1,"Y":1},{"X":2,"Y":0},{"X":3,"Y":1},{"X":4,"Y":2}],[{"X":0,"Y":0},{"X":1,"Y":0},{"X":2,"Y":1},{"X":3,"Y":0},{"X":4,"Y":0}],[{"X":0,"Y":2},{"X":1,"Y":2},{"X":2,"Y":1},{"X":3,"Y":2},{"X":4,"Y":2}],[{"X":0,"Y":1},{"X":1,"Y":0},{"X":2,"Y":0},{"X":3,"Y":0},{"X":4,"Y":1}],[{"X":0,"Y":1},{"X":1,"Y":2},{"X":2,"Y":2},{"X":3,"Y":2},{"X":4,"Y":1}],[{"X":0,"Y":2},{"X":1,"Y":1},{"X":2,"Y":1},{"X":3,"Y":1},{"X":4,"Y":2}]]'),
        Modes: [
            'root',
            'doors2',
            'fsBonus'
        ],
        Saved: null,
        SessionID: 53,
        Symbols: JSON.stringify('[{"Name":"Jack","Symbol":"1"},{"Name":"Queen","Symbol":"3"},{"Name":"King","Symbol":"5"},{"Name":"Ace","Symbol":"7"},{"Name":"Cherries","Symbol":"2"},{"Name":"Grave","Symbol":"4"},{"Name":"Martini","Symbol":"6"},{"Name":"Watermelon","Symbol":"8"},{"Name":"Skull","Symbol":"9"},{"Name":"Axe","Symbol":"10"},{"Name":"Evilbrain","Symbol":"11"}]')
    },

    _Roll: {
        get goFS() {
            this.fs._fsCount = noConnect.fsLength;
            this.fs._fsLevel = 0;
            this.fs._fsMulti = 2;
            return {
                Balance: {
                    BetLevel: 1,
                    CoinValue: 1,
                    Currency: 'USD',
                    ScoreCents: 12797167,
                    ScoreCoins: 12797167,
                    TotalWinCents: 40,
                    TotalWinCoins: 40
                },
                FreeSpinsLeft: this.fs._fsCount,
                FreeSpinsWin: this.fs._fsCount,
                FsBonus: null,
                LinesCount: 10,
                Mode: 'root',
                NextMode: 'fsBonus',
                Screen: [
                    [ 5, 5, 2, 3, 7],
                    [10, 7,10, 2, 3],
                    [ 3,10, 1,10, 6],
                    [ 8, 5, 2, 1, 2],
                    [ 6, 2, 3, 3, 1]
                ],
                WinLines: [{
                    Count: 4,
                    Line: -1,
                    Name: 'Axe',
                    Symbol: '10',
                    Win: 40
                }]
            }
        },
        get win() {
            return {
                Balance: {
                    BetLevel: 1,
                    CoinValue: 1,
                    Currency: 'USD',
                    ScoreCents: 12797167,
                    ScoreCoins: 12797167,
                    TotalWinCents: 48,
                    TotalWinCoins: 48
                },
                FreeSpinsLeft: 0,
                FreeSpinsWin: 0,
                FsBonus: null,
                LinesCount: 10,
                Mode: 'root',
                NextMode: 'root',
                Screen: [
                    [ 3, 5, 2, 1, 2],
                    [ 8, 3, 1, 5, 5],
                    [ 6, 9, 6, 2, 3],
                    [ 1, 4, 7, 7,10],
                    [ 3, 6, 8,10, 5]
                ],
                WinLines: [{
                    Count: 3,
                    Line: 1,
                    Name: 'Martini',
                    Symbol: '6',
                    Win: 25
                }, {
                    Count: 2,
                    Line: 4,
                    Name: 'Watermelon',
                    Symbol: '8',
                    Win: 20
                }, {
                    Count: 3,
                    Line: 5,
                    Name: 'Jack',
                    Symbol: '1',
                    Win: 3
                }]
            }
        },
        get winAxes() {
            return {
                Balance: {
                    BetLevel: 1,
                    CoinValue: 1,
                    Currency: 'USD',
                    ScoreCents: 12797167,
                    ScoreCoins: 12797167,
                    TotalWinCents: 48,
                    TotalWinCoins: 48
                },
                FreeSpinsLeft: 0,
                FreeSpinsWin: 0,
                FsBonus: null,
                LinesCount: 10,
                Mode: 'root',
                NextMode: 'root',
                Screen: [
                    [ 3, 5, 2, 1, 2],
                    [ 8, 3, 10, 5, 5],
                    [ 6, 9, 6, 2, 3],
                    [ 1, 4, 7, 10, 7],
                    [ 3, 6, 8, 10, 5]
                ],
                WinLines: [{
                    Count: 2,
                    Line: -1,
                    Name: 'Axes',
                    Symbol: '10',
                    Win: 20
                }, {
                    Count: 2,
                    Line: 4,
                    Name: 'Watermelon',
                    Symbol: '8',
                    Win: 20
                }, {
                    Count: 3,
                    Line: 5,
                    Name: 'Jack',
                    Symbol: '1',
                    Win: 3
                }]
            }
        },
        fs: {
            _fsCount: 0,
            _fsLevel: 0,
            _fsMulti: 2,

            get zero() {
                --this._fsCount;
                let nextMode = (this._fsCount === 0) ? 'root' : 'fsBonus';
                return {
                    Balance: {
                        BetLevel: 1,
                        CoinValue: 1,
                        Currency: 'USD',
                        ScoreCents: 12797167,
                        ScoreCoins: 12797167,
                        TotalWinCents: 0,
                        TotalWinCoins: 0
                    },
                    FreeSpinsLeft: this._fsCount,
                    FreeSpinsWin: 0,
                    FsBonus: {
                        CountFS: this._fsCount,
                        Level: this._fsLevel,
                        Multi: this._fsMulti,
                        TotalWinCents: 199,
                        TotalWinCoins: 199
                    },
                    LinesCount: 10,
                    Mode: 'fsBonus',
                    NextMode: nextMode,
                    Screen: [
                        [ 5, 5, 2, 3, 7],
                        [10, 7,10, 2, 3],
                        [ 3,10, 1,10, 6],
                        [ 8, 5, 2, 1, 2],
                        [ 6, 2, 3, 3, 1]
                    ],
                    WinLines: [{
                        Count: 4,
                        Line: -1,
                        Name: 'Axe',
                        Symbol: '10',
                        Win: 40
                    }]
                }
            },
            get scatter() {
                --this._fsCount;
                let nextMode = (this._fsCount === 0) ? 'root' : 'fsBonus';
                ++this._fsLevel;
                this._fsMulti = 2 + parseInt(this._fsLevel / 3);
                return {
                    Balance: {
                        BetLevel: 1,
                        CoinValue: 1,
                        Currency: 'USD',
                        ScoreCents: 12797167,
                        ScoreCoins: 12797167,
                        TotalWinCents: 8,
                        TotalWinCoins: 8
                    },
                    FreeSpinsLeft: this._fsCount,
                    FreeSpinsWin: 0,
                    FsBonus: {
                        CountFS: this._fsCount,
                        Level: this._fsLevel,
                        Multi: this._fsMulti,
                        TotalWinCents: 8,
                        TotalWinCoins: 8
                    },
                    LinesCount: 10,
                    Mode: 'fsBonus',
                    NextMode: nextMode,
                    Screen: [
                        [ 3, 1, 5, 3,11],
                        [ 1, 7,11, 5, 1],
                        [ 5, 3, 3, 1, 5],
                        [ 3, 1, 1,11, 3],
                        [ 1, 2, 5, 4, 7]
                    ],
                    WinLines: [{
                        Count: 3,
                        Line: 10,
                        Name: 'Queen',
                        Symbol: '3',
                        Win: 4
                    }, {
                        Count: 2,
                        Line: -1,
                        Name: 'Evilbrain',
                        Symbol: '11',
                        Win: 0
                    }]
                }
            }
        }
    },
    get Roll() {
        if (model.state('FSMode')) {
            return this._Roll.fs.scatter;
        }
        return this._Roll.winAxes;
    },

    Ready: {
        ErrorCode: 0,
        ErrorDescription: '',
        ErrorMessage: 'None'
    }
};
