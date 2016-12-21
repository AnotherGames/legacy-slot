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
            model.group('panel', game.add.group());
            model.group('main', game.add.group());
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

            let mainBGSky = game.add.sprite(0, 0, 'mainBGSky', null, container);
            model.el('mainBGSky', mainBGSky);

            let gradient = game.add.sprite(0, 0, 'gradient', null, container);
            gradient.alpha = 0.1;
            model.el('gradient', gradient);
            game.add.tween(gradient).to({alpha: 0.9}, 50000, 'Linear', true, 0, -1, true);

            for (let i = 0; i < 5; i++) {
                transitionView.addCloud({container: model.group('bg')});
            }

            let mainBG = game.add.sprite(0, 0, 'fsBG', null, container);
            model.el('mainBG', mainBG);

            let logoZaglushka = game.add.sprite(0, game.height * 0.84, 'zaglushka', null, container);
            model.el('logoZaglushka', logoZaglushka);

        },

        addPole: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let pole = game.add.sprite(0, game.height * 0.84, 'pole', null, container);
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

        addCows: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            soundController.sound.playSound({sound: 'cows'});

            let cowContainer = game.add.group();
            container.add(cowContainer);

            let cow1 = game.add.sprite(-50, 10, 'cow1', null, cowContainer);
            let cow2 = game.add.sprite(-150, 15, 'cow3', null, cowContainer);
            let cow3 = game.add.sprite(-250, 20, 'cow3', null, cowContainer);
            let cow4 = game.add.sprite(-120, 10, 'cow1', null, cowContainer);
            let cow0 = game.add.sprite(-300, 20, 'cow2', null, cowContainer);

            let cowboy = game.add.sprite(0, 0, 'cowboy', null, container);
            let red_indian = game.add.sprite(0, 0, 'red_indian', null, container);

            let time = game.rnd.integerInRange(55, 70);
            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';

            cowContainer.x = (side === 'left') ? -cowContainer.width : game.width + cowContainer.width;
            cowContainer.y = game.rnd.integerInRange(720, 870);
            let delta = (side === 'left') ? game.width + cowContainer.width : -cowContainer.width;
            if (side === 'left') {
                cowContainer.width = -cowContainer.width;
            }

            cowboy.x = (side === 'left') ? -cowboy.width : game.width + cowboy.width;
            cowboy.y = cowContainer.y;
            if (side === 'left') {
                cowboy.width = -cowboy.width;
            }

            red_indian.x = (side === 'left') ? -red_indian.width - 300 : game.width + red_indian.width + 300;
            red_indian.y = cowContainer.y;
            if (side === 'left') {
                red_indian.width = -red_indian.width;
            }

            let animArr = [];
            let cow0Anim = cow0.animations.add('idle', Phaser.Animation.generateFrameNames('cow-2-walk2_', 0, 14, '.png', 1));
            let cow1Anim = cow1.animations.add('idle1', Phaser.Animation.generateFrameNames('cow-1-walk1_', 0, 14, '.png', 1));
            let cow2Anim = cow2.animations.add('idle2', Phaser.Animation.generateFrameNames('cow-3-walk3_', 0, 14, '.png', 1));
            let cow3Anim = cow3.animations.add('idle3', Phaser.Animation.generateFrameNames('cow-3-walk3_', 0, 14, '.png', 1));
            let cow4Anim = cow4.animations.add('idle4', Phaser.Animation.generateFrameNames('cow-1-walk1_', 0, 14, '.png', 1));
            let cowboyAnim = cowboy.animations.add('idle5', Phaser.Animation.generateFrameNames('cowboi-animation_', 0, 14, '.png', 1));
            let red_indianAnim = red_indian.animations.add('idle6', Phaser.Animation.generateFrameNames('indeets-walk_', 0, 14, '.png', 1));
            animArr.push(cow0Anim, cow1Anim, cow2Anim, cow3Anim, cow4Anim, cowboyAnim, red_indianAnim);
            animArr.forEach((anim) => {
                anim.play(12, true);
            });

            game.add.tween(cowContainer).to({x: delta}, time * 1000, 'Linear', true, 0);
            game.add.tween(cowboy).to({x: delta}, time * 1000, 'Linear', true, 3000);
            game.add.tween(red_indian).to({x: delta}, time * 1000, 'Linear', true, 6000)
                .onComplete.add(() => {
                    cowContainer.destroy();
                    cowboy.destroy();
                    red_indian.destroy();
                    soundController.sound.stopSound('cows');
                    game.time.events.add(3000, () => {
                        this.addCows({});
                    });
                }, this);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {

            let gameBGfs = game.add.sprite(0, 2, 'gameBGfs', null, container);
                gameBGfs.anchor.set(0.5);
                // gameBGfs.visible = false;
                model.el('gameBGfs', gameBGfs);

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
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 40, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2 - 8, config[model.res].win[i][0].y - gameMachine.height / 2 - 40, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                rightArr.push(lineNumber);
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

            let mask = game.add.graphics();
                mask.beginFill(0x000000);
                mask.drawRect(0, game.world.centerY + config[model.res].mainContainer.y, game.width, elSize.height * 3);
            mask.pivot.set(0, elSize.height * 1.5);

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
            container = model.group('panel')
        }) {

            let x, y, deltaX = 0, deltaY = 0;
            if (model.desktop) {
                x = 800;
                y = 100;
                deltaX = 80;
            } else {
                let fsMultiBG = game.add.sprite(1215, 360, 'bottleBG', null, container);
                    fsMultiBG.anchor.set(0.5);

                x = 1220;
                y = 190;
                deltaY = 165;
            }

            draw._drawFsMulti(x, y, deltaX, deltaY);
            draw._drawBottle(x, y, deltaX, deltaY);
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

        _drawBottle: function(x, y, deltaX, deltaY){
            let game = model.el('game');
            let container = model.group('panel');

            if (model.desktop) {
                let corrX = 20, corrY = 50;

                let bottleShadow4 = game.add.image(x + corrX, y + corrY, 'bottleShadow', null, container);
                    bottleShadow4.anchor.set(0.5);
                model.el('bottleShadow4', bottleShadow4);
                let bottleShadow6 = game.add.image(x + deltaX + corrX, y + deltaY + corrY, 'bottleShadow', null, container);
                    bottleShadow6.anchor.set(0.5);
                model.el('bottleShadow6', bottleShadow6);
                let bottleShadow8 = game.add.image(x + 2 * deltaX + corrX, y + 2 * deltaY + corrY, 'bottleShadow', null, container);
                    bottleShadow8.anchor.set(0.5);
                model.el('bottleShadow8', bottleShadow8);

                let brokenBottleShadow4 = game.add.image(x + corrX, y + corrY, 'brokenBottleShadow', null, container);
                    brokenBottleShadow4.anchor.set(0.5);
                    brokenBottleShadow4.visible = false;
                model.el('brokenBottleShadow4', brokenBottleShadow4);
                let brokenBottleShadow6 = game.add.image(x + deltaX + corrX, y + deltaY + corrY, 'brokenBottleShadow', null, container);
                    brokenBottleShadow6.anchor.set(0.5);
                    brokenBottleShadow6.visible = false;
                model.el('brokenBottleShadow6', brokenBottleShadow6);
                let brokenBottleShadow8 = game.add.image(x + 2 * deltaX + corrX, y + 2 * deltaY + corrY, 'brokenBottleShadow', null, container);
                    brokenBottleShadow8.anchor.set(0.5);
                    brokenBottleShadow8.visible = false;
                model.el('brokenBottleShadow8', brokenBottleShadow8);
            }

            let fsBottle4 = game.add.sprite(x, y, 'bottle', 'Bottlebang-Bang0.png', container);
                fsBottle4.anchor.set(0.5);
            model.el('fsBottle4', fsBottle4);
            let fsBottle6 = game.add.sprite(x + deltaX, y + deltaY, 'bottle', 'Bottlebang-Bang0.png', container);
                fsBottle6.anchor.set(0.5);
            model.el('fsBottle6', fsBottle6);
            let fsBottle8 = game.add.sprite(x + 2 * deltaX, y + 2 * deltaY, 'bottle', 'Bottlebang-Bang0.png', container);
                fsBottle8.anchor.set(0.5);
            model.el('fsBottle8', fsBottle8);

        },

        ShowMulti: function({
            game = model.el('game'),
            container = model.group('panel'),
            number = 4
        }) {
            let fsBottle = model.el(`fsBottle${number}`);
            let fsMulti = model.el(`fsMulti${number}`);
            let bottleShadow = model.el(`bottleShadow${number}`);
            let brokenBottleShadow = model.el(`brokenBottleShadow${number}`);

            let x = (model.desktop) ? model.group('panel').width / 2 : model.group('panel').width / 2 - 100;
            let y = (model.desktop) ? -400 : 300;

            let aim = game.add.sprite(x, y, 'aim', null, container);
                aim.anchor.set(0.5);
                aim.scale.set(0.1);
                model.el('aim', aim);

            game.add.tween(aim.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true)
            game.add.tween(aim).to({x: fsBottle.x, y: fsBottle.y}, 500, 'Linear', true, 1000)
            game.add.tween(aim.scale).to({x: 0.2, y: 0.2}, 500, 'Linear', true, 1000)
                .onComplete.add(() => {
                    aim.destroy();
                    soundController.sound.playSound({sound: 'bottleBangSound', duration: 1000});
                    soundController.sound.changeSoundVolume('bottleBangSound', 1000);
                    fsBottle.animations.add('bottleBang');
                    fsBottle.animations.play('bottleBang', 12, false);
                    fsMulti.visible = true;
                    if (model.desktop) {
                        bottleShadow.visible = false;
                        brokenBottleShadow.visible = true;
                    }
                });
        },

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
                x = 648;
                y = 85;
                countX = 17;
                countY = 17;
                font = fontDesktop;
            }

            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', 'fsTotalTable-Bang0.png', container);
                fsCountBG.anchor.set(0.5);
                if (model.desktop) {fsCountBG.scale.set(1.3)};
                model.el('fsCountBG', fsCountBG);

            let fsCount = game.add.text(x + countX, y + countY, start, {font: font, fill: '#e8b075', align: 'center'}, container);
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

            console.log('Plus 3: ', plus3Group, container);

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

        _showBang: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let fsCountBG = model.el('fsCountBG');
            fsCountBG.animations.add('bang', [0, 1, 2, 3, 4, 0]);
            fsCountBG.animations.play('bang', 12, false);

        },

        drum: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x, y, deltaX, deltaY, scaleDrum, scaleBullet;
            if (model.mobile) {
                x = 72;
                y = 335;
                deltaX = -2;
                deltaY = -130;
                let drumBG = game.add.sprite(72, 280, 'drumBG', null, container);
                    drumBG.anchor.set(0.5);
                    drumBG.scale.set(0.95);
                scaleDrum = 0.5;
                scaleBullet = 0.6;
            } else {
                x = 495;
                y = 100;
                deltaX = 135;
                deltaY = 15;
                scaleDrum = 0.35;
                scaleBullet = 0.45;
            }
            let drum = game.add.sprite(x, y, 'baraban', 'B-0.png', container);
                drum.anchor.set(0.5);
                drum.scale.set(scaleDrum);
            model.el('drum', drum);

            let bullet = game.add.sprite(x - deltaX, y + deltaY, '11', '11-n.png', container);
                bullet.anchor.set(0.5);
                bullet.scale.set(scaleBullet);
            model.el('bullet', bullet);
        },

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
                bulletAnim.onComplete.removeAll();
                bulletAnim.play(12, true);
                model.state('maxFsMultiplier', true)
            } else {
                bulletAnim.onComplete.add(() => {bullet.frameName = '11-n.png'}, this);
                game.add.tween(model.el('drum')).to({rotation: 2 * Math.PI * 4}, 500, Phaser.Easing.Exponential.Out, true, 0, 0)
                .onComplete.add(()=> {
                    drum.frameName = `B-${number}.png`;
                    drum.rotation = 0;
                    bulletAnim.play(12);
                });
            }

        }

    };

    return {
        create,
        draw
    };
})();
