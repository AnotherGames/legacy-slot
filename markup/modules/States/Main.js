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
import { autoplay } from 'modules/Autoplay/Autoplay';
import { events } from 'modules/Events/Events';
import { settings } from '../../modules/Menu/Settings';
import { sound } from '../../modules/Sound/Sound';
import { mobileSettings } from '../../modules/Menu/MobileSettings';
import { FSCharapter } from '../../modules/FSCharapter/FSCharapter';

export class Main {
    constructor(game) {

    }
    init() {
        console.info('Main State!');
        let game = model.el('game');
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
        this.transitionContainer = this.add.group();
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.el('panelContainer', this.panelContainer);
        model.el('menuContainer', this.menuContainer);
        model.el('transitionContainer', this.transitionContainer);
        model.state('side', 'left');
        model.state('autoPanel', false);
        model.state('fastRoll', false);
        model.state('isAnimations', true);
        model.state('autoEnd', true);
        model.state('FSMode', false);
        events.on('main:drawTransitionScreen', this.drawTransitionScreen);
        // events.on('main:drawWinScreen', this.drawWinScreen);
    }

    preload() {

    }

    create() {
        sound.init(this.game);
        sound.music.fon.play();

        $('.history__button').click((event) => {
            $('.history').addClass('closed');
        });

        this.drawMainBG();
        this.initMainContainer();
        if (model.flag('mobile')) {
            buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
            mobileSettings.draw(this.game);
            model.data('mainXLeft', 2 * model.data('buttonsDelta'));
            model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        }
        balance.drawBalanceContainer(this.balanceContainer, this);
        buttons.drawHomeButton(this.balanceContainer, this);
        this.drawMainContainer();

        events.trigger('roll:initWheels');

        if (model.flag('mobile')) {
            this.mainContainer.x = model.data('mainXLeft');
        } else {    // Desktop
            this.mainContainer.x = (this.game.width - this.mainContainer.width) / 2;
            buttons.drawDesktopPanel(this.panelContainer, this, this.mainContainer);
            buttons.drawDesktopBottomButtons(this.balanceContainer, this);
            settings.initDesktopSettings(this.game);
        }

        // PreAnimation
        let darkness = this.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, this.game.width, this.game.height);
        this.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);

    }

    update() {
        events.trigger('updateTime');
        let game = model.el('game');

        // если есть анимации то мы их запускаем
        game.frameAnims.forEach((anim) => {
            anim();
        });

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

    drawTransitionScreen() {
        let game = model.el('game');
        let transitionContainer = model.el('transitionContainer');

        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        const freeSpinsText = game.add.sprite(game.world.width / 2,
            -400,
            'text',
            'freeSpins.png',
            transitionContainer);
        freeSpinsText.anchor.set(0.5);

        const freeSpinsLevel = game.add.text(game.world.width / 2,
            -200,
            '15',
            {font: 'bold 140px Helvetica, Arial', fill: '#fff', align: 'center'},
            transitionContainer);
        freeSpinsLevel.anchor.set(0.5);

        const axeBig = game.add.sprite(game.world.width / 2 + 250,
            game.world.height / 2,
            'axe',
            null,
            transitionContainer);
        axeBig.anchor.set(0.5);
        axeBig.scale.setTo(0.1, 0.1);

        const axeSmall = game.add.sprite(game.world.width / 2 - 250,
            game.world.height / 2 + 50,
            'axeSmall',
            null,
            transitionContainer);
        axeSmall.anchor.set(0.5);
        axeSmall.scale.setTo(0.1, 0.1);

        const continueText = game.add.sprite(game.world.width / 2,
            game.world.height * 0.8,
            'text',
            'continue.png',
            transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.setTo(0.1, 0.1);

        continueText.inputEnabled = true;
        continueText.input.priorityID = 2;
        continueText.events.onInputDown.add(function () {
            sound.sounds.button.play();
            game.state.start('FS');
        });

        game.add.tween(freeSpinsText).to({y: game.world.height * 0.2}, 1000, Phaser.Easing.Bounce.Out, true);
        game.add.tween(freeSpinsLevel).to({y: game.world.height / 2}, 1000, Phaser.Easing.Bounce.Out, true);
        game.add.tween(axeBig.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true, 300);
        game.add.tween(axeSmall.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true, 300);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true)
            .onComplete.add(() => {
                continueText.rotation = 0.1;
                game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        continueText.rotation = 0;
                    }, this);
            }, this);
    }



}
