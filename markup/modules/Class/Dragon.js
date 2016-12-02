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
    FlyToFS() {
        this.char.setAnimationByName(0, 'Goto_FS', false);
    }
    FlyToMain() {
        this.char.setAnimationByName(0, 'Transfer1', false);
    }
    Eat() {
        this.char.setAnimationByName(0, 'FS_eat_1', false);
        if (model.data('rollResponse').NextMode !== 'root') {
            this.char.addAnimationByName(0, 'FS_idle_1', true);
        }
    }
    IdleFS() {
        this.char.addAnimationByName(0, 'FS_idle_1', true);
        this.nextAnim = 'FS_idle_2';
        this.randomAnim();
    }
    randomAnim() {
       let dragonRandomTimer = this.game.time.events.add(5000, () => {
           // Играем следующую случайную анимацию
           this.char.setAnimationByName(0, this.nextAnim, false);
           this.char.addAnimationByName(0, 'FS_idle_1', true);

           if (this.nextAnim == 'FS_idle_2') {
               this.nextAnim = 'FS_idle_3';
           } else {
               this.nextAnim = 'FS_idle_2';
           }
           // Запускаем таймер снова
           this.randomAnim();
       }, this);
       // Записываем таймер чтобы удалить на экране выхода из Фри Спинов
       model.data('dragon:randomTimer', dragonRandomTimer);
   }
}
