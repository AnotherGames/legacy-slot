import { buttons } from 'modules/Buttons/Buttons';
import { model } from '../../modules/Model/Model';

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
        let gameMachine = this.add.sprite(0, 0, 'gameMachine', null, this.mainContainer);
        buttons.drawMobileButtons(this.buttonsContainer, this, this.mainContainer.width);

        model.data('mainXLeft', 2 * model.data('buttonsDelta'));
        model.data('mainXRight', this.game.width - this.mainContainer.width - model.data('buttonsDelta') * 2);
        // gameMachine.x = model.data('buttonsDelta') * 2;
        this.mainContainer.x = model.data('mainXLeft');
    }
    drawMainBG() {

    }
    drawMainContainer() {

    }
}
