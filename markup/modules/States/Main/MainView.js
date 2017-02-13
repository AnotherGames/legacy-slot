import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { controller as soundController } from 'modules/Sound/SoundController';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('panel', game.add.group());
            model.group('buttons', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('footerMenu', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('bonusDarkness', game.add.group());
            model.group('aim', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let mainBG;
            if (model.desktop) {
                mainBG = game.add.spine(0, 0, 'fon');
                    mainBG.setAnimationByName(1, 'move2', true);
                    container.add(mainBG);
            } else {
                mainBG = game.add.tileSprite(0, 0, game.width, game.height, 'gradientLine', null, container);

                let luchi = game.add.sprite(game.world.centerX, game.world.centerY, 'shine', null, container);
                luchi.anchor.set(0.5);
                game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);
            }

        },

        addCloud: function({
            x = model.el('game').rnd.integerInRange(0, model.el('game').width),
            container = model.group('bg')
        }) {
            let game = model.el('game');
            let randomScale = game.rnd.integerInRange(3, 9);

            for (let i = 0; i < 5; i++) {
                let cloud = game.add.sprite(0, 150, 'cloud', null, container);
                cloud.anchor.set(0.5);
                cloud.angle = 40;
                cloud.scale.set(randomScale / 10);

                let time = game.rnd.integerInRange(30, 50);
                let delay = game.rnd.integerInRange(500, 1500);
                let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
                console.log(side);
                if (model.desktop) {
                    cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(20, 350) + 80;
                } else {
                    cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(20, 250) + 50;
                }
                cloud.x = x;

                if (container === model.group('bg')){
                    cloud.x = (side === 'left') ? -cloud.width : game.width + cloud.width;
                }
                let delta = (side === 'left') ? game.width + cloud.width : -cloud.width;

                game.add.tween(cloud).to({x: delta}, time * 1000, 'Linear', true, delay)
                    .onComplete.add(() => {
                        cloud.destroy();
                    }, this);
            }
            game.time.events.add(20000, () => {
                draw.addCloud({});
            });

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 28 : 18;

            let gameBG = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, container);
                gameBG.beginFill(0x000000, 0.4).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + deltaY);
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let logoGM = game.add.sprite(0, model.el('gameMachine').top, 'logoGM', null, container);
                logoGM.anchor.set(0.5);
            model.el('logoGM', logoGM);

        },

        lineNumbers: function({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }){
            let x = (side == 'right') ? gameMachine.right - 11 : gameMachine.left + 11;
            let deltaY = (model.desktop) ? 40 : 80;
            let lineNumbersArr = [];

            for (let i = 1; i < 11; i++) {
                let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - deltaY,
                    'lineNumbers',
                    'line-' + i + '-bang_0.png',
                    container);
                lineNumber.name = i;
                lineNumber.anchor.set(0.5);
                lineNumber.scale.set(1.4);
                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames('line-' + i + '-bang_', 0, 30, '.png', 1), 30, false);
                lineNumber.animations.getAnimation('win').onComplete.add(() => {
                    lineNumber.frameName = 'line-' + i + '-bang_0.png';
                });

                if(model.state('fs')) {
                    lineNumbersArr.push(lineNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.hitArea = new Phaser.Circle(0, 0, 50);

                if (model.desktop) {
                    lineNumber.events.onInputOver.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        game.time.events.add(4000, () => {
                            if (lineNumber.lineShape) {
                                lineNumber.lineShape.destroy();
                            }
                        });
                    });
                }
                lineNumbersArr.push(lineNumber);
            }

            model.el(side + 'Arr', lineNumbersArr);
        },

        lineShape: function(number) {
           let game = model.el('game');
           let container = model.group('glistaLight');
           let line = model.data('lines')[number - 1];
           let elSize = config[model.res].elements;
           let lineShape = game.add.graphics(0, 0, container);
           let y = (model.desktop) ? 60 : 80;
           lineShape
               .lineStyle(4, 0xf48725, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
           return lineShape;
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 2);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 3);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 4);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 5);
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
            let deltaY = (model.desktop) ? 12 : 32;

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3 - deltaY);
            machineGroup.mask = someGraphic;
        },

        showPopup: function ({
            game = model.el('game'),
            container = model.group('popup'),
            message = 'popup',
            font = 'normal 45px Arial',
            color = '#c28531',
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
                popup.x - 40,
                popup.y,
                message,
                {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: 380, stroke: '#000000', strokeThickness: 3},
                container);
                popupText.anchor.set(0.5);

            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                (balance) ? container.removeAll() : window.location.reload();
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                (balance) ? container.removeAll() : window.location.reload();
            });
        },


    };

    return {
        create,
        draw
    };
})();
