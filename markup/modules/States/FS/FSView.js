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
            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
            gameMachine.anchor.set(0.5);
            gameMachine.alpha = 0;
            model.el('gameMachine', gameMachine);

            let deltaX = (model.desktop) ? 106 : 81;
            let deltaY = (model.desktop) ? 55 : 50;
            let deltaY2 = (model.desktop) ? 37 : -18;
            let y1 = (model.desktop) ? 80 : 55;
            let y2 = (model.desktop) ? 100 : 15;

            let fonTop = game.add.sprite(-10, gameMachine.top + y1, 'fonTopFS', null, container);
            fonTop.anchor.set(0.5);

            let fonBottom = game.add.sprite(-10, gameMachine.bottom - y2, 'fonBottomFS', null, container);
            fonBottom.anchor.set(0.5);

            let logoGM = game.add.sprite(0, gameMachine.top + deltaY, 'logoGM', null, container);
            logoGM.anchor.set(0.5);

            let lineLeft = game.add.sprite(gameMachine.left + deltaX, config[model.res].gameMachine.y - deltaY2, 'lineLeft', null, container);
            lineLeft.anchor.set(0.5);

            let lineRight = game.add.sprite(gameMachine.right - deltaX, config[model.res].gameMachine.y - deltaY2, 'lineRight', null, container);
            lineRight.anchor.set(0.5);
        },

        machineContainer: function ({
            game = model.el('game'),
            gameMachine = model.el('gameMachine'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 2);
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
            let deltaY = (model.desktop) ? 50 : 25;
            let someGraphic = game.add.graphics(-elSize.width * 2.5 - 250, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5 + 550, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        Multi: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1,
            fontDesktop = '60px Helvetica, Arial',
            fontMobile = '50px Helvetica, Arial'
        }) {

            let x, y, deltaX = 0, deltaY = 0, font, fsMultiBG;
            if (model.desktop) {
                x = 175;
                y = -55;
                font = fontDesktop;
            } else {
                x = model.el('game').width / 2 + 145;
                y = 610;
                deltaY = 13;
                font = fontMobile;
                fsMultiBG = game.add.sprite(x, y, 'fsMultiBG', null, container);
                fsMultiBG.anchor.set(0.5);
            }

            let fsMulti;
            fsMulti = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
            // fsMulti.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
            fsMulti.anchor.set(0.5);
            if (model.mobile) {
                fsMulti.visible = false;
                fsMultiBG.visible = false;
            }
            model.el('fsMulti', fsMulti);
            setTimeout(() => {
                fsMulti.text = 2;
                fsMulti.text = start;
            }, 300);

            draw._drawShell({});
        },

        _drawShell: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x = (model.desktop) ? 800 : 1220;
            let y = (model.desktop) ? -300 : 500;
            let deltaY = (model.desktop) ? 250 :  170;

            let shell1 = game.add.sprite(x, y, 'shell', null, container);
            shell1.anchor.set(0.5);
	        shell1.name = 'shell1'

            shell1.animations.add('idle', Phaser.Animation.generateFrameNames('s-idle-c', 0, 29, '.png', 2), 20, true);
            shell1.animations.add('open', Phaser.Animation.generateFrameNames('s-o-', 0, 29, '.png', 2), 20, false);
            shell1.animations.add('openIdle', Phaser.Animation.generateFrameNames('s-idle-o', 0, 29, '.png', 2), 20, true);
            shell1.animations.play('idle');
            model.el('shell1', shell1);

            let shell2 = game.add.sprite(x, y - deltaY, 'shell', null, container);
            shell2.anchor.set(0.5);
	        shell2.name = 'shell2'

            shell2.animations.add('idle', Phaser.Animation.generateFrameNames('s-idle-c', 0, 29, '.png', 2), 20, true);
            shell2.animations.add('open', Phaser.Animation.generateFrameNames('s-o-', 0, 29, '.png', 2), 20, false);
            shell2.animations.add('openIdle', Phaser.Animation.generateFrameNames('s-idle-o', 0, 29, '.png', 2), 20, true);
            shell2.animations.play('idle');

            model.el('shell2', shell2);

            let shell3 = game.add.sprite(x, y - deltaY * 2, 'shell', null, container);
            shell3.anchor.set(0.5);
	        shell3.name = 'shell3'

            shell3.animations.add('idle', Phaser.Animation.generateFrameNames('s-idle-c', 0, 29, '.png', 2), 20, true);
            shell3.animations.add('open', Phaser.Animation.generateFrameNames('s-o-', 0, 29, '.png', 2), 20, false);
            shell3.animations.add('openIdle', Phaser.Animation.generateFrameNames('s-idle-o', 0, 29, '.png', 2), 20, true);
            shell3.animations.play('idle');

            model.el('shell3', shell3);

            if (model.desktop) {
                shell1.scale.set(1.3);
                shell2.scale.set(1.3);
                shell3.scale.set(1.3);
            } else {
                shell1.scale.set(0.9);
                shell2.scale.set(0.9);
                shell3.scale.set(0.9);
            }

            let perlContainer = game.add.group();
            container.add(perlContainer);
            let perlDelta = (model.desktop) ? 125 : 80;
            perlContainer.x = shell1.x;
            perlContainer.y = shell1.y + perlDelta;
            if (model.mobile) {
                perlContainer.scale.set(0.8);
            }

            let perlCounter = game.add.sprite(0, 0, 'perlCounter', null, perlContainer);
            perlCounter.anchor.set(0.5);

            let perlsArr = [];
            let perlY = (model.desktop) ? 15 : 10;

            for (let i = 0; i < 5; i++) {
                let perlSmall = game.add.sprite(2, perlY, 'perlSmall', null, perlContainer);
                perlSmall.anchor.set(0.5);
                perlsArr.push(perlSmall);
            }

            perlsArr.forEach((perl, index) => {
                if (index == 0) {
                    perl.x = (model.desktop) ? perl.x - 90 : perl.x - 90 * 2 / 3;
                    perl.y = (model.desktop) ? perl.y - 22 : perl.y - 22 * 2 / 3;
                }
                if (index == 1) {
                    perl.x = (model.desktop) ? perl.x - 45 : perl.x - 45 * 2 / 3;
                    perl.y = (model.desktop) ? perl.y - 7 : perl.y - 7 * 2 / 3;
                }
                if (index == 3) {
                    perl.x = (model.desktop) ? perl.x + 45 : perl.x + 45 * 2 / 3;
                    perl.y = (model.desktop) ? perl.y - 5 : perl.y - 5 * 2 / 3;
                }
                if (index == 4) {
                    perl.x = (model.desktop) ? perl.x + 88 : perl.x + 88 * 2 / 3;
                    perl.y = (model.desktop) ? perl.y - 22 : perl.y - 22 * 2 / 3;
                }
                perl.visible = false;
            });

            model.el('perlsArr', perlsArr);
            model.group('perlContainer', perlContainer);
        },

        changeMulti: function ({
            number = 1,
            counter = 1,
            container = model.group('panel'),
            game = model.el('game')
        }) {
	        model.data('fsMulti', number);
	        model.el('fsMulti').text = number;
	        console.log('here');
	        let shell = model.el(`shell${counter}`);
            let fsMultiBig = game.add.sprite(shell.x, shell.y - 50, 'multi', `x${number}.png`, container);
            fsMultiBig.anchor.set(0.5);
            // fsMultiBig.alpha = 0;
            fsMultiBig.scale.set(0.1);

	        // debugger;
            console.log(shell.name)
	        shell.animations.play('open');
	        shell.animations.getAnimation('open').onComplete.add(() => {
		        shell.animations.play('openIdle');
		        game.add.tween(fsMultiBig).to({alpha: 1}, 500, 'Linear', true);
		        game.add.tween(fsMultiBig.scale).to({x: 1.5, y: 1.5}, 1000, Phaser.Easing.Elastic.Out, true)
			        .onComplete.add(() => {
			        game.add.tween(fsMultiBig.scale).to({x: 1.0, y: 1.0}, 300, 'Linear', true);
		        }, this);
	        });


        },

        Level: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1,
            fontDesktop = '60px Helvetica, Arial',
            fontMobile = '50px Helvetica, Arial'
        }) {

            let x, y, deltaX = 0, deltaY = 0, font, fsLevelBG;
            if (model.desktop) {
                x = -175;
                y = -55;
                font = fontDesktop;
            } else {
                x = model.el('game').width / 2 - 115;
                y = 610;
                deltaY = 13;
                font = fontMobile;
                fsLevelBG = game.add.sprite(x, y, 'fsLevelBG', null, container);
                fsLevelBG.anchor.set(0.5);
            }

            let fsLevel;
                fsLevel = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
                // fsLevel.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
                fsLevel.anchor.set(0.5);
                if (model.mobile) {
                    fsLevel.visible = false;
                    fsLevelBG.visible = false;
                }
                model.el('fsLevel', fsLevel);
            setTimeout(() => {
                fsLevel.text = 2;
                fsLevel.text = start;
            }, 300);


            draw._drawMermaid({});
        },

        _drawMermaid: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {

            let x = (model.desktop) ? -830 : 60;
            let y = (model.desktop) ? -500 : 400;
            let deltaX = (model.desktop) ? 107 : 73;
            let deltaY = (model.desktop) ? 160 : 110;

            let mermaidFS = game.add.sprite(x, y, `mermaidFS`, null, container);
                mermaidFS.anchor.set(0.5);
                if (model.desktop) {
                    mermaidFS.scale.set(1.3);
                }
                mermaidFS.animations.add('move', Phaser.Animation.generateFrameNames(`rusalka-idle-0-1_`, 0, 29, '.png', 1), 15, true);
                mermaidFS.animations.play('move')
                mermaidFS.animations.getAnimation('move').onLoop.add(() => {
                    if (model.state('changeLevel') == true) {
                        let rollData = model.data('rollResponse');
                        let levelValue = rollData.FsBonus.Level;
                        draw.changeLevel({number: levelValue});
                        model.data('fsLevel', levelValue);
                    }
                });

                model.el('mermaidFS', mermaidFS);

            let perl = game.add.sprite(x + deltaX, y - deltaY- 500, `perl`, null, container);
                perl.anchor.set(0.5);
                perl.animations.add('fall', Phaser.Animation.generateFrameNames(`G-animation_`, 16, 29, '.png', 1), 15, false);
                perl.visible = false;
                model.el('perl', perl);

            let box = game.add.sprite(x + deltaX, y - deltaY, `box`, null, container);
                box.anchor.set(0.5);
                box.animations.add('0', Phaser.Animation.generateFrameNames(`rusalka-idle-0_`, 0, 29, '.png', 1), 15, true);
                box.animations.add('1', Phaser.Animation.generateFrameNames(`rusalka-idle-1_`, 0, 29, '.png', 1), 15, true);
                box.animations.add('2', Phaser.Animation.generateFrameNames(`rusalka-idle-2_`, 0, 29, '.png', 1), 15, true);
                box.animations.add('3', Phaser.Animation.generateFrameNames(`rusalka-idle-3_`, 0, 29, '.png', 1), 15, true);
                box.animations.add('4', Phaser.Animation.generateFrameNames(`rusalka-idle-4_`, 0, 29, '.png', 1), 15, true);
                box.animations.add('5', Phaser.Animation.generateFrameNames(`rusalka-idle-5_`, 0, 29, '.png', 1), 15, true);
                box.animations.play('0');

                model.el('box', box);


        },

        changeLevel: function ({
            number = 1,
            container = model.group('panel'),
            game = model.el('game')
        }) {
            model.state('changeLevel', false);

            let fsLevel = model.el('fsLevel');
            let box = model.el('box');
            let mermaidFS = model.el('mermaidFS');
            let currNumber = number % 5;

            let perlsArr = model.el('perlsArr');
            let perlContainer = model.group('perlContainer');
            let deltaY = (model.desktop) ? 250 :  170;

            if (currNumber == 0) {
                fsLevel.text = 5;
                box.animations.play('5');
                perlsArr[4].visible = true;
                model.el('fsLevel', fsLevel);
	            perlsArr.forEach((perl) => {
		            perl.visible = false;
	            });

                fsLevel.text = currNumber;
                model.el('fsLevel', fsLevel);

                box.animations.play(currNumber + '');
                game.add.tween(perlContainer).to({alpha: 0}, 150, 'Linear', true)
                    .onComplete.add(() => {
                        perlContainer.y = perlContainer.y - deltaY;

                        game.add.tween(perlContainer).to({alpha: 1}, 150, 'Linear', true)
                    });
            } else {
                fsLevel.text = currNumber;
                model.el('fsLevel', fsLevel);
                box.animations.play(currNumber + '');
                perlsArr.forEach((perl, index) => {
                    if (index == currNumber - 1) {
                        perl.visible = true;
                    }
                });
            }
            // soundController.sound.playSound({sound: 'diverDown'});
        },

        Count: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '80px Helvetica, Arial',
            fontMobile = '40px Helvetica, Arial'
        }) {
            let x, y, deltaX, deltaY, font;
            if (model.mobile) {
                x = 80;
                y = 110;
                deltaX = 0;
                deltaY = 3;
                font = fontMobile;

                let fsCountBG = game.add.sprite(x, y, 'autoSelect', null, container);
                fsCountBG.anchor.set(0.5);
                fsCountBG.scale.set(1.5);
                model.el('fsCountBG', fsCountBG);
            } else {
                x = 10;
                y = -75;
                deltaX = -15;
                deltaY = 0;
                font = fontDesktop;
            }

            let fsCount = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
            // fsCount.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
            fsCount.anchor.set(0.5);
            model.el('fs:count', fsCount);
        },

        CountPlus3: function ({
            game = model.el('game'),
            container = model.group('main'),
            x = 0,
            y = game.height / 5 * -1,
            deltaY = 15
        }) {
            if (model.state('CountPlus3')) return;
            model.state('CountPlus3', true);

            // Show perl

            let perl = model.el('perl');
            let box = model.el('box');
            perl.visible = true;
            perl.animations.play('fall');
            game.add.tween(perl).to({y: box.y}, 300, 'Linear', true)
                .onComplete.add(() => {
                    perl.visible = false;
                    perl.y = perl.y - 500;
                }, this);

            if (model.desktop) {
                deltaY = 30;
            }

            let plus3Group = game.add.group(container);
            plus3Group.scale.set(0.3);
            plus3Group.x = x;
            plus3Group.y = y - deltaY;

            let circle = game.add.graphics(0, 0, plus3Group);
            circle.beginFill(0x000000, 0.3).drawCircle(0, 0, 200);
            // let plus3 = game.add.sprite(0, 0, 'plus3', null, plus3Group);
            // plus3.anchor.set(0.5);
            // model.el('plus3', plus3);

            let fontSize = (model.desktop) ? 35 : 25;

            let plus3 = game.add.bitmapText(0, 40, 'numbersFont', '+3', fontSize, plus3Group);
            plus3.align = 'center';
            plus3.anchor.set(0.5);
            model.el('plus3', plus3);

            let tweenY;
            let tweenX;

            if (model.desktop) {
                tweenX = plus3Group.x;
                tweenY = 900;
            } else {
                tweenX = plus3Group.x;
                tweenY = 650;
            }

            game.add.tween(plus3Group.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(plus3Group).to({x: tweenX, y: tweenY}, 400, 'Linear', true, 500);
            game.add.tween(plus3Group).to({alpha: 0}, 200, 'Linear', true, 700)
                .onComplete.add(() => {
                    plus3Group.destroy();
                    model.state('CountPlus3', false);
                }, this);
        }


    };

    return {
        create,
        draw
    };
})();
