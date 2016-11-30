import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { controller as soundController } from 'modules/Sound/Controller';
import { controller as fsController } from 'modules/States/FS/Controller';
import { controller as winController } from 'modules/Win/Controller';
import { Glista } from 'modules/Class/Glista';

export let view = (() => {

    let draw = {

        TotalWin: function ({
            winTotalData,
            game = model.el('game'),
            container = model.group('winTop'),
            style = {font: '60px Helvetice, Arial', fill: '#e8b075', align: 'center'}
        }) {
            if (winTotalData === 0) return;
            let winTotal = game.add.sprite(0, 0, 'winTotal', null, container);
            winTotal.anchor.set(0.5);

            let winTotalText = game.add.text(0, 5, winTotalData, style, container);
            winTotalText.anchor.set(0.5);
        },

        WinSplash: function ({
            number,
            ind,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            let winSplash = game.add.sprite(0, 0, 'win', null, container);
                winSplash.anchor.set(0.5);

                let gameMachine = model.el('gameMachine');
                winSplash.x = config[model.state('res')].win[number][ind].x - gameMachine.width / 2;
                winSplash.y = config[model.state('res')].win[number][ind].y - gameMachine.height / 2 - 25;
                winSplash.animations.add('win', Phaser.Animation.generateFrameNames('Splash-Splash', 1, 14, '.png', 1), 15, false);
                winSplash.animations.play('win');
                winSplash.animations.getAnimation('win').killOnComplete = true;
            return winSplash;
        },

        WinNumber: function ({number}) {
            if (number < 0) return;

            draw.WinSplash({number, ind: 0});
            draw.WinSplash({number, ind: 1});

        },

        WinElements: function ({
            number,
            amount,
            alpha = false,
            wheels = model.el('wheels'),
            game = model.el('game')
        }) {

            if (alpha) {
                wheels.forEach((wheel) => {
                    wheel.elements.forEach((element) => {
                        element.hide();
                    });
                });
            }

            if (number > 0) {
                let line = model.data('lines')[number - 1];

                for (let col = 0; col < amount; col++) {
                    let wheel = wheels[col].elements;
                    let coord = line[col].Y;
                    let element = wheel[coord];
                        element.win();
                        element.show();
                }

            } else {
                let lvlCounter = 0;
                wheels.forEach((wheelObj) => {

                    wheelObj.elements.forEach((element) => {


                        let elementName = parseInt(element.sprites[element.active - 1].animations.currentAnim.name);

                        if (elementName == '10') {
                            element.win();
                            element.show();

                            let game = model.el('game');
                            game.time.events.add(1000, () => {
                                winController.cleanWin();
                            });

                        }
                        if (elementName == '11') {
                            element.win();
                            if(lvlCounter == 0){
                                fsController.brain();
                                lvlCounter++;
                            }
                            game.add.tween(element.sprites[element.active - 1].scale).to({x: 1.7, y: 1.7}, 700, 'Linear', true)
                                .onComplete.add(() => {
                                    if (model.mobile) {
                                        element.sprites[element.active - 1].scale.x = element.sprites[element.active - 1].scale.y = 1.5;
                                    } else {
                                        element.sprites[element.active - 1].scale.x = element.sprites[element.active - 1].scale.y = 1;
                                    }
                                });
                        }
                    });
                });
            }
        },

        WinGlista: function ({
            number,
            game = model.el('game'),
            glistaLightContainer = model.el('glistaLightContainer'),
            glistaContainer = model.el('glistaContainer'),
            glistaFiredCounter = +model.data('glistaFiredCounter'),
            glistaDoneCounter = +model.data('glistaDoneCounter'),
            time = 1000
        }) {
            if (number < 0) return;

            let glista = new Glista({
                game,
                lightParent: glistaLightContainer,
                parent: glistaContainer,
                elSize: config[model.state('res')].elements
            });

            glistaFiredCounter++;
            model.data('glistaFiredCounter', glistaFiredCounter);

            let glistaMas = [];
            let line = model.data('lines')[number - 1];
            line.forEach((coord) => {
                glistaMas.push(coord.Y);
            });

            glista.start(glistaMas, time, () => {
                glista.remove();
                glistaDoneCounter++;
                model.data('glistaDoneCounter', glistaDoneCounter);

                if (glistaDoneCounter == glistaFiredCounter) {
                    winController.cleanWin();
                }

            });

            return glista;
        },

        WinLineTable: function({
            line,
            scatter,
            container = model.group('winTop'),
            game = model.el('game')
        }) {
            let gameMachine = model.el('gameMachine');
            let winValue = line.Win;
            let countValue = line.Count;
            let lineValue = line.Line;
            let currentLineY;
            if (!scatter) {
                currentLineY = model.data('lines')[lineValue - 1][countValue - 1].Y;
            }

            let x, y;
            if (scatter) {
                let lastWheel = 0;
                let lastElement = 0;
                let wheels = model.el('wheels');
                wheels.forEach((wheel, wheelIndex) => {
                    let elements = wheel.elements;
                    elements.forEach((element, elementIndex) => {
                        let name = parseInt(element.sprites[element.active - 1].animations.currentAnim.name);
                        if (name == 10) {
                            if (wheelIndex > lastWheel) {
                                lastWheel = wheelIndex;
                                lastElement = elementIndex;
                            }
                        }
                    });
                });

                if (model.mobile) {
                    x = 192 * (lastWheel + 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (lastElement + 0.5) + 135 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 180 - gameMachine.height / 2 - 25;
                }
            }

            if (!scatter) {
                if (model.mobile) {
                    x = 192 * (countValue - 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (currentLineY + 0.5) + 135 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 180 - gameMachine.height / 2 - 25;
                }
            }

            let winBG = game.add.sprite(x, y + 4, 'winLine', null, container);
                winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '15px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '25px Arial, Helvetica';
            }
            let text = game.add.text(x, y, winValue, {font: font, fill: '#9be20a'}, container);
                text.anchor.set(0.5);

        }

    };

    let play = {

        WinSound: function() {
            let winSound = Math.round(Math.random()) ? soundController.sounds.lineWin : soundController.sounds.lineWin2;
                winSound.addMarker('win', 0, 1, 1, false);
                winSound.play('win');
            return winSound;
        }

    };

    let hide = {

        WinTop: function({
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            return game.add.tween(container).to( { alpha: 0 }, 300, 'Linear', true);
        }

    };

    return {
        draw,
        play,
        hide
    };
})();
