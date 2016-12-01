import { model } from 'modules/Model/Model';

export class Brain {
    constructor({ position }) {
        // Инит параметры
        this.game = model.el('game');
        this.position = position;

        // Создаем мозги
        this.char = this.game.add.spine(
            this.position.x,
            this.position.y,
            'FlyingBrain'
        );
        // Запускаем стандартную анимацию
        this.char.setAnimationByName(0, 'Idle', true);
    }

    Win() {
        // Запускаем анимацию выигрыша
        this.char.setAnimationByName(0, 'Win', false);
        // Затем опять нормальную
        this.char.addAnimationByName(0, 'Idle', true);
    }

    Up(callback) {
        // Запускаем последнюю выигрышную анимацию (полет вверх)
        let anim = this.char.setAnimationByName(0, 'Win2', false);
        // В конце анимации вызываем callback (анимация собирания Зомби)
        this.game.time.events.add(anim.endTime * 1000, () => {
            callback();
        });
    }
}
