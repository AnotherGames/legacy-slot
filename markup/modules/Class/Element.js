import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export class Element {

    constructor({ position, container }) {
        let game = model.el('game');

        // Создаем контейнер для элементов (это будет один элемент на экране)
        this.group = game.add.group(container);
        this.group.x = position.x;
        this.group.y = position.y;

        // Заполняем его спрайтами всех элементов (они будут расположенны друг на друге)
        this.sprites = [];
        for (let i = 1; i <= config.symbolsCount; i++) {
            // Создаем по спрайту для каждого символа и делаем их не видимыми
            let sprite = game.add.sprite(0, 0, i, null, this.group);
                sprite.anchor.set(0.5);
                sprite.visible = false;
            this.sprites.push(sprite);

            // Каждому спрайту добавляем необходимые анимации
            this.addSpriteAnimation(sprite, i);
        }

        // По умолчанию все символы будут проигрывать анимацию "1-n" и этот символ будет видимым
        this.active = 1;
        this.activeSprite = this.sprites[0];
        this.activeSprite.visible = true;
        this.activeSprite.animations.play('1-n');
    }

    play(animation) {
        // Если спрайт уже проигрывает нужную нам анимацию, то мы ничего не будем делать чтобы анимация не прыгала
        if (this.activeSprite.animations.currentAnim.name === animation) return;

        // Делаем невидимым спрайт который раньше играл анимацию
        this.activeSprite.visible = false;

        // Находим новый активный спрайт, делаем его видимым и запускаем нужную анимацию
        this.active = parseInt(animation);
        this.activeSprite = this.sprites[this.active - 1];
        this.activeSprite.visible = true;
        this.activeSprite.animations.play(animation);
    }

    win() {
        // Проигрывам выигрышную анимацию
        this.play(`${this.active}-w`);
        this.activeSprite.animations.currentAnim.onComplete.add(() => {
            // После которой опять играем нормальную анимацию
            this.play(`${this.active}-n`);
        });
    }

    normal() {
        // Проигрывам нормальную анимацию
        this.play(`${this.active}-n`);
    }

    hide() {
        // Делаем элемент полупрозрачным
        this.activeSprite.alpha = 0.5;
    }

    show() {
        // Возращаем нормальное состояние
        this.activeSprite.alpha = 1;
    }

    // Вспомогательные методы для добавления анимаций для спрайтов
    addSpriteAnimation(sprite, index) {
        switch (index) {
            case 1:
                this.addAnimation(sprite, { el: 1, n: false, w: false });
                break;
            case 2:
                this.addAnimation(sprite, { el: 2, n: 16, w: 15 });
                break;
            case 3:
                this.addAnimation(sprite, { el: 3, n: false, w: false });
                break;
            case 4:
                this.addAnimation(sprite, { el: 4, n: 16, w: 15 });
                break;
            case 5:
                this.addAnimation(sprite, { el: 5, n: false, w: false });
                break;
            case 6:
                this.addAnimation(sprite, { el: 6, n: 10, w: 25 });
                break;
            case 7:
                this.addAnimation(sprite, { el: 7, n: false, w: false });
                break;
            case 8:
                this.addAnimation(sprite, { el: 8, n: 20, w: 22 });
                break;
            case 9:
                this.addAnimation(sprite, { el: 9, n: false, w: 18 });
                break;
            case 10:
                this.addAnimation(sprite, { el: 10, n: false, w: 20 });
                break;
            case 11:
                this.addAnimation(sprite, { el: 11, n: false, w: 10 });
                break;
            default:
                break;

        }
    }

    addAnimation(sprite, options) {
        sprite.animations.add(`${options.el}-n`,
            // Если параметр options.n == false - то у нас будет только один кадр, в другом случае это будет количество кадров в анимации
            options.n
            ? Phaser.Animation.generateFrameNames(`${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${options.el}-n.png`], 15, true);

        sprite.animations.add(`${options.el}-b`, [`${options.el}-b.png`], 15, true);

        sprite.animations.add(`${options.el}-w`,
            // Если параметр options.w == false - то у нас будет только один кадр, в другом случае это будет количество кадров в анимации
            options.w
            ? Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2)
            : [`${options.el}-w.png`], 15, true);
            // Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2), 15, false);
    }
}
