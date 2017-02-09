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

            let initBG = game.add.spine(0, 0, 'fon');
                initBG.setAnimationByName(1, 'show', false);
                initBG.addAnimationByName(1, 'move', true);
                (model.desktop) ? initBG.scale.set(1.0) : initBG.scale.set(0.6);

            // let mainBG = game.add.tileSprite(0, 0, game.width, game.height, 'gradientLine', null, container);
            // model.el('mainBG', mainBG);

            // let shine = game.add.sprite(game.world.centerX, game.world.centerY, 'shine', null, container);
            //     shine.anchor.set(0.5);
            // game.add.tween(shine).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);

        },

        addCloud: function({
            x = model.el('game').rnd.integerInRange(0, model.el('game').width),
            container = model.group('bg')
        }) {
            let game = model.el('game');
            let randomScale = game.rnd.integerInRange(3, 10);

            for (let i = 0; i < 5; i++) {
                let cloud = game.add.sprite(0, 150, 'cloud', null, container);
                cloud.anchor.set(0.5);
                cloud.angle = 40;
                cloud.scale.set(randomScale / 10);

                let time = game.rnd.integerInRange(50, 70);
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
                        // game.time.events.add();
                        draw.addCloud({});
                    }, this);
            }



        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            // let gameBG = game.add.sprite(0, 10, 'gameBG', null, container);
            //     gameBG.anchor.set(0.5);
            // model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let logoGM = game.add.sprite(0, -model.el('gameMachine').height / 2 + 5, 'logoGM', null, container);
                logoGM.anchor.set(0.5);
            model.el('logoGM', logoGM);

        },

        lineNumbers: function({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }){
            let x = (side == 'right') ? gameMachine.right - 9 : gameMachine.left + 9;
            let lineNumbersArr = [];

            for (let i = 1; i < 10; i++) {
                let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - 40,
                    'lineNumbers',
                    'plashka-0' + i + '-open_0.png',
                    container);
                // lineNumber.normal = function() {lineNumber.frameName = 'plashka-0' + i + '-open_0.png'};
                lineNumber.name = i;
                lineNumber.anchor.set(0.5);
                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames('plashka-0' + i + '-open_', 0, 20, '.png', 1), 15, false);
                lineNumber.animations.getAnimation('win').onComplete.add(() => {
                    lineNumber.frameName = 'plashka-0' + i + '-open_0.png';
                });

                if(model.state('fs')) {
                    lineNumbersArr.push(lineNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;

                lineNumber.events.onInputOver.add(() => {
                  setTimeout(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                  }, 4000);
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                });

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
           let y = (model.desktop) ? 110 : 80;
           lineShape
               .lineStyle(4, 0xe1b249, 0.8)
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
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 0);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 3);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 4);
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

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + 18);
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
