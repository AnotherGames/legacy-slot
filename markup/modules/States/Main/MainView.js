import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Dragon } from 'modules/Class/Dragon';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { motionPath } from 'modules/Util/Motion';

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

            if (model.desktop) {
                let el = game.add.sprite(520, 510, 'el', null, container);
                el.anchor.set(0.5);
                model.el('el', el);
            }

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

        addStars: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let starsBG = game.add.spine(game.world.centerX, game.world.centerY, 'stars');
            starsBG.setAnimationByName(0, 'animation', true);
            if(model.mobile) {
                starsBG.scale.set(0.6);
            }
            container.add(starsBG);

            model.el('starsBG', starsBG);
        },

        //test
        addEmitter: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {

            let emitter = game.add.emitter(0, 0, 300);
            // container.add(emitter);
            emitter.makeParticles('snow');

            emitter.setRotation(0, 0);
            emitter.setAlpha(0.1, 1, 3000);
            emitter.setScale(0.1, 0.5, 0.1, 0.5, 6000, Phaser.Easing.Quintic.Out);
            emitter.gravity = 300;

            emitter.start(false, 3000, 10);

            emitter.emitX = 0;

            game.add.tween(emitter).to( { emitX: game.width }, 1000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);

        },

        addSnow: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let back_emitter = game.add.emitter(-500, -500, 300);
                back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
                back_emitter.maxParticleScale = 0.6;
                back_emitter.minParticleScale = 0.2;
                back_emitter.setYSpeed(20, 100);
                back_emitter.gravity = 0;
                back_emitter.width = game.world.width * 1.5;
                back_emitter.minRotation = 0;
                back_emitter.maxRotation = 40;

            let mid_emitter = game.add.emitter(-500, -500, 125);
                mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
                mid_emitter.maxParticleScale = 1.2;
                mid_emitter.minParticleScale = 0.8;
                mid_emitter.setYSpeed(50, 150);
                mid_emitter.gravity = 0;
                mid_emitter.width = game.world.width * 1.5;
                mid_emitter.minRotation = 0;
                mid_emitter.maxRotation = 40;

            let front_emitter = game.add.emitter(-500, -500, 25);
                front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
                front_emitter.maxParticleScale = 1;
                front_emitter.minParticleScale = 0.5;
                front_emitter.setYSpeed(100, 200);
                front_emitter.gravity = 0;
                front_emitter.width = game.world.width * 1.5;
                front_emitter.minRotation = 0;
                front_emitter.maxRotation = 40;

            container.add(back_emitter);
            container.add(mid_emitter);
            container.add(front_emitter);

            back_emitter.start(false, 14000, 20);
            mid_emitter.start(false, 12000, 40);
            front_emitter.start(false, 15000, 1000);
        },

        addDeers: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {

            let deer = game.add.spine(50, game.height * 0.5, 'deer');
                deer.setAnimationByName(0, 'walk', true);
                deer.scale.set(0.5);
                deer.name = 'deer'

            model.el('deer', deer);
            model.group('bg').add(deer);

            motionPath.motion.addPath({
                name: 'deer',
                randomY: true,
                anim: deer,
                speed: 5,
                randomSide: true,
                rotation: true,
                repeat: true,
            })

        },

        flyingSmoke: function({
            game = model.el('game'),
            container = model.group('bg'),
            x = (model.desktop) ? 190 : 53,
            y = (model.desktop) ? 750 : 510,
            animation = 2
        }){

            let smoke = game.add.spine(x, y, 'smoke');
            smoke.setAnimationByName(0, animation, true);
            model.group('bg').add(smoke);
            smoke.scale.set(0.01);
            model.el('smoke', smoke);

            game.add.tween(smoke.scale).to({x: 0.6, y: 0.6}, 100000, 'Linear', true);

        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];
            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'ball', null, container);
                lineNumber.anchor.set(0.5);
                lineNumber.name = name;

                let lineNumberBig = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumberBig.normal = function() {game.add.tween(lineNumberBig).to({alpha: 0}, 300, 'Linear', true);};
                lineNumberBig.name = name;
                lineNumberBig.anchor.set(0.5);
                lineNumberBig.alpha = 0;

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                        lineNumberBig.alpha = 0;
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    lineNumberBig.alpha = 1;
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                            lineNumberBig.alpha = 0;
                        }
                    }, 10000);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                        lineNumberBig.alpha = 0;
                    }
                });
                leftArr.push(lineNumberBig);

            }

            model.el('leftArr', leftArr);

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2, config[model.res].win[i][1].y - gameMachine.height / 2 - 60, 'ball', null, container);
                lineNumber.anchor.set(0.5);
                lineNumber.name = name;

                let lineNumberBig = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2, config[model.res].win[i][1].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumberBig.normal = function() {game.add.tween(lineNumberBig).to({alpha: 0}, 300, 'Linear', true);};
                lineNumberBig.name = name;
                lineNumberBig.anchor.set(0.5);
                lineNumberBig.alpha = 0;

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                        lineNumberBig.alpha = 0;
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    lineNumberBig.alpha = 1;
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                            lineNumberBig.alpha = 0;
                        }
                    }, 10000);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                        lineNumberBig.alpha = 0;
                    }
                });

                rightArr.push(lineNumberBig);

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
            // container.addAt(winTop, 3);
            container.add(winTop);
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

            let someGraphic = game.add.graphics(-game.width / 2, -elSize.height * 1.5 - deltaY, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, game.width, elSize.height * 3 + 100);
            machineGroup.mask = someGraphic;
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
                (balance) ? container.removeAll() : window.location.reload();
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                (balance) ? container.removeAll() : window.location.reload();
            });
        }
    };

    return {
        create,
        draw
    };
})();
