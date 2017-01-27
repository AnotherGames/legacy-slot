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

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, container);
            model.el('mainBG', mainBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let deltaY = (model.desktop) ? 45 : -25;
            let gameMachineBG = game.add.sprite(0, deltaY, 'gameMachineBG', null, container);
                gameMachineBG.anchor.set(0.5);
            model.el('gameMachineBG', gameMachineBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);
        },

        addBubbles: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let emitter = game.add.emitter(game.world.centerX, game.height + 200, 400);
            container.add(emitter);
            emitter.makeParticles('bubble');
            emitter.width = game.width;

            emitter.setRotation(0, 0);
            emitter.setAlpha(0.1, 1, 3000);
            emitter.minParticleScale = 0.1;
            emitter.maxParticleScale = 0.4;
            emitter.setYSpeed(20, 80);
            emitter.gravity = -200;

            emitter.start(false, 7000, 150);
        },

        addShark: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let y = (model.desktop) ? game.rnd.integerInRange(150, 400) : game.rnd.integerInRange(100, 300);
            let shark = game.add.sprite(-500, y, 'shark', null, container);
            shark.anchor.set(0.5);
            if (model.mobile) {
                shark.scale.set(0.6);
            }
            shark.animations.add('move');
            shark.animations.play('move', 20, true);
            model.el('shark', shark);

            let time = game.rnd.integerInRange(10, 14);
            let side = (game.rnd.sign() < 0) ? 'left' : 'right';

            shark.x = (side === 'left') ? -shark.width : game.width + shark.width;
            let delta = (side === 'left') ? game.width + shark.width : -shark.width;
            if (side === 'right') {
                shark.width = -shark.width;
            }

            game.add.tween(shark).to({x: delta}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    shark.destroy();
                    game.time.events.add(10000, () => {
                        this.addShark({});
                    });
                }, this);

        },

        addFishes: function({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let fishes = [];
            let side = (game.rnd.sign() < 0) ? 'left' : 'right';

            for (let i = 0; i < game.rnd.integerInRange(5, 10); i++) {

                let x = (side === 'left') ? game.rnd.integerInRange(430, 500) * -1: game.width + game.rnd.integerInRange(430, 500);
                let y = (model.desktop) ? game.rnd.integerInRange(450, 700) : game.rnd.integerInRange(350, 600);

                let fish = game.add.sprite(x, y, 'fish', null, container);
                fish.anchor.set(0.5);
                (model.desktop) ? fish.scale.set(game.rnd.integerInRange(6, 10) / 10) : fish.scale.set(game.rnd.integerInRange(4, 8) / 10);

                fish.animations.add('move');
                fish.animations.play('move', 20, true);
                if (side === 'left') {
                    fish.width = -fish.width;
                }
                model.el('fish', fish);
                fishes.push(fish);
            }
            fishes.forEach((fish) =>{
                let time = game.rnd.integerInRange(7, 9);
                let deltaX = (side === 'left') ? game.width + 500 : -500;
                game.add.tween(fish).to({x: deltaX}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    fish.destroy();
                }, this);
            });
            game.time.events.add(20000, () => {
                this.addFishes({});
            });
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let lineNumbersArr = [];
            let deltaYright = (model.desktop) ? 105 : 81;
            let deltaYleft = (model.desktop) ? 109 : 83;

            for (let i = 1; i < 22; i++) {
                side = config[model.res].win[i][0].side;
                let x = (side == 'right') ? gameMachine.right - deltaYright : gameMachine.left + deltaYleft;
                let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2,
                    'winSplash',
                    'skeleton-animation_5.png',
                    container);

                lineNumber.name = i;
                lineNumber.anchor.set(0.5);
                lineNumber.alpha = 0.05;

                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames('skeleton-animation_', 1, 14, '.png', 1), 20, false);

                if (model.state('fs')) {
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
                        game.time.events.add(1000, () => {
                            if (lineNumber.lineShape) {
                                lineNumber.lineShape.destroy();
                            }
                        });
                    });
                }

                lineNumbersArr.push(lineNumber);
            }

            model.el('lineNumbersArr', lineNumbersArr);
        },

        lineShape: function(number) {
           let game = model.el('game');
           let container = model.group('glistaLight');
           let line = model.data('lines')[number - 1];
           let elSize = config[model.res].elements;
           let lineShape = game.add.graphics(0, 0, container);
           let gameMachine = model.el('gameMachine');
           let deltaX = 150;
           let deltaY = (model.desktop) ? 200 : 40;
           lineShape
               .lineStyle(4, 0x188bb4, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[0].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[1].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[1].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[2].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[2].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[3].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[3].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[4].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[4].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
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
            let deltaY = (model.desktop) ? 50 : -25;
            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
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

        flyingSmoke: function({
            game = model.el('game'),
            container = model.group('bg'),
            x = game.width / 39,
            y = game.height / 5.6,
            speed = 60000,
            delay = game.rnd.between(1000, 20000)
        }){
            let smoke = game.add.sprite(x, y, 'smoke', null, container);
                smoke.anchor.set(0.5);
                smoke.scale.set(0.1);
                smoke.alpha = 0;

            let scaleX = (model.desktop)? 1 : 0.6;
            let scaleY = (model.desktop)? 1 : 0.6;
            game.add.tween(smoke).to({alpha: 0.8 }, 300, Phaser.Easing.Sinusoidal.InOut, true, delay);
            game.add.tween(smoke.scale).to({y: scaleX, x: scaleY}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay)
            game.add.tween(smoke).to({y: smoke.y / 2}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay)
                .onComplete.add(()=>{
                    game.add.tween(smoke).to({y: -smoke.y, alpha: 0}, speed / 3, Phaser.Easing.Quintic.In, true)
                        .onComplete.add(()=>{
                            smoke.destroy();
                            draw.flyingSmoke({});
                        })

                });
        }

    };

    return {
        create,
        draw
    };
})();
