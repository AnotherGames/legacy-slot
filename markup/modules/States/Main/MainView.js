import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
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
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {

            let mainBGSky = game.add.sprite(0, 0, 'mainBGSky', null, container);
            model.el('mainBGSky', mainBGSky);

            // let mainBGSky = game.add.tileSprite(0, 0, game.width, game.height, 'sky', null, container);

            // let gradient = game.add.sprite(0, 0, 'gradient', null, container);
            // gradient.alpha = 0.1;
            // model.el('gradient', gradient);
            // game.add.tween(gradient).to({alpha: 0.9}, 50000, 'Linear', true, 0, -1, true);

            for (let i = 0; i < 5; i++) {
                transitionView.addCloud({container: model.group('bg')});
            }

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, container);
            model.el('mainBG', mainBG);

            let y = (model.desktop) ? game.height * 0.84 : game.height * 0.80;

            let logoZaglushka = game.add.sprite(0, y, 'zaglushka', null, container);
            model.el('logoZaglushka', logoZaglushka);

        },

        addPole: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let pole = game.add.sprite(0, game.height * 0.85, 'pole', null, container);
            pole.scale.set(1.2);
            model.el('pole', pole);
            pole.animations.add('go');
            pole.animations.play('go', 10, true);

            let time = game.rnd.integerInRange(20, 35);
            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';

            pole.x = (side === 'left') ? -pole.width : game.width + pole.width;
            let delta = (side === 'left') ? game.width + pole.width : -pole.width;
            if (side === 'right') {
                pole.width = -pole.width;
            }

            game.add.tween(pole).to({x: delta}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    pole.destroy();
                    game.time.events.add(3000, () => {
                        this.addPole({});
                    });
                }, this);

        },

        addBird: function ({
            game = model.el('game'),
            container = model.group('bg'),
            bird = game.add.sprite(game.width * 0.92, 265, 'bird', null, container),
            animName1 = 'idle1-',
            animName2 = 'idle2-',
            animName3 = 'idle3-'
        }) {
            bird.anchor.set(0.5);
            bird.inputEnabled = true;
            bird.events.onInputDown.add(this._flyBird);
            model.el('bird', bird);

            let birdAnim = bird.animations.add('idle', Phaser.Animation.generateFrameNames(animName1, 0, 24, '.png', 2));
            model.el('birdAnim', birdAnim);
            let birdAnim2 = bird.animations.add('idle2', Phaser.Animation.generateFrameNames(animName2, 0, 24, '.png', 2));
            model.el('birdAnim2', birdAnim2);
            let birdAnim3 = bird.animations.add('idle3', Phaser.Animation.generateFrameNames(animName3, 0, 24, '.png', 2));
            model.el('birdAnim3', birdAnim3);
            birdAnim.play(15, true);
            this._nextBirdAnim({});

        },

        _nextBirdAnim: function ({
            game = model.el('game'),
            birdAnim = model.el('birdAnim')
        }) {
            game.time.events.add(10000, () => {
            // Играем следующую случайную анимацию
            let number = game.rnd.integerInRange(2, 3);
            let nextAnim = model.el(`birdAnim${number}`);
            nextAnim.play(15);
            nextAnim.onComplete.add(() => {birdAnim.play(15, true)}, this);
            // Запускаем таймер снова
            this._nextBirdAnim({});
            });
        },

        _flyBird: function () {
            let game = model.el('game');
            let bird = model.el('bird');
            let container = model.group('bg');
            bird.visible = false;
            let birdFly = game.add.sprite(game.width * 0.92, 265, 'birdFly', 'fli100.png', container);
            birdFly.anchor.set(0.5);
            model.el('birdFly', birdFly);
            let birdAnim = birdFly.animations.add('fly', Phaser.Animation.generateFrameNames('fli1', 0, 24, '.png', 2));
            birdAnim.play(15);
            // birdAnim.onComplete.add(() => {birdFly.visible = false}, this);
            game.add.tween(birdFly).to({x: 170, y: 590}, 800, 'Linear', true, 500);
                // .onComplete.add(() => {
                //     game.time.events.add(500, () => {
                //         birdFly.visible = false;
                //         this.addBird({});
                // });
            //  });
        },

        addTable: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let table = game.add.sprite(game.width * 0.855, 500, 'table', null, container);
            table.anchor.set(0.5);
            model.el('table', table);

            let tableAnim = table.animations.add('idle', Phaser.Animation.generateFrameNames('skeleton-animation_', 0, 27, '.png', 1));
            tableAnim.play(12, true);

        },

        addSkull: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let skull = game.add.sprite(game.width * 0.1, game.height * 0.8, 'skull', 'Scull-1_0.png', container);
            skull.anchor.set(0.5);
            skull.scale.set(0.7);
            model.el('skull', skull);

            game.time.events.add(15000 * Math.random(), () => {
                draw.animSkull(skull);
            });
        },

        animSkull: function (skull) {
            let game = model.el('game');
            let skullAnim = skull.animations.add('idle');
                skullAnim.play(12);
                skullAnim.onComplete.add(() => {skull.frameName = 'Scull-1_0.png'}, this);
            game.time.events.add(15000 * Math.random(), () => {
                draw.animSkull(skull);
            });
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
            model.el('gameMachine', gameMachine);
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2,
                    config[model.res].win[i][0].y - gameMachine.height / 2 - 40,
                    'lineNumbers',
                    'line_splash-' + i +'_0.png',
                    container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
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
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2 - 8,
                    config[model.res].win[i][0].y - gameMachine.height / 2 - 40,
                    'lineNumbers',
                    'line_splash-' + i +'_0.png',
                    container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
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
                rightArr.push(lineNumber);
            }
            model.el('rightArr', rightArr);
        },

        lineShape: function(number) {
           let game = model.el('game');
           let container = model.group('glistaLight');
           let line = model.data('lines')[number - 1];
           let elSize = config[model.res].elements;
           let lineShape = game.add.graphics(0, 0, container);
           lineShape
               .lineStyle(4, 0x332206, 0.8)
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

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
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
            color = '#e8b075'
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
                {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: popup.width - 80, stroke: '#000000', strokeThickness: 3},
                container);
                popupText.anchor.set(0.5);

            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart') {
                    window.location.reload();
                }
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart') {
                    window.location.reload();
                }
            });
        }
    };

    return {
        create,
        draw
    };
})();
