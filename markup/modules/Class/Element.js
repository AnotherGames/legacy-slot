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

            // Опустить немного бутылку
            // if (i == 2
            // || i == 4
            // || i == 6
            // || i == 8) {
            //     sprite.y += 10;
            // }

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

    play(animation, loop = true, fps = 20) {
        // Если спрайт уже проигрывает нужную нам анимацию, то мы ничего не будем делать чтобы анимация не прыгала
        if (this.activeSprite.animations.currentAnim.name === animation) return;

        // Делаем невидимым спрайт который раньше играл анимацию
        this.activeSprite.visible = false;

        // Находим новый активный спрайт, делаем его видимым и запускаем нужную анимацию
        this.active = parseInt(animation);
        this.activeSprite = this.sprites[this.active - 1];
        this.activeSprite.visible = true;
        this.activeSprite.animations.play(animation, fps, loop);

    }

    win(loop = false, cb) {
        // Проигрывам выигрышную анимацию
        this.play(`${this.active}-w`, loop, 30);
        this.activeSprite.animations.currentAnim.onComplete.add(() => {
            // После которой опять играем нормальную анимацию
            this.play(`${this.active}-n`);
            if (cb) {
                cb();
            }
        });
    }

    playIfNotWin(animation) {
        if (this.activeSprite.animations.currentAnim.name.indexOf('w') != -1) return;
        this.play(animation);
    }

    normal() {
        // Проигрывам нормальную анимацию
        this.play(`${this.active}-n`);
    }

    hide(alpha = 0.5) {
        // Делаем элемент полупрозрачным
        this.group.alpha = alpha;
    }

    show() {
        // Возращаем нормальное состояние
        this.group.alpha = 1;
    }

    // Вспомогательные методы для добавления анимаций для спрайтов
    addSpriteAnimation(sprite, index) {
        switch (index) {
            case 1:
                this.addAnimation(sprite, { el: 1, n: 29, w: 29 });
                break;
            case 2:
                this.addAnimation(sprite, { el: 2, n: 29, w: 29 });
                break;
            case 3:
                this.addAnimation(sprite, { el: 3, n: 29, w: 29 });
                break;
            case 4:
                this.addAnimation(sprite, { el: 4, n: 29, w: 29 });
                break;
            case 5:
                this.addAnimation(sprite, { el: 5, n: 29, w: 29 });
                break;
            case 6:
                this.addAnimation(sprite, { el: 6, n: 29, w: 29 });
                break;
            case 7:
                this.addAnimation(sprite, { el: 7, n: 29, w: 29 });
                break;
            case 8:
                this.addAnimation(sprite, { el: 8, n: 29, w: 29 });
                break;
            case 9:
                this.addBottleAnimation(sprite, { el: 9 });
                break;
            case 10:
                this.addBottleAnimation(sprite, { el: 10 });
                break;
            case 11:
                this.addBottleAnimation(sprite, { el: 11 });
                break;
            case 12:
                this.addBottleAnimation(sprite, { el: 12 });
                break;
            case 13:
                this.addBottleAnimation(sprite, { el: 13 });
                break;
            case 14:
                this.addBottleAnimation(sprite, { el: 14 });
                break;
            case 15:
                this.addBottleAnimation(sprite, { el: 15 });
                break;
            case 16:
                this.addBottleAnimation(sprite, { el: 16 });
                break;
            case 17:
                this.addBottleAnimation(sprite, { el: 17 });
                break;
            case 18:
                this.addAnimation(sprite, { el: 18, n: 29, w: 29 });
                break;
            case 19:
                this.addAnimation(sprite, { el: 19, n: 29, w: 29 });
                break;
            case 20:
                this.addAnimation(sprite, { el: 20, n: 29, w: 29 });
                break;
            default:
                break;

        }
    }

    addBottleAnimation(sprite, options) {
        sprite.animations.add(`${options.el}-n`, [`${options.el}-n-00.png`]);
        sprite.animations.add(`${options.el}-b`, [`${options.el}-n-00.png`]);
        sprite.animations.add(`${options.el}-w`, [`${options.el}-n-00.png`]);
    }

    addAnimation(sprite, options) {
        let prefix;
        if (options.el < 10) {
            prefix = 0;
        } else {
            prefix = '';
        }
        sprite.animations.add(`${options.el}-n`,
            // Если параметр options.n == false - то у нас будет только один кадр, в другом случае это будет количество кадров в анимации
            options.n
            ? Phaser.Animation.generateFrameNames(`${prefix}${options.el}-n-`, 0, options.n, '.png', 2)
            : [`${prefix}${options.el}-n-00.png`], 20);

        sprite.animations.add(`${options.el}-b`, [`${prefix}${options.el}-b-00.png`], 20);

        sprite.animations.add(`${options.el}-w`,
            // Если параметр options.w == false - то у нас будет только один кадр, в другом случае это будет количество кадров в анимации
            options.w
            ? Phaser.Animation.generateFrameNames(`${prefix}${options.el}-w-`, 0, options.w, '.png', 2)
            : [`${prefix}${options.el}-w-00.png`], 20);
            // Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2), 15, false);
    }
}
