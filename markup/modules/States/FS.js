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
import { fs } from '../../modules/FS/FS';


export class FS {
    constructor(game) {

    }
    init() {
        console.info('FS State!');
        this.frameAnims = [];

        this.game.stage.disableVisibilityChange = true;
        this.bgContainer = this.add.group();
        this.mainContainer = this.add.group();
        this.buttonsContainer = this.add.group();
        this.panelContainer = this.add.group();
        this.balanceContainer = this.add.group();
        this.menuContainer = this.add.group();
        this.fsContainer = this.add.group();
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.el('panelContainer', this.panelContainer);
        model.el('menuContainer', this.menuContainer);
        model.el('fsContainer', this.fsContainer);
        model.state('FSMode', true);
        model.state('fastRoll', false);
        model.state('isAnimations', true);
    }
    preload() {

    }
    create() {
        let fonFSSound = this.add.audio('fsFon', 1, true);
        model.el('fonFSSound', fonFSSound);
        fonFSSound.play();

        let buttonSound = this.game.add.audio('buttonClick');
        model.el('buttonSound', buttonSound);

        $('.history__button').click((event) => {
            $('.history').addClass('closed');
        });

        this.drawMainBG();
        this.initMainContainer();
        if (model.flag('mobile')) {
            // buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
            model.data('mainXLeft', 2 * model.data('buttonsDelta'));
            model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        }
        balance.drawBalanceContainer(this.balanceContainer, this);
        buttons.drawHomeButton(this.balanceContainer, this);
        this.drawMainContainer();
        this.drawFSElements();

        events.trigger('roll:initWheels');

        if (model.flag('mobile')) {
            this.mainContainer.x = model.data('mainXRight');
        } else {    // Desktop
            this.mainContainer.x = this.game.width - this.mainContainer.width;
            buttons.drawDesktopFSPanel(this.panelContainer, this, this.mainContainer);
            buttons.drawDesktopBottomButtons(this.balanceContainer, this);
            settings.initDesktopSettings(this.game);
        }

        // PreAnimation
        let darkness = model.el('darkness');
        this.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);

        events.trigger('fs:init', 15);
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
        animBG.scale.set(1);
        animBG.setAnimationByName(
            0,          // Track index
            '2',     // Animation's name
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
        const gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);
        model.el('gameMachine', gameMachine);
    }

    drawMainContainer() {
        this.machineContainer = this.add.group();
        model.el('machineContainer', this.machineContainer);
        this.mainContainer.addAt(this.machineContainer, 1);
        this.machineContainer.position.set(this.mainContainer.width / 2 + config[model.state('res')].machine.x, this.mainContainer.height / 2);

        let maskMarginX = config[model.state('res')].machine.x;
        if (model.flag('mobile')) {
            maskMarginX += model.data('mainXRight');
        } else {
            maskMarginX += this.game.width - this.mainContainer.width;
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

    drawFSElements() {
        if (model.flag('mobile')) {
            const mozgCountBG = this.add.sprite(385, 30, 'multiTable', null, this.fsContainer);
            mozgCountBG.anchor.set(0.5);
            const fsLevelBG = this.add.sprite(240, 55, 'fsTotalTable', null, this.fsContainer);
            fsLevelBG.anchor.set(0.5);
            const multiBG = this.add.sprite(120, 600, 'multiRip', null, this.fsContainer);
            multiBG.anchor.set(0.5);
        }
        let multiX;
        let multiY;
        if (model.flag('mobile')) {
            multiX = 120;
            multiY = 600;
        } else {
            multiX = 1400;
            multiY = 970;
        }
        const fsMulti = this.add.sprite(multiX,
            multiY, 'numbers',
            'multi' + '1' + '.png',
            this.fsContainer);
        fsMulti.anchor.set(0.5);
        let levelX;
        let levelY;
        let levelFont;
        if (model.flag('mobile')) {
            levelX = 240;
            levelY = 55;
            levelFont = 'bold 40px Helvetica, Arial';
        } else {
            levelX = 1197;
            levelY = 947;
            levelFont = 'bold 80px Helvetica, Arial';
        }
        const fsLevel = this.add.text(levelX,
            levelY,
            '15',
            {font: levelFont, fill: '#fff', align: 'center'},
            this.fsContainer);
        model.el('fsLevel', fsLevel);
        fsLevel.anchor.set(0.5)
        fsLevel.alpha = 0;

    }

}
