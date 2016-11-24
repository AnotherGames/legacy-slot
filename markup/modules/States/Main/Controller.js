import { events } from 'modules/Util/Events';
import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as mainView } from 'modules/States/Main/View';
import { settings } from 'modules/Menu/Settings';
import { sound } from 'modules/Sound/Sound';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as footerController } from 'modules/Footer/FooterController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as mobileSettingsController } from 'modules/MobileSettings/Controller';
import { controller as mobileAutoplayController } from 'modules/MobileAutoplay/Controller';
import { controller as mobileSetBetController } from 'modules/MobileSetBet/Controller';
import { keyboard } from 'modules/Keyboard/Keyboard';

export class Main {
    constructor(game) {

    }

    init() {
        console.info('Main State!');
        const game = model.el('game');

        sound.init({sound: model.state('sound'), volume: model.state('volume'), music: model.state('music')});
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
        sound.music.fon.play();

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

            settings.initDesktopSettings(game);
            panelController.init();
            balanceController.initDesktop();
        }

        mainView.draw.machineMask({});

        keyboard.initDefaultKey();

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
            events.trigger('autoplay:init', model.data('remainAutoCount'));
            model.data('remainAutoCount', null);
        }
    }

    update() {
        footerController.updateTime({});
        const game = model.el('game');
        game.frameAnims.forEach((anim) => {
            anim();
        });
    }

}
