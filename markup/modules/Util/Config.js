export let config = {
    fadeinMusicTime: 5000,
    countMeterTime: 2500,
    autoTransitionTime: 10000,
    symbolsCount: 11,
    maxMulti: 7,
    numOfInfoDots: 6,
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
        time: 2000
    },
    fullHD: {
        mainContainer: {
            x: 0,
            y: -50
        },
        gameMachine: {
            x: 0,
            y: 0
        },
        panelMargin: {
            x: -20,
            y: 100
        },
        elements: {
            width: 256,
            height: 240
        },

        win: {
            '4': [{x: 45, y: 160}, {x: 1345, y: 160}],
            '2': [{x: 45, y: 225}, {x: 1345, y: 225}],
            '6': [{x: 45, y: 290}, {x: 1345, y: 290}],
            '9': [{x: 45, y: 360}, {x: 1345, y: 360}],
            '10': [{x: 45, y: 425}, {x: 1345, y: 425}],
            '1': [{x: 45, y: 495}, {x: 1345, y: 495}],
            '8': [{x: 45, y: 560}, {x: 1345, y: 560}],
            '7': [{x: 45, y: 630}, {x: 1345, y: 630}],
            '3': [{x: 45, y: 690}, {x: 1345, y: 690}],
            '5': [{x: 45, y: 760}, {x: 1345, y: 760}]
        }
    },
    HD: {
        spinButtonWidth: 173,
        mainContainer: {
            x: 0,
            y: -10
        },
        gameMachine: {
            x: 0,
            y: 0
        },
        elements: {
            width: 192,
            height: 180
        },

        win: {
            '4': [{x: 30, y: 120}, {x: 1015, y: 120}],
            '2': [{x: 30, y: 170}, {x: 1015, y: 170}],
            '6': [{x: 30, y: 220}, {x: 1015, y: 220}],
            '9': [{x: 30, y: 270}, {x: 1015, y: 270}],
            '10': [{x: 30, y: 320}, {x: 1015, y: 320}],
            '1': [{x: 30, y: 370}, {x: 1015, y: 370}],
            '8': [{x: 30, y: 420}, {x: 1015, y: 420}],
            '7': [{x: 30, y: 470}, {x: 1015, y: 470}],
            '3': [{x: 30, y: 520}, {x: 1015, y: 520}],
            '5': [{x: 30, y: 570}, {x: 1015, y: 570}]
        }
    }
};
