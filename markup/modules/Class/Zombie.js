import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as soundController } from 'modules/Sound/Controller';

export class Zombie {

    constructor({ position, multi }) {

        // инит входящие параметры
        this.game = model.el('game');
        this.position = position;
        if (multi) {
            this.multi = multi - 2;
        } else {
            this.multi = 0;
        }

        // Создаем Зомби
        this.char = this.game.add.spine(
            this.position.x,
            this.position.y,
            'Zombie'
        );
        // Запускаем начальную анимацию
        this.char.setAnimationByName(0, 'idle' + this.multi, true);
    }

    Up(callback) {
        // Если множитель больше максимального - пропускаем.
        if (this.multi > config.maxMulti) return;

        // Переменные необходимые для вызова callback по окончанию анимаций
        let anim;
        let animTime = 0;

        // Увеличиваем множитель
        ++this.multi;

        // Если анимация не последняя
        if (this.multi < config.maxMulti - 1) {
            // Играем переход, потом idle анимацию для этого множителя
            anim = this.char.setAnimationByName(0, 'transition' + this.multi, false);
            animTime += anim.endTime;
            this.char.addAnimationByName(0, 'idle' + this.multi, true);
        // Если анимация - последняя
        } else {
            anim = this.char.setAnimationByName(0, 'transition6', false);
            animTime += anim.endTime;
            anim = this.char.addAnimationByName(0, 'transition7', false);
            animTime += anim.endTime;
            this.char.addAnimationByName(0, 'idle7', true);

            // Запускаем циклический проигрыш анимаций собранного зомби
            this.switcher = 2;
            this.randomAnim();
        }

        this.char.setToSetupPose();

        // Вызов callback если передан
        this.game.time.events.add(animTime * 1000, () => {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    randomAnim() {
        let zombieRandomTimer = this.game.time.events.add(10000, () => {
            soundController.sounds.zombie1.play();
            ++this.switcher;
            // Играем следующую случайную анимацию
            this.char.setAnimationByName(0, 'win' + (this.switcher % 4), false);
            this.char.addAnimationByName(0, 'idle7', true);
            // Запускаем таймер снова
            this.randomAnim();
        }, this);
        // Записываем таймер чтобы удалить на экране выхода из Фри Спинов
        model.data('zombie:randomTimer', zombieRandomTimer);
    }
}
