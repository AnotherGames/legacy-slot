
export let config = {
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
            {Name: 0, Percent: 50},
            {Name: 1, Percent: 10},
            {Name: 2, Percent: 10},
            {Name: 3, Percent: 10},
            {Name: 4, Percent: 10},
            {Name: 5, Percent: 10}
        ],
        NormalSymbolPercent: [
            {Name: 1, Percent: 30},
            {Name: 2, Percent: 10},
            {Name: 3, Percent: 10},
            {Name: 4, Percent: 10},
            {Name: 5, Percent: 10},
            {Name: 6, Percent: 10},
            {Name: 7, Percent: 10},
            {Name: 8, Percent: 10}
        ],
        WinLines: 10
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

// let winComb = [
//     [2, 2, 2, 2, 2],
//     [3, 3, 3, 3, 3],
//     [1, 1, 1, 1, 1],
//     [3, 2, 1, 2, 3],
//     [1, 2, 3, 2, 1],
//     [3, 3, 2, 3, 3],
//     [1, 1, 2, 3, 3],
//     [2, 3, 3, 3, 2],
//     [2, 1, 1, 1, 2],
//     [1, 2, 2, 2, 1],
//     [3, 2, 2, 2, 3],
//     [3, 2, 2, 2, 1],
//     [1, 2, 2, 2, 3],
//     [3, 3, 2, 1, 1],
//     [1, 1, 2, 3, 3],
//     [3, 3, 3, 2, 1],
//     [1, 1, 1, 2, 3],
//     [3, 2, 1, 1, 1],
//     [1, 2, 3, 3, 3],
//     [2, 2, 1, 2, 2],
//     [2, 2, 3, 2, 2]
// ];
//
// let firstTenLines = winComb.filter((comb, index) => index < 10);
// function checkForComb(comb) {
//     let result = {
//         elements: [],
//         amount: 0
//     };
//     let elements = [];
//     screen.forEach((wheel, wheelIndex) => {
//         let element = wheel[comb[wheelIndex]];
//         elements.push(element);
//     });
//
//     result.elements.push(elements.shift());
//     result.amount++;
//
//     for (let i = 0; i < elements.length; i++) {
//         let currentElement = elements.shift();
//         if (currentElement === result.elements[0]) {
//             result.elements.push(currentElement);
//             result.amount++;
//         } else {
//             break;
//         }
//     }
//     return result;
// }
//
//
// let lines = [
//     [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 1}],
//     [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 0}],
//     [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 2}],
//     [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 0}],
//     [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 2}],
//     [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 1}, {X: 3, Y: 0}, {X: 4, Y: 0}],
//     [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 1}, {X: 3, Y: 2}, {X: 4, Y: 2}],
//     [{X: 0, Y: 1}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 1}],
//     [{X: 0, Y: 1}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 1}],
//     [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 2}],
//     [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 0}],
//     [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 2}],
//     [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 1}, {X: 3, Y: 1}, {X: 4, Y: 0}],
//     [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 1}, {X: 3, Y: 2}, {X: 4, Y: 2}],
//     [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 1}, {X: 3, Y: 0}, {X: 4, Y: 0}],
//     [{X: 0, Y: 0}, {X: 1, Y: 0}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 2}],
//     [{X: 0, Y: 2}, {X: 1, Y: 2}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 0}],
//     [{X: 0, Y: 0}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 2}, {X: 4, Y: 2}],
//     [{X: 0, Y: 2}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 0}, {X: 4, Y: 0}],
//     [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 2}, {X: 3, Y: 1}, {X: 4, Y: 1}],
//     [{X: 0, Y: 1}, {X: 1, Y: 1}, {X: 2, Y: 0}, {X: 3, Y: 1}, {X: 4, Y: 1}]
// ];
//
// let BetLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// let CoinValue = [1, 2, 5, 10, 20, 50, 100];
