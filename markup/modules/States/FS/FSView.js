import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { controller as soundController } from 'modules/Sound/SoundController';
import { view as transitionView } from 'modules/Transition/TransitionView';

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

        // addPole: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //     let pole = game.add.spine(50, game.height * 0.95, 'pole');
        //     pole.setAnimationByName(1, '1', true);
        //     model.group('bg').add(pole);
        //     pole.scale.set(0.5);
        //     model.el('pole', pole);
        //
        //     let time = game.rnd.integerInRange(20, 35);
        //     let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
        //
        //     pole.x = (side === 'left') ? -pole.width : game.width + pole.width;
        //     let delta = (side === 'left') ? game.width + pole.width : -pole.width;
        //     if (side === 'right') {
        //         pole.width = -pole.width;
        //     }
        //
        //     game.add.tween(pole).to({x: delta}, time * 1000, 'Linear', true)
        //         .onComplete.add(() => {
        //             pole.destroy();
        //             game.time.events.add(3000, () => {
        //                 this.addPole({});
        //             });
        //         }, this);
        //
        // },
        //
        // addCows: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //     soundController.sound.playSound({sound: 'cows'});
        //
        //     let cowContainer = game.add.group();
        //         cowContainer.inputEnableChildren = true;
        //         cowContainer.onChildInputDown.add(()=>{
        //             soundController.sound.playSound({sound: 'moo', volume: 7})
        //         })
        //
        //     container.add(cowContainer);
        //
        //     let cow1 = game.add.sprite(-50, 10, 'cow1', null, cowContainer);
        //     let cow2 = game.add.sprite(-150, 15, 'cow3', null, cowContainer);
        //     let cow3 = game.add.sprite(-250, 20, 'cow3', null, cowContainer);
        //     let cow4 = game.add.sprite(-120, 10, 'cow1', null, cowContainer);
        //     let cow0 = game.add.sprite(-300, 20, 'cow2', null, cowContainer);
        //
        //     let cowboy = game.add.sprite(0, 0, 'cowboy', null, container);
        //     let red_indian = game.add.sprite(0, 0, 'red_indian', null, container);
        //
        //     cowboy.inputEnabled = true;
        //     cowboy.events.onInputDown.add(()=>{
        //         soundController.sound.playSound({sound: 'whip', volume: 7})
        //     });
        //     red_indian.inputEnabled = true;
        //     red_indian.events.onInputDown.add(()=>{
        //         soundController.sound.playSound({sound: 'whip', volume: 7})
        //     });
        //
        //     let time = game.rnd.integerInRange(55, 70);
        //     let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
        //
        //     cowContainer.x = (side === 'left') ? -cowContainer.width : game.width + cowContainer.width;
        //     cowContainer.y = game.rnd.integerInRange(720, 870);
        //     let delta = (side === 'left') ? game.width + cowContainer.width : -cowContainer.width;
        //     if (side === 'left') {
        //         cowContainer.width = -cowContainer.width;
        //     }
        //
        //     cowboy.x = (side === 'left') ? -cowboy.width : game.width + cowboy.width;
        //     cowboy.y = cowContainer.y;
        //     if (side === 'left') {
        //         cowboy.width = -cowboy.width;
        //     }
        //
        //     red_indian.x = (side === 'left') ? -red_indian.width - 300 : game.width + red_indian.width + 300;
        //     red_indian.y = cowContainer.y;
        //     if (side === 'left') {
        //         red_indian.width = -red_indian.width;
        //     }
        //
        //     let animArr = [];
        //     let cow0Anim = cow0.animations.add('idle', Phaser.Animation.generateFrameNames('cow-2-walk2_', 0, 14, '.png', 1));
        //     let cow1Anim = cow1.animations.add('idle1', Phaser.Animation.generateFrameNames('cow-1-walk1_', 0, 14, '.png', 1));
        //     let cow2Anim = cow2.animations.add('idle2', Phaser.Animation.generateFrameNames('cow-3-walk3_', 0, 14, '.png', 1));
        //     let cow3Anim = cow3.animations.add('idle3', Phaser.Animation.generateFrameNames('cow-3-walk3_', 0, 14, '.png', 1));
        //     let cow4Anim = cow4.animations.add('idle4', Phaser.Animation.generateFrameNames('cow-1-walk1_', 0, 14, '.png', 1));
        //     let cowboyAnim = cowboy.animations.add('idle5', Phaser.Animation.generateFrameNames('cowboi-animation_', 0, 14, '.png', 1));
        //     let red_indianAnim = red_indian.animations.add('idle6', Phaser.Animation.generateFrameNames('indeets-walk_', 0, 14, '.png', 1));
        //     animArr.push(cow0Anim, cow1Anim, cow2Anim, cow3Anim, cow4Anim, cowboyAnim, red_indianAnim);
        //     animArr.forEach((anim) => {
        //         anim.play(12, true);
        //     });
        //
        //     game.add.tween(cowContainer).to({x: delta}, time * 1000, 'Linear', true, 0);
        //     game.add.tween(cowboy).to({x: delta}, time * 1000, 'Linear', true, 3000);
        //     game.add.tween(red_indian).to({x: delta}, time * 1000, 'Linear', true, 6000)
        //         .onComplete.add(() => {
        //             cowContainer.destroy();
        //             cowboy.destroy();
        //             red_indian.destroy();
        //             soundController.sound.stopSound('cows');
        //             game.time.events.add(3000, () => {
        //                 this.addCows({});
        //             });
        //         }, this);
        //
        // },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            if (model.desktop) {
                let gmRight = game.add.sprite(730, -370, 'gmRight', null, container);
                gmRight.anchor.set(0.5);
                model.el('gmRight', gmRight);

                let gmLeft = game.add.sprite(-730, -370, 'gmLeft', null, container);
                gmLeft.anchor.set(0.5);
                model.el('gmLeft', gmLeft);

                let lamp1 = game.add.sprite(-750, -240, 'lamp', null, container);
                lamp1.anchor.set(0.5);
                lamp1.animations.add('move');
                lamp1.animations.play('move', 15, true);
                model.el('lamp1', lamp1);

                let lamp2 = game.add.sprite(750, -240, 'lamp', null, container);
                lamp2.anchor.set(0.5);
                lamp2.scale.set(-1, 1);
                lamp2.animations.add('move');
                game.time.events.add(300, () => {
                    lamp2.animations.play('move', 15, true);
                })
                model.el('lamp2', lamp2);
            }
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let sprite = (i < 10) ? 'plashka2-0' + i +'-open_0.png' : 'plashka2-' + i +'-open_0.png';
                let prefix = (i < 10) ? 'plashka2-0' : 'plashka2-';

                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2,
                    config[model.res].win[i][0].y - gameMachine.height / 2,
                    'lineNumbersLeft',
                    sprite,
                    container);

                lineNumber.name = name;
                lineNumber.anchor.set(0.5);

                lineNumber.animations.add('close', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 19, 0, '.png', 1), 30, false);
                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 0, 20, '.png', 1), 30, false);

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                // lineNumber.input.pixelPerfectOver = 1;
                if (model.desktop) {
                    lineNumber.events.onInputOver.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        lineNumber.animations.play('win');
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        lineNumber.animations.play('win');

                        game.time.events.add(1000, () => {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        });
                    });
                }

                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let sprite = (i < 10) ? 'plashka-0' + i +'-open_0.png' : 'plashka-' + i +'-open_0.png';
                let prefix = (i < 10) ? 'plashka-0' : 'plashka-';

                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2 - 8,
                    config[model.res].win[i][0].y - gameMachine.height / 2,
                    'lineNumbers',
                    sprite,
                    container);

                lineNumber.name = name;
                lineNumber.anchor.set(0.5);

                lineNumber.animations.add('close', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 19, 0, '.png', 1), 30, false);
                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 0, 20, '.png', 1), 30, false);

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                // lineNumber.input.pixelPerfectOver = 1;
                if (model.desktop) {
                    lineNumber.events.onInputOver.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        lineNumber.animations.play('win');
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        lineNumber.animations.play('win');

                        game.time.events.add(1000, () => {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        });
                    });
                }

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
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + 22);
            machineGroup.mask = someGraphic;
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
            container = model.group('panel')
        }) {

            let x, y, deltaX = 0, deltaY = 0;
            if (model.desktop) {
                x = 800;
                y = 100;
                deltaX = 80;
            } else {
                // let fsMultiBG = game.add.sprite(1215, 360, 'bottleBG', null, container);
                //     fsMultiBG.anchor.set(0.5);

                x = 1220;
                y = 190;
                deltaY = 165;
            }

            draw._drawFsMulti(x, y, deltaX, deltaY);
            // draw._drawBottle(x, y, deltaX, deltaY);
        },

        _drawFsMulti: function(x, y, deltaX, deltaY){
            let game = model.el('game');
            let container = model.group('panel');

            let fsMulti4 = game.add.sprite(x - 5, y, 'x4', null, container);
                fsMulti4.anchor.set(0.5);
                fsMulti4.visible = false;
                model.el('fsMulti4', fsMulti4);
            let fsMulti6 = game.add.sprite(x + deltaX - 5, y + deltaY, 'x6', null, container);
                fsMulti6.anchor.set(0.5);
                fsMulti6.visible = false;
                model.el('fsMulti6', fsMulti6);
            let fsMulti8 = game.add.sprite(x + 2 * deltaX - 5, y + 2 * deltaY, 'x8', null, container);
                fsMulti8.anchor.set(0.5);
                fsMulti8.visible = false;
                model.el('fsMulti8', fsMulti8);
        },

        // _drawBottle: function(x, y, deltaX, deltaY){
        //     let game = model.el('game');
        //     let container = model.group('panel');
        //
        //     if (model.desktop) {
        //         let corrX = 20, corrY = 50;
        //
        //         let bottleShadow4 = game.add.image(x + corrX, y + corrY, 'bottleShadow', null, container);
        //             bottleShadow4.anchor.set(0.5);
        //         model.el('bottleShadow4', bottleShadow4);
        //         let bottleShadow6 = game.add.image(x + deltaX + corrX, y + deltaY + corrY, 'bottleShadow', null, container);
        //             bottleShadow6.anchor.set(0.5);
        //         model.el('bottleShadow6', bottleShadow6);
        //         let bottleShadow8 = game.add.image(x + 2 * deltaX + corrX, y + 2 * deltaY + corrY, 'bottleShadow', null, container);
        //             bottleShadow8.anchor.set(0.5);
        //         model.el('bottleShadow8', bottleShadow8);
        //
        //         let brokenBottleShadow4 = game.add.image(x + corrX, y + corrY, 'brokenBottleShadow', null, container);
        //             brokenBottleShadow4.anchor.set(0.5);
        //             brokenBottleShadow4.visible = false;
        //         model.el('brokenBottleShadow4', brokenBottleShadow4);
        //         let brokenBottleShadow6 = game.add.image(x + deltaX + corrX, y + deltaY + corrY, 'brokenBottleShadow', null, container);
        //             brokenBottleShadow6.anchor.set(0.5);
        //             brokenBottleShadow6.visible = false;
        //         model.el('brokenBottleShadow6', brokenBottleShadow6);
        //         let brokenBottleShadow8 = game.add.image(x + 2 * deltaX + corrX, y + 2 * deltaY + corrY, 'brokenBottleShadow', null, container);
        //             brokenBottleShadow8.anchor.set(0.5);
        //             brokenBottleShadow8.visible = false;
        //         model.el('brokenBottleShadow8', brokenBottleShadow8);
        //     }
        //
        //     let fsBottle4 = game.add.sprite(x, y, 'bottle', 'Bottlebang-Bang0.png', container);
        //         fsBottle4.anchor.set(0.5);
        //     model.el('fsBottle4', fsBottle4);
        //     let fsBottle6 = game.add.sprite(x + deltaX, y + deltaY, 'bottle', 'Bottlebang-Bang0.png', container);
        //         fsBottle6.anchor.set(0.5);
        //     model.el('fsBottle6', fsBottle6);
        //     let fsBottle8 = game.add.sprite(x + 2 * deltaX, y + 2 * deltaY, 'bottle', 'Bottlebang-Bang0.png', container);
        //         fsBottle8.anchor.set(0.5);
        //     model.el('fsBottle8', fsBottle8);
        //
        // },
        //
        // addBangs: function ({
        //     sprite
        // }) {
        //     // Взрыв для бутылки
        //     let game = model.el('game');
        //     let bangs = [];
        //     for (let i = 0; i < 5; i++) {
        //         let bang = game.add.sprite(game.rnd.integerInRange(sprite.worldPosition.x - 50, sprite.worldPosition.x + 50),
        //         game.rnd.integerInRange(sprite.worldPosition.y-50, sprite.worldPosition.y + 50),
        //         'bigBang');
        //         bang.scale.set(game.rnd.integerInRange(8, 20) / 100);
        //         bang.anchor.set(0.5);
        //         bang.angle = game.rnd.integerInRange(-10, 10);
        //         bang.alpha = 0;
        //         bangs.push(bang);
        //     }
        //     return bangs;
        // },
        //
        // addAim: function ({
        //     sprite,
        //     callback
        // }) {
        //     let game = model.el('game');
        //
        //     let x = (model.desktop) ? game.width / 2 : model.group('panel').width / 2 - 100;
        //     let y = (model.desktop) ? game.height / 2 - 100 : 300;
        //
        //     let aim = game.add.sprite(x, y, 'aim');
        //         aim.anchor.set(0.5);
        //         aim.scale.set(0.1);
        //     model.el('aim', aim);
        //     game.add.tween(aim.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true)
        //     game.add.tween(aim).to({x: sprite.worldPosition.x, y: sprite.worldPosition.y}, 500, 'Linear', true, 1000)
        //         .onComplete.add(() => {
        //             game.add.tween(aim.scale).to({x: 0.2, y: 0.2}, 500, 'Linear', true)
        //                 .onComplete.add(() => {
        //                     draw.showBottleBangs({
        //                         callback,
        //                         sprite
        //                     });
        //                 });
        //         });
        // },
        //
        // showBottleBangs: function ({callback, sprite}) {
        //     let game = model.el('game');
        //     let bangs = draw.addBangs({
        //         sprite
        //     });
        //     let bangDestroyCounter = 0;
        //     bangs.forEach((bang, index) => {
        //         game.time.events.add(150 * index, () => {
        //             soundController.sound.playSound({sound: 'lineWin'})
        //             game.add.tween(bang).to({alpha: 1}, 150, 'Linear', true)
        //                 .onComplete.add(() => {
        //                     game.add.tween(bang).to({alpha: 0}, 150, 'Linear', true)
        //                         .onComplete.add(() => {
        //                             bangDestroyCounter++;
        //                             if (bangDestroyCounter == bangs.length) {
        //                                 callback();
        //                             }
        //                             bang.destroy();
        //                         })
        //                 });
        //         });
        //     });
        // },
        //
        // ShowMulti: function({
        //     game = model.el('game'),
        //     container = model.group('panel'),
        //     number = 4
        // }) {
        //     let fsBottle = model.el(`fsBottle${number}`);
        //     let fsMulti = model.el(`fsMulti${number}`);
        //     let bottleShadow = model.el(`bottleShadow${number}`);
        //     let brokenBottleShadow = model.el(`brokenBottleShadow${number}`);
        //
        //     // let fsMultiBig = game.add.sprite(game.width / 2, game.height / 2, `x${number}`);
        //     // fsMultiBig.anchor.set(0.5);
        //     // fsMultiBig.alpha = 0;
        //
        //     draw.addAim({
        //         sprite: fsBottle,
        //         callback: () => {
        //             soundController.sound.playSound({sound: 'bottleBangSound', duration: 1000});
        //             soundController.sound.changeSoundVolume('bottleBangSound', 1000);
        //
        //             let aim = model.el('aim');
        //             aim.destroy();
        //
        //             fsBottle.animations.add('bottleBang');
        //             fsBottle.animations.play('bottleBang', 12, false);
        //             fsMulti.visible = true;
        //             // game.add.tween(fsMultiBig.scale).to({x: 3.5, y: 3.5}, 500, 'Linear', true);
        //             // game.add.tween(fsMultiBig).to({alpha: 1}, 500, 'Linear', true)
        //             //     .onComplete.add(() => {
        //             //         fsMultiBig.destroy();
        //             //     })
        //
        //             if (model.desktop) {
        //                 bottleShadow.visible = false;
        //                 brokenBottleShadow.visible = true;
        //             }
        //         }
        //     })
        //
        // },

        Count: function({
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '80px Helvetica, Arial',
            fontMobile = '60px Helvetica, Arial'
        }) {
            let x, y, countX, countY, font;
            if (model.mobile) {
                x = 55;
                y = 520;
                countX = 13;
                countY = 13;
                font = fontMobile;
            } else {
                x = 600;
                y = 65;
                countX = 60;
                countY = 17;
                font = fontDesktop;
            }

            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
                fsCountBG.anchor.set(0.5);
                fsCountBG.scale.set(0.9);
                model.el('fsCountBG', fsCountBG);

            let fsCount = game.add.text(x + countX, y + countY, start, {font: font, fill: '#faef71', align: 'center'}, container);
                fsCount.anchor.set(0.5)
                model.el('fs:count', fsCount);
        },

        CountPlus3: function({
            game = model.el('game'),
            container = model.group('main'),
            x = 0,
            y = game.height / 5 * -1,
            deltaY = 15
        }) {
            if (model.state('CountPlus3')) return;
            model.state('CountPlus3', true);

            if (model.desktop) {
                deltaY = 30;
            }

            let plus3Group = game.add.group(container);
                plus3Group.scale.set(0.3);
                plus3Group.x = x;
                plus3Group.y = y - deltaY;

            let circle = game.add.graphics(0, 0, plus3Group);
                circle.beginFill(0x000000, 0.6).drawCircle(0, 0, 200);
            let plus3 = game.add.sprite(0, 0, 'plus3', null, plus3Group);
                plus3.anchor.set(0.5);
            model.el('plus3', plus3);

            let tweenY;
            let tweenX;

            if(model.desktop) {
                tweenX = plus3Group.x;
                tweenY = 950;
            } else {
                tweenX = -450;
                tweenY = 100;
            }

            game.add.tween(plus3Group.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(plus3Group).to({x: tweenX, y: tweenY}, 400, 'Linear', true, 500);
            game.add.tween(plus3Group).to({alpha: 0}, 200, 'Linear', true, 700)
                .onComplete.add(() => {
                    plus3Group.destroy();
                    model.state('CountPlus3', false);
                    view.draw._showBang({});
                }, this);
        },

        // _showBang: function ({
        //     game = model.el('game'),
        //     container = model.group('panel')
        // }) {
        //     let fsCountBG = model.el('fsCountBG');
        //     fsCountBG.animations.add('bang', [0, 1, 2, 3, 4, 0]);
        //     fsCountBG.animations.play('bang', 12, false);
        //
        // },
        //
        // drum: function ({
        //     game = model.el('game'),
        //     container = model.group('panel')
        // }) {
        //     let x, y, deltaX, deltaY, scaleDrum, scaleBullet;
        //     if (model.mobile) {
        //         x = 72;
        //         y = 335;
        //         deltaX = -2;
        //         deltaY = -130;
        //         let drumBG = game.add.sprite(72, 280, 'drumBG', null, container);
        //             drumBG.anchor.set(0.5);
        //             drumBG.scale.set(0.95);
        //         scaleDrum = 0.5;
        //         scaleBullet = 0.6;
        //     } else {
        //         x = 495;
        //         y = 100;
        //         deltaX = 135;
        //         deltaY = 15;
        //         scaleDrum = 0.35;
        //         scaleBullet = 0.45;
        //     }
        //     let drum = game.add.sprite(x, y, 'baraban', 'B-0.png', container);
        //         drum.anchor.set(0.5);
        //         drum.scale.set(scaleDrum);
        //     model.el('drum', drum);
        //
        //     let bullet = game.add.sprite(x - deltaX, y + deltaY, '11', '11-n.png', container);
        //         bullet.anchor.set(0.5);
        //         bullet.scale.set(scaleBullet);
        //     model.el('bullet', bullet);
        // },

        drumSpin: function ({
            game = model.el('game'),
            container = model.group('panel'),
            number = 0
        }) {
            let rollData = model.data('rollResponse');
            let multiValue = rollData.FsBonus.Multi;
            let bullet = model.el('bullet');
            let drum = model.el('drum');

            let bulletAnim = bullet.animations.add('win', win);
            let win = Phaser.Animation.generateFrameNames(`11-w-`, 1, 10, '.png', 2);

            //Если достигнут максимальный множитель то анимация пули и барабана зацикливается
            if (multiValue == 8) {
                drum.frameName = 'B-6.png';
                game.add.tween(drum).to({rotation: 2 * Math.PI}, 3000, 'Linear', true, 0, -1);
                bulletAnim.play(12, true);
                model.state('maxFsMultiplier', true)
            } else {
                bulletAnim.onComplete.add(() => {bullet.frameName = '11-n.png'}, this);
                bulletAnim.play(12);
                game.add.tween(model.el('drum')).to({rotation: 2 * Math.PI * 4}, 500, Phaser.Easing.Exponential.Out, true, 0, 0)
                .onComplete.add(()=> {
                    drum.frameName = `B-${number}.png`;
                    drum.rotation = 0;
                });
            }

        }

    };

    return {
        create,
        draw
    };
})();
