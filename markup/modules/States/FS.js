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
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.el('panelContainer', this.panelContainer);
        model.el('menuContainer', this.menuContainer);
        model.state('FSMode', true);
    }
    preload() {

    }
    create() {
        let fonFSSound = this.add.audio('fsFon', 1, true);
        model.el('fonFSSound', fonFSSound);
        fonFSSound.play();
        this.drawMainBG();
        this.drawFSElements();
        this.initMainContainer();
        if (model.flag('mobile')) {
            // buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
            model.data('mainXLeft', 2 * model.data('buttonsDelta'));
            model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        }
        balance.drawBalanceContainer(this.balanceContainer, this);
        this.drawMainContainer();

        events.trigger('roll:initWheels');

        if (model.flag('mobile')) {
            this.mainContainer.x = model.data('mainXRight');
        } else {
            this.mainContainer.x = this.game.width - this.mainContainer.width;
            buttons.drawDesktopFSPanel(this.panelContainer, this, this.mainContainer);
        }

        // PreAnimation
        let darkness = model.el('darkness');
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
        this.machineContainer.add(glistaLightContainer);

        let elementsContainer = this.game.add.group();
        this.machineContainer.add(elementsContainer);
        model.el('elementsContainer', elementsContainer);


        let glistaContainer = this.game.add.group();
        this.machineContainer.add(glistaContainer);

    }

    drawFSElements() {
        if (model.flag('mobile')) {
            let FSLevel = this.add.sprite(0, 0, 'fsTotalTable', null, this.mainContainer);
            FSLevel.anchor.set(0.5);
        }
    }
}
