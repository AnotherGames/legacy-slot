import { buttons } from 'modules/Buttons/Buttons';
import { menu } from 'modules/Menu/Menu';
import { win } from 'modules/Win/Win';
import { model } from 'modules/Model/Model';
import { roll } from 'modules/Roll/Roll';
import { config } from 'modules/Util/Config';
import { Wheel } from 'modules/Wheel/Wheel';
import { Glista } from 'modules/Glista/Glista';
import { Element } from 'modules/Element/Element';
import { balance } from 'modules/Balance/Balance';
import { events } from 'modules/Events/Events';

export class Main {
    constructor(game) {

    }
    init() {
        console.info('Main State!');
        let game = model.el('game');
        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];

        this.game.stage.disableVisibilityChange = true;
        this.bgContainer = this.add.group();
        this.mainContainer = this.add.group();
        this.buttonsContainer = this.add.group();
        this.panelContainer = this.add.group();
        this.balanceContainer = this.add.group();
        this.menuContainer = this.add.group();
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.el('panelContainer', this.panelContainer);
        model.el('menuContainer', this.menuContainer);
        model.state('side', 'left');
        model.state('sound', true);
        model.state('music', true);
        model.state('autoPanel', false);
        model.state('fastRoll', false);
    }

    preload() {

    }

    create() {
        let fonSound = this.add.audio('fon', 1, true);
        model.el('fonSound', fonSound);
        fonSound.play();

        let buttonSound = this.game.add.audio('buttonClick');
        model.el('buttonSound', buttonSound);

        this.drawMainBG();
        this.initMainContainer();
        if (model.flag('mobile')) {
            buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
            model.data('mainXLeft', 2 * model.data('buttonsDelta'));
            model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        }
        balance.drawBalanceContainer(this.balanceContainer, this);
        this.drawHomeButton(this.balanceContainer);
        this.drawMainContainer();

        events.trigger('roll:initWheels');

        if (model.flag('mobile')) {
            this.mainContainer.x = model.data('mainXLeft');
        } else {
            this.mainContainer.x = (this.game.width - this.mainContainer.width) / 2;
            buttons.drawDesktopPanel(this.panelContainer, this, this.mainContainer);
        }

        // PreAnimation
        let darkness = this.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, this.game.width, this.game.height);
        this.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);
        model.el('darkness', darkness);
    }

    drawHomeButton(container) {
        let x = 25;
        let y = (model.flag('mobile')) ? this.game.world.height - 50 : this.game.world.height - 15;

        function homeOnClick() {
            buttonSound.play(); // TODO: вынести в controller.sound
            util.request('_Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
            window.history.back();
        }

        const homeButton = this.game.add.button(x, y, 'footerButtons', homeOnClick, this, 'homeOn.png', 'home.png', 'homeOn.png', null, container);
        homeButton.anchor.set(0.5);
        homeButton.inputEnabled = true;
        homeButton.input.priorityID = 1;
    }

    update() {
        events.trigger('updateTime');
        let game = model.el('game');

        // если есть анимации то мы их запускаем
        game.frameAnims.forEach((anim) => {
            anim();
        });
        events.trigger('updateTime');
    }

    drawMainBG() {
        let animBG = this.game.add.spine(
            this.game.world.centerX,        // X positon
            this.game.world.centerY,        // Y position
            'animBG'     // the key of the object in cache
        );
        animBG.scale.set(1);
        animBG.setAnimationByName(
            0,          // Track index
            'animation',     // Animation's name
            true        // If the animation should loop or not
        );
        this.bgContainer.add(animBG);
        model.el('animMainBG', animBG);
        let mainBG = this.add.sprite(0, 0, 'mainBG', null, this.bgContainer);
        model.el('mainBG', mainBG);
    }

    initMainContainer() {
        let gameBG = this.add.sprite(config[model.state('res')].machine.x, config[model.state('res')].machine.y, 'gameBG', null, this.mainContainer);
        let gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);
        model.el('gameMachine', gameMachine);
    }

    drawMainContainer() {
        this.machineContainer = this.add.group();
        model.el('machineContainer', this.machineContainer);
        this.mainContainer.addAt(this.machineContainer, 1);
        this.machineContainer.position.set(this.mainContainer.width / 2 + config[model.state('res')].machine.x, this.mainContainer.height / 2);

        let maskMarginX = config[model.state('res')].machine.x;
        if (model.flag('mobile')) {
            maskMarginX += model.data('mainXLeft');
        } else {
            maskMarginX += (this.game.width - this.mainContainer.width) / 2;
        }

        const elSize = config[model.state('res')].elements;
        let mask = this.add.graphics();
        mask.beginFill(0x000000);
        mask.drawRect(maskMarginX, config[model.state('res')].machine.y, elSize.width * 5, elSize.height * 3);
        this.machineContainer.mask = mask;

        let glistaLightContainer = this.game.add.group();
        model.el('glistaLightContainer', glistaLightContainer);
        this.machineContainer.add(glistaLightContainer);

        let elementsContainer = this.game.add.group();
        model.el('elementsContainer', elementsContainer);
        this.machineContainer.add(elementsContainer);

        let glistaContainer = this.game.add.group();
        model.el('glistaContainer', glistaContainer);
        this.machineContainer.add(glistaContainer);
        model.el('mask', mask);
    }
}
