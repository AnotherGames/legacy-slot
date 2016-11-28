import { model } from 'modules/Model/Model';

export class Element {
    /*  param: {
            game: Object,
            parent: Object,
            el: Number,
            animation: String,
            x: Number,
            y: Number
        }   */
    constructor(param) {
        if (param === undefined) {
            console.error('constructor: param is undefined');
            return;
        }
        if (param.game === undefined) {
            console.error('constructor: param.game is undefined', param);
            return;
        } else {
            this.game = param.game;
        }

        const game = model.el('game');

        this.group = game.add.group(param.parent);
        this.group.x = param.x;
        this.group.y = param.y;

        this.sprites = [];
        for (let i = 1; i < 11; i++) {
            let prefix;
            if (i < 10) {
                prefix = '0';
            } else {
                prefix = '';
            }
            let sprite = game.add.sprite(0, 0, `${prefix}${i}`, null, this.group);
            this.sprites.push(sprite);
            switch (i) {
                case 1:
                    this._addAnimation(sprite, { el: 1, n: false, w: 16 });
                    break;
                case 2:
                    this._addAnimation(sprite, { el: 2, n: 16, w: 16 });
                    break;
                case 3:
                    this._addAnimation(sprite, { el: 3, n: false, w: 16 });
                    break;
                case 4:
                    this._addAnimation(sprite, { el: 4, n: 16, w: 16 });
                    break;
                case 5:
                    this._addAnimation(sprite, { el: 5, n: false, w: 16 });
                    break;
                case 6:
                    this._addAnimation(sprite, { el: 6, n: 16, w: 16 });
                    break;
                case 7:
                    this._addAnimation(sprite, { el: 7, n: false, w: 16 });
                    break;
                case 8:
                    this._addAnimation(sprite, { el: 8, n: 16, w: 16 });
                    break;
                case 9:
                    this._addAnimation(sprite, { el: 9, n: 16, w: 16 });
                    break;
                case 10:
                    this._addAnimation(sprite, { el: 10, n: 16, w: 16 });
                    break;
                default:
                    break;
            }
        }
        this.sprites.forEach((sprite) => {
            sprite.visible = false;
            sprite.anchor.set(0.5);
        });
        this.active = param.el;
        this.sprites[param.el - 1].visible = true;
        this.sprites[param.el - 1].animations.play(`${param.el}-${param.animation}`);
        // if (model.state('mobile')) {
        //     this.sprite.scale.x = this.sprite.scale.y = 1.5;
        // }
    }

    play(animation) {
        console.log('if: ', this.sprites[this.active - 1].animations.currentAnim.name, animation);
        if (this.sprites[this.active - 1].animations.currentAnim.name === animation) {
            console.log('Normal anim!');
            return;
        }
        // this.play(`${this.active}-n`);
        this.sprites.forEach((sprite) => {
            sprite.visible = false;
        });
        this.active = parseInt(animation);
        this.sprites[this.active - 1].visible = true;
        console.log('I am playing new anim!');
        this.sprites[this.active - 1].animations.play(animation);
    }

    win() {
        this.play(`${this.active}-w`);
        this.sprites[this.active - 1].animations.currentAnim.onComplete.add(() => {
            this.play(`${this.active}-n`);
        });
    }

    normal() {
        if (this.sprites[this.active - 1].animations.currentAnim === `${this.active}-n`) {
            return;
        }
        this.play(`${this.active}-n`);
    }

    hide() {
        this.sprites[this.active - 1].alpha = 0.5;
    }

    show() {
        this.sprites[this.active - 1].alpha = 1;
    }

    _addAnimation(sprite, options) {
        let prefix;
        if (options.el < 10) {
            prefix = 0;
        } else {
            prefix = '';
        }
        sprite.animations.add(`${options.el}-n`,
            options.n
            ? Phaser.Animation.generateFrameNames(`${prefix}${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${prefix}${options.el}-n-01.png`], 16, true);
        sprite.animations.add(`${options.el}-b`, [`${prefix}${options.el}-b-01.png`], 16, true);
        sprite.animations.add(`${options.el}-w`, Phaser.Animation.generateFrameNames(`${prefix}${options.el}-w-`, 1, options.w, '.png', 2), 16, false);
    }
}
