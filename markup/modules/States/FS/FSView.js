import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { controller as soundController } from '../../../../Info/SoundController';

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
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('fs', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('footerMenu', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let mainBG = game.add.sprite(0, 0, 'fsBG', null, container);
            model.el('mainBG', mainBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let deltaY = (model.desktop) ? 30 : -10;
            let gameMachineBG = game.add.sprite(0, deltaY, 'gameMachineBG', null, container);
            gameMachineBG.anchor.set(0.5);
            model.el('gameMachineBG', gameMachineBG);

            let pipeX = (model.desktop) ? 480 : 350;
            let pipeY = (model.desktop) ? 90 : 40;
            let pipe = game.add.sprite(pipeX, pipeY, 'pipe', null, container);
            pipe.anchor.set(0.5);
            model.el('pipe', pipe);
            if (model.desktop) {
                pipe.scale.set(1.3);
            }

            let gameMachineAsset = (model.desktop) ? 'gameMachineFS' : 'gameMachine';
            let machineY = (model.desktop) ? -5 : -35;
            let gameMachine = game.add.sprite(0, machineY, gameMachineAsset, null, container);
            gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let logoY = (model.desktop) ? 82 : 50;
            let logoFSDown = game.add.sprite(0, gameMachine.top + logoY, 'logoFS', 'logoLight.png', container);
            logoFSDown.anchor.set(0.5);
            if (model.desktop) {
                logoFSDown.scale.set(1.33);
            }
            logoFSDown.alpha = 0;
            model.el('logoFSDown', logoFSDown);

            let logoFS = game.add.sprite(0, gameMachine.top + logoY, 'logoFS', 'logoNormal.png', container);
            logoFS.anchor.set(0.5);
            if (model.desktop) {
                logoFS.scale.set(1.33);
            }
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 4);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 5);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 6);
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

            console.log(model.group('main'));
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 30 : -10;
            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        Multi: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1
        }) {

            let x = (model.desktop) ? game.width * 0.35 : game.width * 0.58;
            let y = (model.desktop) ? 20 : game.height * 0.88;

            let fsMultiBG = game.add.sprite(x, y, 'multi', null, container);
            fsMultiBG.anchor.set(0.5);

            if (model.desktop) {
                fsMultiBG.scale.set(1.3);
            }

            let multiCloseArr = [];
            let multiBlinkArr = [];
            let x2 = (model.desktop) ? [340, 510, 685, 855, 1025, 1195] : [487, 620, 752, 882, 1015, 1148];

            for (let i = 0; i < 6; i++) {
                let multiClose = game.add.sprite(x2[i], y - 2, 'multiClose', null, container);
                multiClose.anchor.set(0.5);
                let multiBlink = game.add.sprite(x2[i], y - 2, 'multiBlink', null, container);
                multiBlink.anchor.set(0.5);
                multiBlink.alpha = 0;

                multiCloseArr.push(multiClose);
                multiBlinkArr.push(multiBlink);
            }
            model.el('multiCloseArr', multiCloseArr);
            model.el('multiBlinkArr', multiBlinkArr);

        },

        changeMulti: function ({
            game = model.el('game'),
            number = 1,
            multiCloseArr = model.el('multiCloseArr')
        }) {
            // let fsMulti = model.el('fsMulti');
            // fsMulti.text = number;
            // model.el('fsMulti', fsMulti);

            console.warn('change multi!', number);

            multiCloseArr.forEach((multi, index) => {
                if (index + 2 == number) {
                    game.add.tween(multi).to({alpha: 0}, 300, 'Linear', true);
                }
            });
        },

        addGerman: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {

            let germanAnims = [];
            for (let i = 1; i < 4; i++) {
                let german = game.add.sprite(170, 570, `germanFS${i}`, null, container);
                german.anchor.set(0.5);
                german.animations.add('move');
                if (i !== 1) {
                    german.scale.set(2.0);
                    german.visible = false;
                } else {
                    german.animations.play('move', 10, true);
                }
                germanAnims.push(german);
            }

            model.el('germanAnims', germanAnims);

            game.time.events.add(3000, () => {
                this.moveGerman({});
            });

        },

        moveGerman: function ({
            game = model.el('game')
        }) {
            let germanAnims = model.el('germanAnims');
            let rnd = game.rnd.integerInRange(0, 2);
            let time = game.rnd.integerInRange(5, 10);

            germanAnims.forEach((anim, index) => {
                if (index === 1) {
                    anim.visible = true;
                    anim.animations.play('move', 10, false);
                    anim.animations.getAnimation('move').onComplete.add(() => {
                        germanAnims[0].visible = false;
                        germanAnims[1].visible = false;
                        germanAnims[2].visible = true;
                        germanAnims[2].animations.play('move', 10, false);
                        germanAnims[2].animations.getAnimation('move').onComplete.add(() => {
                            germanAnims[1].visible = false;
                            germanAnims[2].visible = false;
                            germanAnims[0].visible = true;
                            germanAnims[0].animations.play('move', 10, true);
                        });
                    });
                } else {
                    anim.visible = false;
                }
            });

        },

        addWatch: function ({
            game = model.el('game'),
            container = model.group('fs')
        }) {
            let watchContainer = game.add.group();
            container.add(watchContainer);
            if (model.mobile) {
                container.scale.set(0.66);
            }

            let lightArr = [];

            for (let i = 0; i < 40; i++) {
                let rndAlpha = game.rnd.integerInRange(4, 10);
                let light = game.add.sprite(game.rnd.integerInRange(-150, 150) + game.width * 0.22,
                game.rnd.integerInRange(-150, 150) + game.height * 0.80,
                    'lightLine',
                    null,
                    watchContainer);
                light.anchor.set(0.5);
                light.alpha = rndAlpha / 10;
                lightArr.push(light);
            }
            lightArr.forEach((light) => {
                let rnd3 = game.rnd.integerInRange(-150, 150);
                let rnd2 = game.rnd.integerInRange(-150, 150);
                let rndAlpha = game.rnd.integerInRange(4, 10);
                game.add.tween(light).to({x: light.x + rnd2, y: light.y + rnd2}, 10000, 'Linear', true)
                    .onComplete.add(() => {
                        game.add.tween(light).to({x: light.x + rnd3, y: light.y + rnd3}, 10000, 'Linear', true, 0, 10000, true);
                    });
            });
            let watchFS = game.add.sprite(game.width * 0.205,
                game.height * 0.88,
                'watchFS',
                null,
                watchContainer);
            watchFS.anchor.set(0.5);

            let minuteArrow = game.add.sprite(watchFS.x + 52, watchFS.y - 18, 'watchArrows', 'watch-m-00.png', watchContainer);
            minuteArrow.anchor.set(0.5);
            minuteArrow.animations.add('run', Phaser.Animation.generateFrameNames('watch-m-', 0, 15, '.png', 2), 20, false);
            model.el('minuteArrow', minuteArrow);

            let hourArrow = game.add.sprite(watchFS.x + 52, watchFS.y - 18, 'watchArrows', 'watch-h-00.png', watchContainer);
            hourArrow.anchor.set(0.5);
            model.el('hourArrow', hourArrow);

            game.add.tween(watchContainer).to({y: watchContainer.y + 30}, 1500, 'Linear', true, 0, -1, true);

            soundController.sound.playSound({sound: 'clock'});

        },

        changeTime: function ({
            game = model.el('game'),
            hourArrow = model.el('hourArrow'),
            minuteArrow = model.el('minuteArrow'),
            watchCounter = model.el('watchCounter'),
            number = 0
        }) {
            watchCounter++;
            if (watchCounter > 1) {
                number = watchCounter + 1;
            }
            if (number > 11) {
                watchCounter = 0;
                number = watchCounter;
            }
            if (number > 12) return;
            console.warn('watchCounter', watchCounter);
            model.el('watchCounter', watchCounter);
            minuteArrow.animations.play('run');
            game.time.events.add(1000, () => {
                minuteArrow.frameName = 'watch-m-00.png';
                if (number < 10) {
                    hourArrow.frameName = `watch-h-0${number}.png`;
                } else {
                    hourArrow.frameName = `watch-h-${number}.png`;
                }
            });
        },

        lightBlinking: function ({
            game = model.el('game'),
            delay = 400,
            multiBlinkArr = model.el('multiBlinkArr')
        }) {
            multiBlinkArr.forEach((light) => {
                game.add.tween(light).to({alpha: 0.6}, 500, 'Linear', true, delay, 0, true)
                .onComplete.add(() => {
                    light.alpha = 0;
                })
            });
            game.time.events.add(4000, () => {
                this.lightBlinking({});
            });
        },

        showMaxMulti: function ({
            game = model.el('game'),
            logoFSDown = model.el('logoFSDown')
        }) {
            this.lightBlinking({});
            game.add.tween(logoFSDown).to({alpha: 0.6}, 400, 'Linear', true, 0 , -1, true);
        },

        Count: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '80px Titania, Arial',
            fontMobile = '50px Titania, Arial'
        }) {
            let x, y, deltaX, deltaY, font;
            if (model.mobile) {
                x = game.width * 0.85;
                y = 60;
                deltaX = 50;
                deltaY = 16;
                font = fontMobile;
            } else {
                x = game.width * 0.6;
                y = -750;
                deltaX = 65;
                deltaY = 15;
                font = fontDesktop;
            }

            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
            fsCountBG.anchor.set(0.5);
            model.el('fsCountBG', fsCountBG);
            if (model.desktop) {
                fsCountBG.scale.set(1.3);
            }

            let fsCount = game.add.bitmapText(x + deltaX, y + deltaY, 'numbersFont', start + '', 140, container);
            fsCount.align = 'center';
            fsCount.anchor.set(0.5);
            fsCount.scale.set(0.1);
            model.el('fs:count', fsCount);
        },

        CountPlus3: function ({
            game = model.el('game'),
            container = model.group('main'),
            x = 0,
            y = -290,
        }) {
            if (model.state('CountPlus3')) return;
            model.state('CountPlus3', true);

            let plus3Group = game.add.group(container);
            plus3Group.alpha = 0;
            plus3Group.x = x;
            plus3Group.y = y;

            let elSize = config[model.res].elements;
            let maskY = (model.desktop) ? 30 : -10;
            let someGraphic = game.add.graphics(0, 0);
            someGraphic.beginFill(0x000000).drawRect(0, game.height * 0.12, game.width, game.height);
            plus3Group.mask = someGraphic;

            let plus3BG = game.add.sprite(0, 0, 'fsTable', null, plus3Group);
            plus3BG.anchor.set(0.5);

            let plus3 = game.add.sprite(0, 30, 'plus3', null, plus3Group);
            plus3.anchor.set(0.5);

            let deltaY = (model.desktop) ? 100 : 50;
            // game.add.tween(plus3Group.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(plus3Group).to({y: plus3Group.y + deltaY, alpha: 1}, 300, 'Linear', true);
            game.add.tween(plus3Group).to({y: plus3Group.y - deltaY}, 300, 'Linear', true, 1000)
                .onComplete.add(() => {
                    plus3Group.destroy();
                    model.state('CountPlus3', false);
                }, this);

            this.changeTime({});
            if (model.desktop) {
                this.moveGerman({});
            }
        }


    };

    return {
        create,
        draw
    };
})();
