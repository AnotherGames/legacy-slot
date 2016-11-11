export class Zombie {
    /*  param: {
            game: State,
            position: {
                x: Number,
                y: Number
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
        if (typeof (param.position) !== 'object') {
            console.error('constructor: param.position is undefined', param);
            return;
        }
        if (typeof (param.position.x) !== 'number') {
            console.error('constructor: param.position.x is undefined', param);
            return;
        }
        if (typeof (param.position.y) !== 'number') {
            console.error('constructor: param.position.y is undefined', param);
            return;
        }
        // инит входящие параметры
        this.game = param.game;
        this.position = param.position;
        // инит внутрение параметры
        this.level = 0;

        this.char = this.game.add.spine(
            this.position.x,        // X positon
            this.position.y,        // Y position
            'FSCharapter'     // the key of the object in cache
        );
        this.char.setAnimationByName(0, 'idle' + this.level, true);
    }
    Up() {
        if (this.level >= 7) return;
        this.level = this.level + 1;
        if (this.level < 7) {
            this.char.setAnimationByName(0, 'transition' + this.level, false);
            this.char.addAnimationByName(0, 'idle' + this.level, true);
        } else {
            this.char.setAnimationByName(0, 'transition7', false);
            this.char.addAnimationByName(0, 'idle7', true);
            let switcher = true;
            let _this = this;
            let randomAnim = function () {
                _this.game.time.events.add(5000, () => {
                    switcher = !switcher;
                    if (switcher) {
                        _this.char.setAnimationByName(0, 'win0', false);
                    } else {
                        _this.char.setAnimationByName(0, 'win1', false);
                    }
                    _this.char.addAnimationByName(0, 'idle7', true);
                    randomAnim();
                }, _this);
            };
            randomAnim();
        }
        this.char.setToSetupPose();
    }
}
