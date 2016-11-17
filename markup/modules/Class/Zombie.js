export class Zombie {
    /*  param: {
            game: State,
            position: {
                x: Number,
                y: Number
            },
            level: Number ()
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
        this.level = 0;
        if (typeof (param.multi) === 'number') {
            if (param.multi > 7 || param.multi < 2) console.error('constructor: param.multi is incorrect');
            else this.level = param.multi - 2;
        }

        this.char = this.game.add.spine(
            this.position.x,        // X positon
            this.position.y,        // Y position
            'FSCharapter'     // the key of the object in cache
        );
        this.char.setAnimationByName(0, 'idle' + this.level, true);
    }
    Up(callback) {
        if (this.level >= 6) return;
        let anim;
        let animTime = 0;
        ++this.level;
        if (this.level < 6) {
            anim = this.char.setAnimationByName(0, 'transition' + this.level, false);
            animTime += anim.endTime;
            this.char.addAnimationByName(0, 'idle' + this.level, true);
        } else {
            anim = this.char.setAnimationByName(0, 'transition6', false);
            animTime += anim.endTime;
            anim = this.char.addAnimationByName(0, 'transition7', false);
            animTime += anim.endTime;
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

        this.game.time.events.add(animTime * 1000, () => {
            if (typeof (callback) === 'function') {
                callback();
            }
        });
    }
}
