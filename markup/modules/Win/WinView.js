import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { sound } from 'modules/Sound/Sound';
import { Glista } from 'modules/Class/Glista';

export let view = (() => {

    let draw = {

        TotalWin: function ({
            winTotalData,
            game = model.el('game'),
            container = model.group('winTop'),
            style = {font: '66px Helvetica, Arial', fill: '#fee73f', align: 'center', stroke: '#000000', strokeThickness: 3}
        }) {
            if (winTotalData === 0) return;
            let winTotal = game.add.sprite(0, 0, 'winTotal', null, container);
            winTotal.anchor.set(0.5);

            let winTotalText = game.add.text(0, -5, winTotalData, style, container);
            winTotalText.anchor.set(0.5);
        },

        WinSplash: function ({
            number,
            ind,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            let leftArr = model.el('leftArr');
            let winSplash = leftArr.filter((el) => {
                return el.name === number;
            })[0];

            winSplash.animations.add('win', Phaser.Animation.generateFrameNames('line_splash-' + number + '_', 1, 12, '.png', 1), 15, false);
            winSplash.animations.play('win');
            winSplash.animations.getAnimation('win').onComplete.add(() => {
                winSplash.frameName = 'line_splash-' + number + '_12.png';
            });


            let rightArr = model.el('rightArr');
            let winSplashRight = rightArr.filter((el) => {
                return el.name === number;
            })[0];

            winSplashRight.animations.add('win', Phaser.Animation.generateFrameNames('line_splash-' + number + '_', 1, 12, '.png', 1), 15, false);
            winSplashRight.animations.play('win');
            winSplashRight.animations.getAnimation('win').onComplete.add(() => {
                winSplashRight.frameName = 'line_splash-' + number + '_12.png';
            });

            // return winSplash;
        },

        WinNumber: function ({number}) {
            if (number < 0) return;

            draw.WinSplash({number, ind: 0});
            // draw.WinSplash({number, ind: 1});

        },

        WinElements: function ({
            number,
            amount,
            alpha = 1,
            wheels = model.el('wheels'),
            game = model.el('game')
        }) {

            // wheels.forEach((wheel) => {
            //     wheel.elements.forEach((element) => {
            //         element.sprite.alpha = alpha;
            //     });
            // });

            if (number > 0) {
                let line = model.data('lines')[number - 1];

                for (let col = 0; col < amount; col++) {
                    let wheel = wheels[col].elements;
                    let coord = line[col].Y;
                    let element = wheel[coord];
                        element.win();
                        element.sprite.alpha = 1;
                        element.sprite.scale.set(0.3);
                        if (model.state('desktop')) {
                            game.add.tween(element.sprite.scale).to({x: 1.2,  y: 1.2}, 700, Phaser.Easing.Bounce.Out, true)
                                .onComplete.add(() => {
                                    game.add.tween(element.sprite.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                                }, this);
                        } else {
                            game.add.tween(element.sprite.scale).to({x: 1.8,  y: 1.8}, 700, Phaser.Easing.Bounce.Out, true)
                                .onComplete.add(() => {
                                    game.add.tween(element.sprite.scale).to({x: 1.5,  y: 1.5}, 400, 'Linear', true)
                                }, this);
                        }
                }

            } else {
                let lvlCounter = 0;
                wheels.forEach((wheelObj) => {

                    wheelObj.elements.forEach((element) => {


                        let elementName = parseInt(element.sprite.animations.currentAnim.name);

                        if (elementName == '10') {
                            element.win();
                            element.sprite.alpha = 1;
                            element.sprite.scale.set(0.3);
                            if (model.state('desktop')) {
                                game.add.tween(element.sprite.scale).to({x: 1.2,  y: 1.2}, 700, Phaser.Easing.Bounce.Out, true)
                                    .onComplete.add(() => {
                                        game.add.tween(element.sprite.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                                    }, this);
                            } else {
                                game.add.tween(element.sprite.scale).to({x: 1.7,  y: 1.7}, 700, Phaser.Easing.Bounce.Out, true)
                                    .onComplete.add(() => {
                                        game.add.tween(element.sprite.scale).to({x: 1.5,  y: 1.5}, 400, 'Linear', true)
                                    }, this);
                            }

                            game.time.events.add(1000, () => {
                                events.trigger('win:clean');
                            });

                        }
                        if (elementName == '11') {
                            element.win();
                            if(lvlCounter == 0){
                                events.trigger('fs:brain');
                                lvlCounter++;
                            }
                            game.add.tween(element.sprite.scale).to({x: 1.7, y: 1.7}, 700, 'Linear', true)
                                .onComplete.add(() => {
                                    if (model.state('mobile')) {
                                        element.sprite.scale.x = element.sprite.scale.y = 1.5;
                                    } else {
                                        element.sprite.scale.x = element.sprite.scale.y = 1;
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
                    events.trigger('win:clean');
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
                        let name = parseInt(element.sprite.animations.currentAnim.name);
                        if (name == 10) {
                            if (wheelIndex > lastWheel) {
                                lastWheel = wheelIndex;
                                lastElement = elementIndex;
                            }
                        }
                    });
                });

                if (model.state('mobile')) {
                    x = 192 * (lastWheel + 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (lastElement + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 150 - gameMachine.height / 2 - 25;
                }
            }

            if (!scatter) {
                if (model.state('mobile')) {
                    x = 192 * (countValue - 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (currentLineY + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 150 - gameMachine.height / 2 - 25;
                }
            }

            let winBG = game.add.sprite(x, y - 3, 'winLine', null, container);
                winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '15px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '25px Arial, Helvetica';
            }
            let text = game.add.text(x, y, winValue, {font: font, fill: '#eacf16', align: 'center'}, container);
                text.anchor.set(0.5);

        }

    };

    let play = {

        WinSound: function() {
            let winSound = Math.round(Math.random()) ? sound.sounds.lineWin : sound.sounds.lineWin2;
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
