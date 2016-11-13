import { events } from 'modules/Util/Events';
import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';


// import { buttons } from 'modules/Buttons/Buttons';
// import { roll } from 'modules/Roll/Roll';
// import { Wheel } from 'modules/Class/Wheel';
// import { Glista } from 'modules/Class/Glista';
// import { Element } from 'modules/Class/Element';
// import { balance } from 'modules/Balance/Balance';
// import { mobileSettings } from 'modules/Menu/MobileSettings';
// import { autoplay } from 'modules/Autoplay/Autoplay';
// import { menu } from 'modules/Menu/Menu';
import { settings } from 'modules/Menu/Settings';
import { win } from 'modules/Win/Win';

import { sound } from 'modules/Sound/Sound';
import { view as transitionView } from 'modules/Transition/transitionView';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as footerController } from 'modules/Footer/FooterController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
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
        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        this.game.stage.disableVisibilityChange = true;
        this.bgContainer = this.add.group();
        this.mainContainer = this.add.group();
        this.buttonsContainer = this.add.group();
        this.panelContainer = this.add.group();
        this.balanceContainer = this.add.group();
        this.menuContainer = this.add.group();
        this.footerContainer = this.add.group();
        this.balanceCashContainer = this.add.group();
        this.transitionContainer = this.add.group();
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.group('main', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.group('buttons', this.buttonsContainer);
        model.el('panelContainer', this.panelContainer);
        model.group('panel', this.panelContainer);
        model.group('footer', this.footerContainer);
        model.group('balanceCash', this.balanceCashContainer);
        model.el('menuContainer', this.menuContainer);
        model.el('transitionContainer', this.transitionContainer);
        model.group('transition', this.transitionContainer);
        model.state('side', 'left');
        model.state('autoPanel', false);
        model.state('fastRoll', false);
        model.state('isAnimations', true);
        model.state('autoEnd', true);
        model.state('FSMode', false);
        events.on('main:drawTransitionScreen', transitionView.fsStart);
        // events.on('main:drawWinScreen', this.drawWinScreen);
    }

    preload() {

    }

    create() {
        this.drawMainBG();
        this.initMainContainer();
        this.drawMainContainer();
        if (model.state('mobile')) {
            footerController.initMobile();
        } else {
            footerController.initDesktop();
        }

        sound.init(this.game);
        sound.music.fon.play();

        $('.history__button').click((event) => {
            $('.history').addClass('closed');
        });

        if (model.state('mobile')) {
            buttonsController.init();


            model.data('mainXLeft', 2 * model.el('buttonsDelta'));
            model.data('mainXRight', this.game.width - this.mainContainer.width - model.el('buttonsDelta') * 2);


            // buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
            // mobileSettings.draw(this.game);
        }
        this.drawMachineMask();
        // balance.drawBalanceContainer(this.balanceContainer, this);
        // buttons.drawHomeButton(this.balanceContainer, this);

        rollController.init();

        if (model.state('mobile')) {
            this.mainContainer.x = model.data('mainXLeft');
            balanceController.initMobile();
            mobileSettingsController.init({});
            mobileAutoplayController.init({});
            mobileSetBetController.init({});
        } else {    // Desktop
            this.mainContainer.x = (this.game.width - this.mainContainer.width) / 2;
            // buttons.drawDesktopPanel(this.panelContainer, this, this.mainContainer);
            // buttons.drawDesktopBottomButtons(this.balanceContainer, this);
            settings.initDesktopSettings(this.game);
            panelController.init();
            balanceController.initDesktop();
        }

        // Space
        keyboard.Add({
            key: 32,
            down: function () {
                events.trigger('roll:request');
                return true;
            }
        });

        // PreAnimation
        let darkness = this.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, this.game.width, this.game.height);
        this.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);
    }

    update() {
        const game = model.el('game');
        game.frameAnims.forEach((anim) => {
            anim();
        });

        footerController.updateTime();
    }

    drawMainBG() {
        let animBG = this.game.add.spine(
            this.game.world.centerX,        // X positon
            this.game.world.centerY,        // Y position
            'animBG'     // the key of the object in cache
        );
        animBG.setAnimationByName(
            0,          // Track index
            '1',     // Animation's name
            true        // If the animation should loop or not
        );
        this.bgContainer.add(animBG);
        model.el('animMainBG', animBG);
        let mainBG = this.add.sprite(0, 0, 'mainBG', null, this.bgContainer);
        model.el('mainBG', mainBG);

        if (model.state('isAnimations')) {
            mainBG.visible = false;
        } else {
            animBG.visible = false;
        }
    }

    initMainContainer() {
        let gameBG = this.add.sprite(config[model.state('res')].machine.x, config[model.state('res')].machine.y, 'gameBG', null, this.mainContainer);
        let gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);
        model.el('gameMachine', gameMachine);
    }

    drawMachineMask() {
        let maskMarginX = config[model.state('res')].machine.x;
        if (model.state('mobile')) {
            maskMarginX += model.data('mainXLeft');
        } else {
            maskMarginX += (this.game.width - this.mainContainer.width) / 2;
        }

        const elSize = config[model.state('res')].elements;
        let mask = this.add.graphics();
        mask.beginFill(0x000000);
        mask.drawRect(maskMarginX, config[model.state('res')].machine.y, elSize.width * 5, elSize.height * 3);
        this.machineContainer.mask = mask;
        model.el('mask', mask);
    }

    drawMainContainer() {
        this.machineContainer = this.add.group();
        model.el('machineContainer', this.machineContainer);
        this.mainContainer.addAt(this.machineContainer, 1);
        this.machineContainer.position.set(this.mainContainer.width / 2 + config[model.state('res')].machine.x, this.mainContainer.height / 2);

        let glistaLightContainer = this.game.add.group();
        model.el('glistaLightContainer', glistaLightContainer);
        this.machineContainer.add(glistaLightContainer);

        let elementsContainer = this.game.add.group();
        model.el('elementsContainer', elementsContainer);
        this.machineContainer.add(elementsContainer);

        let glistaContainer = this.game.add.group();
        model.el('glistaContainer', glistaContainer);
        this.machineContainer.add(glistaContainer);
    }

}
