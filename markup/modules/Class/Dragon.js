import { model } from 'modules/Model/Model';

export class Dragon {

    constructor({ position, container }) {

        // инит входящие параметры
        this.game = model.el('game');
        this.position = position;
        this.container = container;
        this.nextAnim = 'FS_idle_2';

        this.char = this.game.add.spine(
            this.position.x,
            this.position.y,
            'dragon'
        );
        this.container.add(this.char);
        this.char.setAnimationByName(0, 'N_idle_1', true);
    }
    FlyToFS() {
        this.char.setAnimationByName(0, 'Goto_FS', false);
    }
    FlyToMain() {
        this.char.setAnimationByName(0, 'FS_idle_end', false);
        this.char.addAnimationByName(0, 'Transfer1', false);
    }
    Eat() {
        console.log(this.game.rnd.integerInRange(2, 5));
        this.char.setAnimationByName(0, 'FS_eat_' + this.game.rnd.integerInRange(2, 5), false);
        if (model.data('rollResponse').NextMode !== 'root') {
            this.char.addAnimationByName(0, 'FS_idle_1', false);
            if (this.nextAnim == 'FS_idle_2') {
                this.nextAnim = 'FS_idle_3';
            } else {
                this.nextAnim = 'FS_idle_2';
            }
            this.randomAnim();
        }
    }
    IdleFS() {
        this.char.addAnimationByName(0, 'FS_idle_1', true);
    }
    randomAnim() {
       // Играем следующую случайную анимацию
       this.char.addAnimationByName(0, this.nextAnim, false);
       this.char.addAnimationByName(0, 'FS_idle_1', true);
   }
}
