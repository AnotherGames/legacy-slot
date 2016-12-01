import { model } from 'modules/Model/Model';

export class Dragon {

    constructor({ position, container }) {

        // инит входящие параметры
        this.game = model.el('game');
        this.position = position;
        this.container = container;

        this.char = this.game.add.spine(
            this.position.x,
            this.position.y,
            'dragon'
        );
        this.container.add(this.char);
        this.char.setAnimationByName(0, 'N_idle_1', true);
    }
    FlyFS() {
        this.char.setAnimationByName(0, 'Goto_FS', false);
    }
    Eat() {
        this.char.setAnimationByName(0, 'FS_eat_1', false);
        this.char.addAnimationByName(0, 'FS_idle_1', true);
    }
}
