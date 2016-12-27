import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Dragon } from 'modules/Class/Dragon';
import { view as transitionView } from 'modules/Transition/TransitionView';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('buttons', game.add.group());
            model.group('panel', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('logo', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game')
        }) {
            let mainBG = game.add.sprite(0, 0, 'mainBG', null, model.group('bg'));
            model.el('mainBG', mainBG);

            let secondBG = game.add.sprite(0, 0, 'BG', null, model.group('bg'));
            model.el('secondBG', secondBG);
        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameBG = game.add.sprite(0, 0, 'gameBG', null, container);
                gameBG.anchor.set(0.5);
                gameBG.visible = false;
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
                gameMachine.visible = false;
            model.el('gameMachine', gameMachine);

            let upperBG = game.add.sprite(0, 50, 'upperBG', null, container);
                upperBG.anchor.set(0.5);
            model.el('upperBG', upperBG);
        },

        logo: function({
            game = model.el('game'),
            container = model.group('logo')
        }) {
            container.x = game.world.centerX;
            container.y = game.world.centerY;
            let deltaY = (model.desktop) ? -460 : -310;

            if (model.mobile) {
                if (model.state('gameSideLeft')) {
                    container.x = model.data('mainXLeft');
                } else {
                    container.x = model.data('mainXRight');
                }
            }

            let skyLogo = game.add.sprite(0, deltaY, 'skyLogo', null, container);
            skyLogo.anchor.set(0.5);
            model.el('skyLogo', skyLogo);

            let gameLogo = game.add.sprite(25, deltaY, 'gameLogo', null, container);
                gameLogo.anchor.set(0.5);
            model.el('gameLogo', gameLogo);

        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];
            let leftArrBall = [];
            let rightArr = [];
            let rightArrBall = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'ball', null, container);
                lineNumber.anchor.set(0.5);
                lineNumber.name = name;

                let lineNumberBig = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumberBig.normal = function() {lineNumberBig.frameName = 'line_splash-' + name + '_0.png'};
                lineNumberBig.name = name;
                lineNumberBig.anchor.set(0.5);
                lineNumberBig.visible = false;

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    }, 10000);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                });
                leftArr.push(lineNumberBig);
                leftArrBall.push(lineNumber);
            }

            model.el('leftArr', leftArr);
            model.el('leftArrBall', leftArrBall);


            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2, config[model.res].win[i][1].y - gameMachine.height / 2 - 60, 'ball', null, container);
                lineNumber.anchor.set(0.5);
                lineNumber.name = name;

                let lineNumberBig = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2, config[model.res].win[i][1].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumberBig.normal = function() {lineNumberBig.frameName = 'line_splash-' + name + '_0.png'};
                lineNumberBig.name = name;
                lineNumberBig.anchor.set(0.5);
                lineNumberBig.visible = false;

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    }, 10000);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                });

                rightArr.push(lineNumberBig);
                rightArrBall.push(lineNumber);
            }
            model.el('rightArr', rightArr);
            model.el('rightArrBall', rightArrBall);
        },

        lineShape: function(number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            lineShape
                // .beginFill(0x000000)
                .lineStyle(4, 0xffffff, 0.8)
                .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
            return lineShape;
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let winTop = game.add.group();
            container.addAt(winTop, 3);
            model.group('winTop', winTop);

            machineGroup.glistaLightContainer = game.add.group();
            model.group('glistaLight', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.group('elements', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.group('glista', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 32 : 18;

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 - deltaY, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + 100);
            machineGroup.mask = someGraphic;
        },

        darkness: function ({
            game = model.el('game')
        }) {
            let darkness = game.add.graphics();
                darkness.beginFill(0x000000);
                darkness.drawRect(0, 0, game.width, game.height);
            return darkness;
        },

        showPopup: function ({
            game = model.el('game'),
            container = model.group('popup'),
            message = 'popup',
            font = 'normal 54px Arial',
            color = '#e8b075',
            balance = false
        }) {
            let overlay = game.add.graphics(0, 0, container)
                .beginFill(0x000000, 0.8)
                .drawRect(0, 0, game.width, game.height);

            let popup = game.add.sprite(
                game.width / 2,
                game.height / 2,
                'popup',
                null,
                container);
                popup.anchor.set(0.5);
            model.el('popup', popup);

            let popupText = game.add.text(
                popup.x,
                popup.y,
                message,
                {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: popup.width - 80},
                container);
                popupText.anchor.set(0.5);

            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                (!balance) ? window.location.reload() : container.removeAll();
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                (!balance) ? window.location.reload() : container.removeAll();
            });
        }
    };

    return {
        create,
        draw
    };
})();
