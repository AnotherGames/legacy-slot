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
        // this.mainContainer.add(this.panelContainer);
        this.balanceContainer = this.add.group();
        this.menuContainer = this.add.group();
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.el('menuContainer', this.menuContainer);
        model.el('panelContainer', this.panelContainer);
        model.state('side', 'left');
        model.state('sound', true);
        model.state('autoPanel', false);
        model.state('fastRoll', false);
    }

    preload() {

    }

    create() {
        this.drawMainBG();
        this.initMainContainer();
        if (model.flag('mobile')) {
            buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
            model.data('mainXLeft', 2 * model.data('buttonsDelta'));
            model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        }
        balance.drawBalanceContainer(this.balanceContainer, this);
        this.drawMainContainer();

        events.trigger('roll:initWheels');

        if (model.flag('mobile')) {
            this.mainContainer.x = model.data('mainXLeft');
        } else {
            this.mainContainer.x = (this.game.width - this.mainContainer.width) / 2;
            buttons.drawDesktopPanel(this.panelContainer, this, this.mainContainer);
        }

        // Draw glisty
        let glistParam = {
            game: this.game,
            parent: this.machineContainer,
            elSize: config[model.state('res')].elements
        };

        let glista1 = new Glista(glistParam);
        (function glistaStart() {
            glista1.start([2, null, 0, null, 2], 2000, glistaStart);
        })();

        let glista2 = new Glista(glistParam);
        (function glistaStart() {
            glista2.start([0, null, 2, null, 0], -2000, glistaStart);
        })();
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
        let mainBG = this.add.sprite(0, 0, 'mainBG', null, this.bgContainer);
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
    }
}
