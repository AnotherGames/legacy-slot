import { config } from 'modules/Util/Config';
import { model } from 'modules/Model/Model';

export class Glista {
    /*  param: {
        game: Game,
        lightParent: Group,
        parent: Group,
        elSize: {
            width: Number,
            height: Number
        }
    }   */
    constructor(param) {
        if (typeof (param) !== 'object') {
            console.error('constructor: param is not object');
            return;
        }
        if (typeof param.game === 'undefined') {
            console.error('constructor: param.game is undefined', param);
            return;
        }
        if (typeof param.lightParent === 'undefined') {
            console.error('constructor: param.parent is undefined', param);
            return;
        }
        if (typeof param.parent === 'undefined') {
            console.error('constructor: param.parent is undefined', param);
            return;
        }
        if (typeof (param.elSize) !== 'object') {
            console.error('constructor: param.elSize is undefined', param);
            return;
        }
        if (typeof (param.elSize.width) !== 'number') {
            console.error('constructor: param.elSize.width is undefined', param);
            return;
        }
        if (typeof (param.elSize.height) !== 'number') {
            console.error('constructor: param.elSize.height is undefined', param);
            return;
        }
        // инитим входящие параметры
        this.game = param.game;
        this.lightParent = param.lightParent;
        this.parent = param.parent;
        this.elSize = param.elSize;
        // инитим внутрение параметры
        this.timer = 0;
        this.progress = 0;
        this.isPlay = false;
        this.isRemove = false;

        this.pointStartPos = {
            x: this.elSize.width * -5,
            y: 0
        };

        this.pointEndPos = {
            x: this.elSize.width * 5,
            y: 0
        };


        this.sprites = [];
        this.light = [];
        for (let atlasInd = 0; atlasInd <= 30; atlasInd++) {
            let sprite = this.game.add.sprite( atlasInd * -80, 0, 'bubble', null, param.parent);
            sprite.anchor.set(0.5);
            sprite.visible = false;
            sprite.myDeltaY = this.game.rnd.integerInRange(-30, 30) + (model.desktop) ? 40 : -10;
            sprite.myScale = this.game.rnd.integerInRange(1, 5) / (atlasInd + 5);
            this.sprites.push(sprite);

            // let lightSprite = this.game.add.sprite( atlasInd * -80, 0, 'ligthGlista', null, param.lightParent);
            // lightSprite.scale.set(1.3 - 0.2 * atlasInd);
            // lightSprite.anchor.set(0.5);
            // lightSprite.visible = false;
            // this.light.push(lightSprite);
        }

        this.pointPos = [];

        for (let columInd = 0; columInd < 5; columInd++) {
            this.pointPos[columInd] = [];
            for (let rowInd = 0; rowInd < 3; rowInd++) {
                this.pointPos[columInd][rowInd] = {
                    x: this.elSize.width * (columInd - 2),
                    y: this.elSize.height * (rowInd - 1)
                };
            }
        }
    }
    /*  path: Array[5],
        *time: Number, (milisecond)
        *callback: Function
    */
    start(path, time = config.glista.time, callback) {
        if (this.isPlay) return;
        if (this.isRemove) {
            console.warn('start: Glista is remove.');
            return;
        }
        if (!Array.isArray(path)) {
            console.error('start: path is not Array.', path);
            return;
        }
        if (path.length > 5) {
            console.error('start: path.lenth > 5', path);
            return;
        }
        for (let pathInd = 0; pathInd < path.length; pathInd++) {
            if (typeof (path[pathInd]) !== 'number') {
                continue;
            }
            if (path[pathInd] < 0 || path[pathInd] > 2) {
                console.error('start: path[' + pathInd + '] is incorrectly.', path);
                return;
            }
        }
        if (typeof (time) !== 'number') {
            console.error('start: time is not Number', time);
            return;
        }
        if (time === 0) {
            console.error('start: time is incorrectly.', time);
            return;
        }

        this.isPlay = true;

        this.direction = (time < 0) ? -1 : 1;
        time = Math.abs(time);


        if (this.direction < 0) {
            this.bezierPath = {
                x: [this.pointEndPos.x],
                y: [this.pointEndPos.y]
            };
            for (let pathInd = path.length - 1; pathInd >= 0; pathInd--) {
                if (typeof (path[pathInd]) !== 'number') continue;
                this.bezierPath.x.push(this.pointPos[pathInd][ path[pathInd] ].x);
                this.bezierPath.y.push(this.pointPos[pathInd][ path[pathInd] ].y);
            }
            this.bezierPath.x.push(this.pointStartPos.x);
            this.bezierPath.y.push(this.pointStartPos.y);
        } else {
            this.bezierPath = {
                x: [this.pointStartPos.x],
                y: [this.pointStartPos.y]
            };
            for (let pathInd = 0; pathInd < path.length; pathInd++) {
                if (typeof (path[pathInd]) !== 'number') continue;
                this.bezierPath.x.push(this.pointPos[pathInd][ path[pathInd] ].x);
                this.bezierPath.y.push(this.pointPos[pathInd][ path[pathInd] ].y);
            }
            this.bezierPath.x.push(this.pointEndPos.x);
            this.bezierPath.y.push(this.pointEndPos.y);
        }

        let nodes = [];

        for (let spriteInd = 0; spriteInd < this.sprites.length; spriteInd++) {
            this.sprites[spriteInd].visible = true;
            this.sprites[spriteInd].position.set(this.bezierPath.x[0], this.bezierPath.y[0]);
            this.sprites[spriteInd].rotation = 0;
            nodes.push({ x: this.bezierPath.x[0], y: this.bezierPath.y[0], angle: 0 });

            // this.light[spriteInd].visible = true;
            // this.light[spriteInd].position.set(this.bezierPath.x[0], this.bezierPath.y[0]);
        }

        let _this = this;
        this._clock = this.game.time.create(true);
        this._clock.add(time, () => {}, this);
        this._clock.start();
        this.timer = 0;
        this.progress = 0;
        let margin = 0.015;


        let anim = function () {
            _this.timer = time - _this._clock.duration;
            _this.progress = _this.timer / time;
            if (_this.progress > 1) {
                _this.progress = 1;
            }

            if (_this.progress < 0.5) {
                margin = 0.015 - 0.015 * _this.progress;
            } else {
                margin = 0.015 - 0.015 * (1 - _this.progress);
            }

            for (let spriteInd = 0; spriteInd < _this.sprites.length; spriteInd++) {
                let progress = _this.progress - margin * spriteInd;
                if (progress <= 0) {
                    break;
                }

                let px = _this.game.math.catmullRomInterpolation(_this.bezierPath.x, progress);
                let py = _this.game.math.catmullRomInterpolation(_this.bezierPath.y, progress);
                let angle = _this.game.math.angleBetweenPoints(nodes[spriteInd], { x: px, y: py, angle: 0 });
                nodes[spriteInd] = { x: px, y: py, angle: angle };

                _this.sprites[spriteInd].position.set(px, py + _this.sprites[spriteInd].myDeltaY);
                _this.sprites[spriteInd].scale.set(_this.sprites[spriteInd].myScale);
                // _this.light[spriteInd].position.set(px, py);
                // if (progress < 0.5) {
                //     _this.sprites[spriteInd].scale.set(1.2 - 1.2 * progress);
                // } else {
                //     _this.sprites[spriteInd].scale.set(1.2 * progress);
                // }
                _this.sprites[spriteInd].rotation = angle;
            }

            if (_this.progress === 1) {
                _this.isPlay = false;
                _this.game.frameAnims.splice(_this.game.frameAnims.indexOf(anim), 1);

                for (let spriteInd = 0; spriteInd < _this.sprites.length; spriteInd++) {
                    _this.sprites[spriteInd].visible = false;
                    // _this.light[spriteInd].visible = false;
                }

                if (typeof (callback) === 'function') {
                    callback();
                }
            }
        };
        this.game.frameAnims.push(anim);
    }
    remove() {
        let game = model.el('game');
        if (this.isPlay) {
            console.error('remove: glista is play.');
            return;
        }
        if (this.isRemove) {
            console.warn('remove: Glista is remove.');
            return;
        }
        this.isRemove = true;
        this.sprites.forEach((sprite) => {
            game.add.tween(sprite).to({alpha: 0}, 300, 'Linear', true)
                .onComplete.add(() => {
                    sprite.destroy();
                });
        });
        // this.light.forEach((item) => {
        //     item.destroy();
        // });
    }
}
