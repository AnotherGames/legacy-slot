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
            model.group('dragon', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('fs', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let mainBG = game.add.sprite(0, 0, 'fsBG', null, container);
            model.el('mainBG', mainBG);

            let secondBG = game.add.sprite(0, 0, 'BG', null, model.group('bg'));
            model.el('secondBG', secondBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
                gameMachine.visible = false;
            model.el('gameMachine', gameMachine);

            let deltaY = (model.mobile) ? 10 : 50;

            let skyLogo = game.add.sprite(0, -game.height / 2 + deltaY + 70, 'skyLogo', null, container);
                skyLogo.anchor.set(0.5);
            model.el('skyLogo', skyLogo);

            let gameLogo = game.add.sprite(0, -game.height / 2 + deltaY, 'gameLogo', null, container);
                gameLogo.anchor.set(0.5, 0);
            model.el('gameLogo', gameLogo);

            let upperBG = game.add.sprite(0, 50, 'upperBG', null, container);
                upperBG.anchor.set(0.5);
            model.el('upperBG', upperBG);

            if (model.desktop) {
                let el = game.add.sprite(520, 510, 'el', null, container);
                el.anchor.set(0.5);
                model.el('el', el);
            }
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

        addSnow: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let back_emitter = game.add.emitter(-500, -500, 600);
                back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
                back_emitter.maxParticleScale = 0.6;
                back_emitter.minParticleScale = 0.2;
                back_emitter.setYSpeed(20, 100);
                back_emitter.gravity = 0;
                back_emitter.width = game.world.width * 1.5;
                back_emitter.minRotation = 0;
                back_emitter.maxRotation = 40;

            let mid_emitter = game.add.emitter(-500, -500, 250);
                mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
                mid_emitter.maxParticleScale = 1.2;
                mid_emitter.minParticleScale = 0.8;
                mid_emitter.setYSpeed(50, 150);
                mid_emitter.gravity = 0;
                mid_emitter.width = game.world.width * 1.5;
                mid_emitter.minRotation = 0;
                mid_emitter.maxRotation = 40;

            let front_emitter = game.add.emitter(-500, -500, 50);
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

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let winTop = game.add.group();
            container.addAt(winTop, 2);
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

        // addDragon: function ({
        //     game = model.el('game')
        // }) {
        //     let container = model.group('dragon');
        //     let x, y;
        //     if (model.mobile) {
        //         x = 610;
        //         y = 280;
        //     } else {
        //         x = 850;
        //         y = 450;
        //     }
        //     let dragonFS = new Dragon({position: {x, y}, container});
        //         dragonFS.IdleFS();
        //     if (model.mobile) {
        //         dragonFS.char.scale.set(0.7);
        //     }
        //     model.el('dragonFS', dragonFS);
        // },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;

            let maskX = game.world.centerX;

            let mask = game.add.graphics();
                mask.beginFill(0x000000);
                mask.drawRect(maskX, game.world.centerY + config[model.res].mainContainer.y, elSize.width * 5, elSize.height * 3);
            mask.pivot.set(elSize.width * 2.5, elSize.height * 1.5);

            machineGroup.mask = mask;
            model.el('mask', mask);
        },

        darkness: function ({
            game = model.el('game')
        }) {
            let darkness = game.add.graphics();
                darkness.beginFill(0x000000);
                darkness.drawRect(0, 0, game.width, game.height);
            return game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true);
        },


        Multi: function({
            game = model.el('game'),
            container = model.group('panel'),
            start = 2
        }) {
            let x, y;
            if (model.mobile) {
                x = 980;
                y = 60;
            } else {
                x = 710;
                y = 115;
            }
            // let multiBG = game.add.sprite(x, y, 'multiPanelFS', null, container);
            // multiBG.anchor.set(0.5);
            const fsMulti = game.add.sprite(
                x,
                y + 5,
                'multiNumbers',
                `multi${start}.png`,
                container);
                fsMulti.anchor.set(0.5);
            model.el('fsMulti', fsMulti);
            return fsMulti;
        },

        Count: function({
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '35',
            fontMobile = '25'
        }) {
            let x, y, font, deltaY;
            if (model.mobile) {
                x = 270;
                y = 60;
                font = fontMobile;
                deltaY = 10;
            } else {
                x = 620;
                y = 90;
                font = fontDesktop;
                deltaY = 10;
            }
            // let countBG = game.add.sprite(x, y, 'freeSpinsPanelFS', null, container);
                // countBG.anchor.set(0.5);

            let fsCount = game.add.bitmapText(x, y + deltaY, 'numbersFont', start, font, container);
                fsCount.anchor.set(0.5)
            model.el('fs:count', fsCount);
        }

    };

    return {
        create,
        draw
    };
})();
