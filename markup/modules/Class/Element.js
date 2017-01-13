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
        this.bgWood = game.add.sprite(0, 0, 'coin', '1-01.png', this.group);
        this.bgBronze = game.add.sprite(0, 0, 'coin', '2-01.png', this.group);
        this.bgSilver = game.add.sprite(0, 0, 'coin', '3-01.png', this.group);
        this.bgGold = game.add.sprite(0, 0, 'coin', '3-12.png', this.group);
        this.bg = this.bgWood;

        this.woodAnim = this.bgWood.animations.add('toBronze', Phaser.Animation.generateFrameNames('1-', 1, 12, '.png', 2));
        this.bronzeAnim = this.bgBronze.animations.add('toSilver', Phaser.Animation.generateFrameNames('2-', 1, 12, '.png', 2));
        this.silverAnim = this.bgSilver.animations.add('toGold', Phaser.Animation.generateFrameNames('3-', 1, 12, '.png', 2));

        this.bg.anchor.set(0.5);
        this.bgWood.anchor.set(0.5);
        this.bgBronze.anchor.set(0.5);
        this.bgSilver.anchor.set(0.5);
        this.bgGold.anchor.set(0.5);

        this.bg.visible = false;
        this.bgWood.visible = false;
        this.bgBronze.visible = false;
        this.bgSilver.visible = false;
        this.bgGold.visible = false;
        for (let i = 1; i <= config.symbolsCount; i++) {
            // Создаем по спрайту для каждого символа и делаем их не видимыми
            let sprite = game.add.sprite(0, 0, i, null, this.group);
                sprite.anchor.set(0.5);
                sprite.visible = false;

            // Опустить немного человечков
            if(i == 2
            || i == 4
            || i == 6
            || i == 8) {
                sprite.y += 10;
            }
            if(i == 12) {
                sprite.x += 10;
            }
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

    animBG(multi) {
        if (multi == 4) {
            this.woodAnim.play(20, false);
            this.woodAnim.onComplete.add(() => {this.changeBG(multi)});
        }

        if (multi == 6) {
            this.bronzeAnim.play(20, false);
            this.bronzeAnim.onComplete.add(() => {this.changeBG(multi)});
        }

        if (multi == 8) {
            this.silverAnim.play(20, false);
            this.silverAnim.onComplete.add(() => {this.changeBG(multi)});
        }
    }

    changeBG(multi) {
        switch(multi) {
            case 2:
                this.bg = this.bgWood;
                this.bgBronze.visible = false;
                this.bgSilver.visible = false;
                this.bgGold.visible = false;
                break;
            case 4:
                this.bg = this.bgBronze;
                this.bgWood.visible = false;
                this.bgSilver.visible = false;
                this.bgGold.visible = false;
                break;
            case 6:
                this.bg = this.bgSilver;
                this.bgWood.visible = false;
                this.bgBronze.visible = false;
                this.bgGold.visible = false;
                break;
            case 8:
                this.bg = this.bgGold;
                this.bgWood.visible = false;
                this.bgBronze.visible = false;
                this.bgSilver.visible = false;
                break;
            default:
                break;
        }
        if(this.active == 2
            || this.active == 4
            || this.active == 6
            || this.active == 8) {
                this.bg.visible = true;
            } else {
                this.bg.visible = false;
            }
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
        if(this.active == 2
        || this.active == 4
        || this.active == 6
        || this.active == 8) {
            this.bg.visible = true;
        } else {
            this.bg.visible = false;
        }
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
                this.addAnimation(sprite, { el: 1, n: false, w: 29 });
                break;
            case 2:
                this.addAnimation(sprite, { el: 2, n: 29, w: 29 });
                break;
            case 3:
                this.addAnimation(sprite, { el: 3, n: false, w: 29 });
                break;
            case 4:
                this.addAnimation(sprite, { el: 4, n: 29, w: 29 });
                break;
            case 5:
                this.addAnimation(sprite, { el: 5, n: false, w: 29 });
                break;
            case 6:
                this.addAnimation(sprite, { el: 6, n: 29, w: 25 });
                break;
            case 7:
                this.addAnimation(sprite, { el: 7, n: false, w: 29 });
                break;
            case 8:
                this.addAnimation(sprite, { el: 8, n: 29, w: 29 });
                break;
            case 9:
                this.addAnimation(sprite, { el: 9, n: 29, w: 29 });
                break;
            case 10:
                this.addAnimation(sprite, { el: 10, n: 29, w: 29 });
                break;
            case 11:
                this.addAnimation(sprite, { el: 11, n: 29, w: 29 });
                break;
            case 12:
                this.addAnimation(sprite, { el: 12, n: false, w: 29 });
                break;
            default:
                break;

        }
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
