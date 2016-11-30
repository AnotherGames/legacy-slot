import { model } from 'modules/Model/Model';

import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { keyboard } from 'modules/Util/Keyboard';

import { view as mainView } from 'modules/States/Main/View';

import { controller as soundController } from 'modules/Sound/Controller';
import { controller as settingsController } from 'modules/Settings/Controller';
import { controller as balanceController } from 'modules/Balance/Controller';
import { controller as footerController } from 'modules/Footer/Controller';
import { controller as panelController } from 'modules/Panel/Controller';
import { controller as buttonsController } from 'modules/Buttons/Controller';
import { controller as rollController } from 'modules/Roll/Controller';
import { controller as winController } from 'modules/Win/Controller';
import { controller as autoplayController } from 'modules/Autoplay/Controller';
import { controller as mobileSettingsController } from 'modules/Menu/Settings/Controller';
import { controller as mobileAutoplayController } from 'modules/Menu/Autoplay/Controller';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/Controller';

export class Main {
    constructor(game) {

    }

    init() {
        console.info('Main State!');
        const game = model.el('game');

        soundController.init({sound: model.state('sound'), volume: model.state('volume'), music: model.state('music')});
        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        game.stage.disableVisibilityChange = false;

        mainView.create.groups({});
    }

    preload() {

    }

    create() {
        const game = model.el('game');
        soundController.music.fon.play();

        mainView.draw.mainBG({});
        mainView.draw.mainContainer({});
        mainView.draw.machineContainer({});

        rollController.init();

        if (model.state('mobile')) {
            footerController.initMobile();
            buttonsController.init();

            let mainXLeft = model.el('buttonsDelta') * 2 + game.mainContainer.width / 2;
            let mainXRight = game.width - game.mainContainer.width - model.el('buttonsDelta') * 2 + game.mainContainer.width / 2;
            model.data('mainXLeft', mainXLeft);
            model.data('mainXRight', mainXRight);

            if (model.state('side') === 'left') {
                game.mainContainer.x = mainXLeft;
            } else {
                game.mainContainer.x = mainXRight;
            }

            game.mainContainer.y = game.world.centerY + config[model.state('res')].mainContainer.y;

            balanceController.initMobile();
            mobileSettingsController.init({});
            mobileAutoplayController.init({});
            mobileSetBetController.init({});
        } else {    // Desktop
            footerController.initDesktop();

            game.mainContainer.x = game.world.centerX;
            game.mainContainer.y = game.world.centerY + config[model.state('res')].mainContainer.y;

            settingsController.initDesktopSettings(game);
            panelController.init();
            balanceController.initDesktop();
        }

        mainView.draw.machineMask({});

        this.initKeys();

        // PreAnimation
        let darkness = mainView.draw.darkness({});
        this.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true);

        setInterval(() => {
            footerController.updateTime();
        }, 10000);

        if (model.data('savedFS')) {
            game.state.start('FS');
        }
        if (model.data('remainAutoCount') && !model.state('autoStopWhenFS')) {
            autoplayController.init(model.data('remainAutoCount'));
            model.data('remainAutoCount', null);
        }

        let lastTime = new Date().getTime();
        let fps = 1;
        let lowCount = 0;

        let checkFPS = function () {
            if ( !model.state('isFirstAutoChangeAnimBG') ) return;
            if ( !model.state('isAnimBG') ) return;
            if (lastTime + 1000 > new Date().getTime() ) {
                fps++;
            } else {
                if (fps < 30) {
                    console.log('FPS:', fps);
                    lowCount++;
                    if (lowCount > 3) {
                        model.state('isAnimBG', false);
                        let animMainBG = model.el('animMainBG');
                        let mainBG = model.el('mainBG');

                        mainBG.visible = true;
                        animMainBG.visible = false;

                        model.state('isFirstAutoChangeAnimBG', false);
                        console.log('Auto Change AnimBG.');
                    }
                } else {
                    if (lowCount > 0) {
                        lowCount--;
                    }
                }
                lastTime = new Date().getTime();
                fps = 1;
            }
        };
        game.frameAnims.push(checkFPS);
    }

    update() {
        footerController.updateTime({});
        const game = model.el('game');
        game.frameAnims.forEach((anim) => {
            anim();
        });
    }

    initKeys() {
        let game = model.el('game');

        let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(() => {
            panelController.handle.spin();
        });

        let up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(() => {
            model.changeCoin({up: true});
        });

        let down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(() => {
            model.changeCoin({down: true});
        });

        let right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(() => {
            model.changeBet({up: true});
        });

        let left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(() => {
            model.changeBet({down: true});
        });

    }

}
