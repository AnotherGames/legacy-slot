export let config = {
    fadeinMusicTime: 5000,
    countMeterTime: 2500,
    autoTransitionTime: 10000,
    symbolsCount: 12,
    maxMulti: 7,
    numOfInfoDots: 9,
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
            y: -70
        },
        gameMachine: {
            x: 0,
            y: -30
        },
        elements: {
            width: 256,
            height: 240
        },

        win: {
            '4': [{x: 10, y: 160}, {x: 1345, y: 160}],
            '2': [{x: 10, y: 225}, {x: 1345, y: 225}],
            '6': [{x: 10, y: 295}, {x: 1345, y: 295}],
            '9': [{x: 10, y: 360}, {x: 1345, y: 360}],
            '10': [{x: 10, y: 430}, {x: 1345, y: 430}],
            '1': [{x: 10, y: 495}, {x: 1345, y: 495}],
            '8': [{x: 10, y: 565}, {x: 1345, y: 565}],
            '7': [{x: 10, y: 630}, {x: 1345, y: 630}],
            '3': [{x: 10, y: 700}, {x: 1345, y: 700}],
            '5': [{x: 10, y: 765}, {x: 1345, y: 765}]
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
            '4': [{x: 10, y: 120}, {x: 1010, y: 120}],
            '2': [{x: 10, y: 170}, {x: 1010, y: 170}],
            '6': [{x: 10, y: 220}, {x: 1010, y: 220}],
            '9': [{x: 10, y: 270}, {x: 1010, y: 270}],
            '10': [{x: 10, y: 320}, {x: 1010, y: 320}],
            '1': [{x: 10, y: 370}, {x: 1010, y: 370}],
            '8': [{x: 10, y: 420}, {x: 1010, y: 420}],
            '7': [{x: 10, y: 470}, {x: 1010, y: 470}],
            '3': [{x: 10, y: 520}, {x: 1010, y: 520}],
            '5': [{x: 10, y: 570}, {x: 1010, y: 570}]
        }
    },
    coords: {
        2: [
            {
                x: 640,
                y: 515,
                left: true,
                scaleX: 0.8,
                scaleY: 0.8
            },
            {
                x: 780,
                y: 700,
                left: true,
                scaleX: 0.7,
                scaleY: 0.9
            },
            {
                x: 1230,
                y: 600,
                left: false,
                scaleX: 0.6,
                scaleY: 0.7
            },
            {
                x: 1250,
                y: 400,
                left: false,
                scaleX: 0.9,
                scaleY: 0.8
            },
            {
                x: 860,
                y: 200,
                left: true,
                scaleX: 1,
                scaleY: 0.9
            }
        ],
        4: [
            {
                x: 760,
                y: 450,
                left: true,
                scaleX: 0.7,
                scaleY: 0.9
            },
            {
                x: 870,
                y: 680,
                left: true,
                scaleX: 1,
                scaleY: 1
            },
            {
                x: 1160,
                y: 520,
                left: false,
                scaleX: 0.7,
                scaleY: 0.8
            },
            {
                x: 1180,
                y: 380,
                left: false,
                scaleX: 1,
                scaleY: 0.8
            },
            {
                x: 1050,
                y: 270,
                left: false,
                scaleX: 1,
                scaleY: 1
            }
        ],
        6: [
            {
                x: 850,
                y: 520,
                left: true,
                scaleX: 0.7,
                scaleY: 0.7
            },
            {
                x: 780,
                y: 450,
                left: true,
                scaleX: 0.8,
                scaleY: 0.8
            },
            {
                x: 1070,
                y: 450,
                left: false,
                scaleX: 0.5,
                scaleY: 0.5
            },
            {
                x: 880,
                y: 360,
                left: true,
                scaleX: 0.9,
                scaleY: 0.9
            },
            {
                x: 1050,
                y: 560,
                left: false,
                scaleX: 1,
                scaleY: 1
            }
        ],
        10: [
            {
                x: 920,
                y: 500,
                left: true,
                scaleX: 0.5,
                scaleY: 0.7
            },
            {
                x: 930,
                y: 440,
                left: true,
                scaleX: 0.5,
                scaleY: 0.6
            },
            {
                x: 1040,
                y: 450,
                left: false,
                scaleX: 0.5,
                scaleY: 0.5
            },
            {
                x: 880,
                y: 460,
                left: true,
                scaleX: 0.5,
                scaleY: 0.4
            },
            {
                x: 1050,
                y: 520,
                left: false,
                scaleX: 1,
                scaleY: 1
            }
        ]
    }
};
