export let config = {
    fadeinMusicTime: 5000,
    countMeterTime: 2500,
    autoTransitionTime: 10000,
    symbolsCount: 14,
    maxMulti: 7,
    wheel: {
        roll: {
            time: 1500,
            fastTime: 800,
            length: 25,
            easingSeparation: 0.9,
            deltaTime: 100,
            finishScreen: [2, 5, 7, 1, 4]
        }
    },
    glista: {
        time: 1500
    },
    fullHD: {
        mainContainer: {
            x: 0,
            y: -80
        },
        gameMachine: {
            x: 0,
            y: 80
        },
        elements: {
            width: 256,
            height: 240
        },

        win: {
            '4': [{side: 'left', y: 252}],
            '13': [{side: 'right', y: 252}],
            '6': [{side: 'left', y: 297}],
            '15': [{side: 'right', y: 297}],
            '18': [{side: 'left', y: 342}],
            '2': [{side: 'right', y: 342}],
            '11': [{side: 'left', y: 387}],
            '17': [{side: 'right', y: 387}],

            '9': [{side: 'left', y: 495}],
            '1': [{side: 'left', y: 543}],
            '21': [{side: 'right', y: 590}],
            '20': [{side: 'left', y: 585}],
            '8': [{side: 'right', y: 637}],

            '10': [{side: 'left', y: 735}],
            '16': [{side: 'right', y: 735}],
            '19': [{side: 'left', y: 780}],
            '3': [{side: 'right', y: 780}],
            '7': [{side: 'left', y: 825}],
            '14': [{side: 'right', y: 825}],
            '5': [{side: 'left', y: 871}],
            '12': [{side: 'right', y: 870}]
        }
    },
    HD: {
        spinButtonWidth: 173,
        mainContainer: {
            x: 0,
            y: 0
        },
        gameMachine: {
            x: 0,
            y: -25
        },
        elements: {
            width: 192,
            height: 180
        },

        win: {
            '4': [{side: 'left', y: 68}],
            '13': [{side: 'right', y: 68}],
            '6': [{side: 'left', y: 103}],
            '15': [{side: 'right', y: 103}],
            '18': [{side: 'left', y: 138}],
            '2': [{side: 'right', y: 138}],
            '11': [{side: 'left', y: 173}],
            '17': [{side: 'right', y: 173}],

            '9': [{side: 'left', y: 252}],
            '1': [{side: 'right', y: 285}],
            '21': [{side: 'right', y: 320}],
            '20': [{side: 'left', y: 320}],
            '8': [{side: 'right', y: 355}],

            '10': [{side: 'left', y: 435}],
            '16': [{side: 'right', y: 435}],
            '19': [{side: 'left', y: 470}],
            '3': [{side: 'right', y: 470}],
            '7': [{side: 'left', y: 505}],
            '14': [{side: 'right', y: 505}],
            '5': [{side: 'left', y: 540}],
            '12': [{side: 'right', y: 540}]
        }
    },
    illuminatorsCoords: [
        {
            x: 720,
            y: 650
        },
        {
            x: 1040,
            y: 520
        },
        {
            x: 1370,
            y: 600
        },
        {
            x: 1130,
            y: 770
        },
        {
            x: 860,
            y: 830
        }
    ]
};
