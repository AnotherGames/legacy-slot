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
            model.group('buttons', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('panel', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('fs', game.add.group());
            model.group('popup', game.add.group());
            model.group('infoTable', game.add.group());
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

            let shadows = game.add.spine(game.world.centerX, game.world.centerY, 'shadows');
            container.add(shadows);
            model.el('shadows', shadows);

            let doorRight = game.add.sprite(game.width * 0.94, game.height * 0.515, 'doorRight', null, container);
            let doorLeft = game.add.sprite(game.width * 0.06, game.height * 0.515, 'doorLeft', null, container);
            doorRight.anchor.set(0.5);
            doorLeft.anchor.set(0.5);
        },

        // addShadows: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //
        //     let shadows = model.el('shadows');
        //     shadows.visible = true;
        //
        //     let side = (game.rnd.integerInRange(0, 1)) ? 'left' : 'right';
        //     if (side == 'right') {
        //         shadows.scale.set(-1, 1);
        //     }
        //
        //     let anim = game.rnd.integerInRange(1, 3);
        //     shadows.setAnimationByName(1, anim, false);
        //
        //     game.time.events.add(8000, () => {
        //         shadows.visible = false;
        //         if (side == 'right') {
        //             shadows.scale.set(1, 1);
        //         }
        //         draw.addShadows({});
        //     });
        // },

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
                        lineNumber.animations.play('win');;
                        game.time.events.add(4000, () => {
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
                        game.time.events.add(4000, () => {
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
            let deltaY = (model.desktop) ? 28 : 18;

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + deltaY);
            machineGroup.mask = someGraphic;
        },

        Multi: function({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x, y;
            if (model.desktop) {
                x = 890;
                y = 75;
            } else {
                x = 90;
                y = 630;
            }
            let fsMultiBG = game.add.sprite(x, y, '11', '11-n-00.png', container);
            fsMultiBG.anchor.set(0.5);
            fsMultiBG.scale.set(1.4);
            fsMultiBG.animations.add('move', Phaser.Animation.generateFrameNames('11-n-', 0, 29, '.png', 2), 20, false);
            fsMultiBG.animations.add('win', Phaser.Animation.generateFrameNames('11-w-', 0, 29, '.png', 2), 20, false);
            // fsMultiBG.animations.play('move');
            model.el('fsMultiBG', fsMultiBG);

            let fsMulti = game.add.sprite(x, y, 'fsMulti', 'x2.png', container);
            fsMulti.anchor.set(0.5);
            if (model.mobile) {
                fsMulti.scale.set(0.8);
            }
            model.el('fsMulti', fsMulti);

        },

        Count: function({
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '80px Helvetica, Arial',
            fontMobile = '60px Helvetica, Arial'
        }) {
            let x, y, countX, countY, font;
            if (model.desktop) {
                x = 600;
                y = 60;
                countX = 65;
                countY = 17;
                font = fontDesktop;
            } else {
                x = game.width * 0.91;
                y = 620;
                countX = 47;
                countY = 13;
                font = fontMobile;
            }

            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
                fsCountBG.anchor.set(0.5);
                (model.desktop) ? fsCountBG.scale.set(0.9) : fsCountBG.scale.set(0.65);
                model.el('fsCountBG', fsCountBG);

            let fsCount = game.add.text(x + countX, y + countY, start, {font: font, align: 'center'}, container);
                fsCount.anchor.set(0.5)
                model.el('fs:count', fsCount);

                let grd = fsCount.context.createLinearGradient(0, 0, 0, fsCount.canvas.height);
                grd.addColorStop(0, '#faef71');
                grd.addColorStop(1, '#f8a600');
                fsCount.fill = grd;

        },

        Character: function({
            game = model.el('game'),
            container = model.group('panel'),
        }) {

            let x, y;
            if (model.desktop) {
                x = 600;
                y = 65;
            } else {
                x = game.width * 0.91;
                y = 620;
            }

            if (model.desktop) {
                let ronin = game.add.sprite(x - 200, y + 10, '2', '02-n-00.png', container);
                ronin.anchor.set(0.5);
                ronin.animations.add('move', Phaser.Animation.generateFrameNames('02-n-', 0, 29, '.png', 2), 20, true);
                ronin.animations.add('win', Phaser.Animation.generateFrameNames('02-w-', 0, 29, '.png', 2), 20, false);
                ronin.animations.play('move');
                model.el('ronin', ronin);

                let ninja = game.add.sprite(x - 200, y + 10, '4', '04-n-00.png', container);
                ninja.anchor.set(0.5);
                ninja.animations.add('move', Phaser.Animation.generateFrameNames('04-n-', 0, 29, '.png', 2), 20, true);
                ninja.animations.add('win', Phaser.Animation.generateFrameNames('04-w-', 0, 29, '.png', 2), 20, false);
                ninja.animations.play('move');
                ninja.visible = false;
                model.el('ninja', ninja);

                let samurai = game.add.sprite(x - 200, y + 10, '6', '06-n-00.png', container);
                samurai.anchor.set(0.5);
                samurai.animations.add('move', Phaser.Animation.generateFrameNames('06-n-', 0, 29, '.png', 2), 20, true);
                samurai.animations.add('win', Phaser.Animation.generateFrameNames('06-w-', 0, 29, '.png', 2), 20, false);
                samurai.animations.play('move');
                samurai.visible = false;
                model.el('samurai', samurai);

                let geisha = game.add.sprite(x - 200, y + 10, '8', '08-n-00.png', container);
                geisha.anchor.set(0.5);
                geisha.animations.add('move', Phaser.Animation.generateFrameNames('08-n-', 0, 29, '.png', 2), 20, true);
                geisha.animations.add('win', Phaser.Animation.generateFrameNames('08-w-', 0, 29, '.png', 2), 20, false);
                geisha.animations.play('move');
                geisha.visible = false;
                model.el('geisha', geisha);

                let star = game.add.sprite(x - 200, y + 10, 'star', null, container);
                star.anchor.set(0.5);
                star.scale.set(1.7);
                star.visible = false;
                let bangAnim = star.animations.add('bang');
                bangAnim.enableUpdate = true;
                model.el('star', star);
                model.el('bangAnim', bangAnim);
            }
        },

        newMulti: function({
            game = model.el('game'),
            container = model.group('panel'),
            number = 4
        }) {

            soundController.sound.playSound({sound: 'changeChar'});

            let fsMultiBG = model.el('fsMultiBG');
            let fsMulti = model.el('fsMulti');

            let fsMultiBig = game.add.sprite(game.world.centerX, game.world.centerY, 'fsMultiBig', `x${number}.png`);
                fsMultiBig.anchor.set(0.5);
                fsMultiBig.scale.set(0.1);

            let x  = (model.desktop) ? game.width * 0.6 : game.width * 0.1;

            game.add.tween(fsMultiBig.scale).to({x: 1.5, y: 1.5}, 500, Phaser.Easing.Bounce.Out, true);
            game.add.tween(fsMultiBig.scale).to({x: 0.1, y: 0.1}, 700, Phaser.Easing.Bounce.Out, true, 500);
            game.add.tween(fsMultiBig).to({x: x, y: game.height * 0.9, alpha: 0}, 700, Phaser.Easing.Bounce.Out, true, 500)
                .onComplete.add(() => {
                    fsMultiBG.animations.play('win');
                    soundController.sound.playSound({sound: 'bonusSword'});
                    game.add.tween(fsMulti.scale)
                    .to({x: 1.5, y: 1.5}, 300, Phaser.Easing.Out, true)
                    .onComplete.add(() => {
                        fsMulti.frameName = `x${number}.png`;
                        game.add.tween(fsMulti.scale)
                        .to({x: 1, y: 1}, 200, Phaser.Easing.In, true)
                    });
                });


            if (model.desktop) {
                let ninja = model.el('ninja');
                let ronin = model.el('ronin');
                let samurai = model.el('samurai');
                let geisha = model.el('geisha');
                let star = model.el('star');
                let bangAnim = model.el('bangAnim');

                if (number == 4) {
                    star.visible = true;
                    bangAnim.play(20, false);
                    bangAnim.onUpdate.add(() => {
                        if (bangAnim.currentFrame.name === 'star-animation_12.png'){
                            ronin.visible = false;
                            ninja.visible = true;
                        }
                    });
                    bangAnim.onComplete.add(() => {star.visible = false});
                }

                if (number == 6) {
                    star.visible = true;
                    bangAnim.play(20, false);
                    bangAnim.onUpdate.add(() => {
                        if (bangAnim.currentFrame.name === 'star-animation_12.png'){
                            ninja.visible = false;
                            samurai.visible = true;
                        }
                    });
                    bangAnim.onComplete.add(() => {star.visible = false});
                }

                if (number == 8) {
                    star.visible = true;
                    bangAnim.play(20, false);
                    bangAnim.onUpdate.add(() => {
                        if (bangAnim.currentFrame.name === 'star-animation_12.png'){
                            samurai.visible = false;
                            geisha.visible = true;
                        }
                    });
                    bangAnim.onComplete.add(() => {star.visible = false});
                }
            }

        }

    };

    return {
        create,
        draw
    };
})();
