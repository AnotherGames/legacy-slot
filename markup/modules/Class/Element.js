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
        for (let i = 1; i < 12; i++) {
            let sprite = game.add.sprite(0, 0, i, null, this.group);
            this.sprites.push(sprite);
            switch (i) {
                case 1:
                    this._addAnimation(sprite, { el: 1, n: false, w: 15 });
                    break;
                case 2:
                    this._addAnimation(sprite, { el: 2, n: 20, w: 20 });
                    break;
                case 3:
                    this._addAnimation(sprite, { el: 3, n: false, w: 15 });
                    break;
                case 4:
                    this._addAnimation(sprite, { el: 4, n: 15, w: 25 });
                    break;
                case 5:
                    this._addAnimation(sprite, { el: 5, n: false, w: 15 });
                    break;
                case 6:
                    this._addAnimation(sprite, { el: 6, n: 15, w: 15 });
                    break;
                case 7:
                    this._addAnimation(sprite, { el: 7, n: false, w: 15 });
                    break;
                case 8:
                    this._addAnimation(sprite, { el: 8, n: 15, w: 15 });
                    break;
                case 9:
                    this._addAnimation(sprite, { el: 9, n: 15, w: 15 });
                    break;
                case 10:
                    this._addAnimation(sprite, { el: 10, n: 15, w: 15 });
                    break;
                case 11:
                    this._addAnimation(sprite, { el: 11, n: 15, w: 15 });
                    break;
                default:

            }
        }

        this.sprites[param.el].animations.play(`${param.el}-${param.animation}`);
        this.sprites.forEach((sprite) => {
            sprite.visible = false;
            sprite.anchor.set(0.5);
        });
        this.sprites[param.el - 1].visible = true;
        // if (model.state('mobile')) {
        //     this.sprite.scale.x = this.sprite.scale.y = 1.5;
        // }
    }

    play(animation) {
        this.sprites.forEach((sprite) => {
            sprite.visible = false;
        })
        this.sprites[parseInt(animation) - 1].visible = true;
        this.sprites[parseInt(animation) - 1].animations.play(animation);
        // if (!model.state('isAnimations')) {
        //     this.sprite.animations.paused = true;
        // }
    }

    win() {
        let name = parseInt(this.sprites.filter((sprite) => {
            return sprite.visible === true;
        })[0].animations.currentAnim.name);
        this.play(`${name}-w`);
        // this.sprite.animations.currentAnim.onComplete.add(() => {
        //     this.play(`${name}-n`);
        // });
    }

    normal() {
        // let name = parseInt(this.sprite.animations.currentAnim.name);
        // if (this.sprite.animations.currentAnim === `${name}-n`) return;
        // this.play(`${name}-n`);
    }

    _addAnimation(sprite, options) {
        sprite.animations.add(`${options.el}-n`,
            options.n
            ? Phaser.Animation.generateFrameNames(`${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${options.el}-n.png`], 15, true);
        sprite.animations.add(`${options.el}-b`, [`${options.el}-b.png`], 15, true);
        sprite.animations.add(`${options.el}-w`, Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2), 15, true);
    }
}
