import { buttons } from 'modules/Buttons/Buttons';
// import { menu } from 'modules/Menu/Menu';
import { model } from 'modules/Model/Model';
import { roll } from 'modules/Roll/Roll';
import { config } from 'modules/Util/Config';
import { Wheel } from 'modules/Wheel/Wheel';
import { balance } from 'modules/Balance/Balance';
import { events } from 'modules/Events/Events';
import { Element } from '../../modules/Element/Element';

export class Main {
    constructor(game) {

    }
    init() {
        this.game.stage.disableVisibilityChange = true;
        console.info('Main State!');
        this.bgContainer = this.add.group();
        this.mainContainer = this.add.group();
        this.balanceContainer = this.add.group();
        this.buttonsContainer = this.add.group();
        this.menuContainer = this.add.group();
        model.el('bgContainer', this.bgContainer);
        model.el('mainContainer', this.mainContainer);
        model.el('balanceContainer', this.balanceContainer);
        model.el('buttonsContainer', this.buttonsContainer);
        model.el('menuContainer', this.menuContainer);
        model.state('side', 'left');
        // массив в который записываются анимации для проигрывания
        let game = model.el('game');
        game.frameAnims = [];
    }
    update() {
        events.trigger('updateTime');
        let game = model.el('game');

        // если есть анимации то мы их запускаем
        game.frameAnims.forEach((anim) => {
            anim();
        });
    }
    preload() {
        this.loadElementsAtlas();
    }
    create() {
        this.drawMainBG();
        this.initMainContainer();
        // if (model.flag('mobile')) {
        buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);
        // }
        balance.drawBalanceContainer(this.balanceContainer, this);
        model.data('mainXLeft', 2 * model.data('buttonsDelta'));
        model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        this.mainContainer.x = model.data('mainXLeft');
        this.drawMainContainer();

        events.trigger('roll:initWheels');

        model.el('game').time.events.add(3000, () => {
            events.trigger('roll:requestRoll', {
                time: 6000,
                length: 30,
                ease: 1.2
            });
        })
    }

    drawMainBG() {
        let mainBG = this.add.sprite(0, 0, 'mainBG', null, this.bgContainer);
    }

    initMainContainer() {
        let gameBG = this.add.sprite(config[model.state('res')].machine.x, config[model.state('res')].machine.y, 'gameBG', null, this.mainContainer);
        let gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);
    }

    loadElementsAtlas() {
        let game = model.el('game');
        let container = this.add.group();
        // елемент не отображатся на экране
        container.x = -window.innerWidth;
        const elem = new Element({
            game,
            parent: container,
            el: 1,
            animation: 'n',
            x: 0,
            y: 0
        });
        let elemMode = ['n','w','b'];
        let i = 1;
        // прогоняем все анимации
        game.frameAnims.push(function preloadElems() {
            elem.play(i + '-' + 'b');
            i++;
            if (i >= 12) {
                game.frameAnims.splice(game.frameAnims.indexOf(preloadElems), 1);
                container.destroy();
            }
        });
    }

    drawMainContainer() {
        this.machineContainer = this.add.group();
        model.el('machineContainer', this.machineContainer);
        this.mainContainer.addAt(this.machineContainer, 1);
        this.machineContainer.position.set(this.mainContainer.width / 2 + config[model.state('res')].machine.x, this.mainContainer.height / 2);

        const elSize = config[model.state('res')].elements;
        let mask = this.add.graphics();
        mask.beginFill(0x000000);
        mask.drawRect(model.data('mainXLeft') + config[model.state('res')].machine.x, this.mainContainer.y + config[model.state('res')].machine.y, elSize.width * 5, elSize.height * 3);
        this.machineContainer.mask = mask;
    }
}
