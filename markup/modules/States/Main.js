import { buttons } from 'modules/Buttons/Buttons';
import { model } from '../../modules/Model/Model';
import { config } from '../../modules/Util/Config';
import { Wheels } from '../../modules/Wheels/Wheels';

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
    }
    preload() {

    }
    create() {
        this.drawMainBG();
        this.drawMainContainer();
        buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);

        model.data('mainXLeft', 2 * model.data('buttonsDelta'));
        model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        this.mainContainer.x = model.data('mainXLeft');

        // const centerEl = this.add.sprite(this.world.centerX, this.world.centerY, '3', '3-n.png').anchor.set(0.5);

        const machineContainer = this.add.group(this.mainContainer, 'gameMachine');
        machineContainer.position.set(this.world.centerX, this.world.centerY);

        let wheels = [];
        let elSize = config[model.state('res')].elements;
        for (let i = -2; i < 3; i++) {
            wheels.push(new Wheels({
                state: this,
                parent: machineContainer,
                position: {
                    x: i * elSize.width,
                    y: 0
                },
                elSize
            }));
        }

        console.log(wheels);
    }

    drawMainBG() {
        let mainBG = this.add.sprite(0, 0, 'mainBG', null, this.bgContainer);

    }

    drawMainContainer() {
        let gameBG = this.add.sprite(this.world.width * 0.036, this.world.height * 0.1, 'gameBG', null, this.mainContainer);
        let gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);

    }
}
