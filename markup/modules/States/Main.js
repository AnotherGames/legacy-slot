import { buttons } from 'modules/Buttons/Buttons';
// import { menu } from 'modules/Menu/Menu';
import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Wheel } from 'modules/Wheel/Wheel';
import { balance } from 'modules/Balance/Balance';
import { events } from 'modules/Events/Events';

export class Main {
    constructor(game) {

    }
    init() {
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
        this.frameAnims = [];
    }
    update() {
        this.frameAnims.forEach((anim) => {
            anim();
        });
    }
    preload() {

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
        this.initWheels();

        this.startRoll();
    }

    update() {
        events.trigger('updateTime');
    }

    drawMainBG() {
        let mainBG = this.add.sprite(0, 0, 'mainBG', null, this.bgContainer);
    }

    initMainContainer() {
        let gameBG = this.add.sprite(config[model.state('res')].machine.x, config[model.state('res')].machine.y, 'gameBG', null, this.mainContainer);
        let gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);
    }

    drawMainContainer() {
        this.machineContainer = this.add.group();
        this.mainContainer.addAt(this.machineContainer, 1);
        this.machineContainer.position.set(this.mainContainer.width / 2 + config[model.state('res')].machine.x, this.mainContainer.height / 2);

        const elSize = config[model.state('res')].elements;
        let mask = this.add.graphics();
        mask.beginFill(0x000000);
        mask.drawRect(model.data('mainXLeft') + config[model.state('res')].machine.x, this.mainContainer.y + config[model.state('res')].machine.y, elSize.width * 5, elSize.height * 3);
        this.machineContainer.mask = mask;
    }
    /**
     * [Создание колес с отображением текущего экрана]
     * @param {Array} currentScreen
     * @param {Object} options.container
     * @param {Object} options.state
     */
    initWheels(currentScreen, options) {
        let wheels = [];
        let elSize = config[model.state('res')].elements;
        for (let i = -2; i < 3; i++) {
            wheels.push(new Wheel({
                state: this,
                parent: this.machineContainer,
                position: {
                    x: i * elSize.width - config[model.state('res')].machine.x,
                    y: 0 - config[model.state('res')].machine.y * 2
                },
                elSize,
                currentScreen: [2, 5, 7, 1, 4]
            }));
        }
        model.el('wheels', wheels);
    }
    /**
     * [Запуск крутки с необходимыми параметрами]
     * @param {Array} finishScreen
     * @param {Boolean} options.fastRoll
     * @param {Array} options.rollTimeArray
     * @param {Array} options.currentScreen
     * @param {Function} callback
     */
    startRoll(finishScreen, options, callback) {
        let wheels = model.el('wheels');
        // Roll
        wheels.forEach((wheel, columnIndex) => {
            // start roll
            // if (column   Index > 0) return;
            this.time.events.add(Phaser.Timer.SECOND + columnIndex * 100, function () {
                wheel.play();
            }, wheel);

            // end roll
            // let callback = function () {
            //     console.log('Finish roll!');
            // };
            // this.time.events.add(Phaser.Timer.SECOND * 5 + columnIndex * 100, function () {
            //     wheel.stop([2, 5, 7, 1, 4], callback);
            // }, wheel);
        });
    }
}
