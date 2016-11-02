import { config } from '../../modules/Util/Config';

export class Glista {
    /*  param: {
        game: Game,
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
        if (param.game === undefined) {
            console.error('constructor: param.game is undefined', param);
            return;
        }
        if (param.parent === undefined) {
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
        this.parent = param.parent;
        this.elSize = param.elSize;
        // инитим внутрение параметры
        this.timer = 0;
        this.progress = 0;

        this.pointStartPos = {
            x: this.elSize.width * -5,
            y: 0
        };

        this.pointEndPos = {
            x: this.elSize.width * 5,
            y: 0
        };

        this.sprite = this.game.add.sprite( this.pointStartPos.x, this.pointStartPos.y, 'glista', null, param.parent);
        this.sprite.anchor.set(0.90, 0.5);
        this.sprite.visible = false;
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
        if (time <= 0) {
            console.error('start: time is incorrectly.', time);
            return;
        }

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

        this.sprite.visible = true;
        this.sprite.position.set(this.bezierPath.x[0], this.bezierPath.y[0]);
        this.sprite.rotation = 0;

        let _this = this;
        this._clock = this.game.time.create(true);
        this._clock.add(time, () => {}, this);
        this._clock.start();
        this.timer = 0;
        this.progress = 0;

        let node = { x: this.bezierPath.x[0], y: this.bezierPath.y[0], angle: 0 };

        let anim = function () {
            _this.timer = time - _this._clock.duration;
            _this.progress = _this.timer / time;
            if (_this.progress > 1) {
                _this.progress = 1;
            }

            let px = _this.game.math.catmullRomInterpolation(_this.bezierPath.x, _this.progress);
            let py = _this.game.math.catmullRomInterpolation(_this.bezierPath.y, _this.progress);
            let angle = _this.game.math.angleBetweenPoints(node, { x: px, y: py, angle: 0 });
            node = { x: px, y: py, angle: angle };

            _this.sprite.position.set(px, py);
            _this.sprite.rotation = angle;

            if (_this.progress === 1) {
                _this.game.frameAnims.splice(_this.game.frameAnims.indexOf(anim), 1);

                if (typeof (callback) === 'function') {
                    callback();
                }
            }
        };
        this.game.frameAnims.push(anim);
    }
    remove() {
        this.sprite.destroy();
    }
}
