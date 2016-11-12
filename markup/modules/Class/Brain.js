export class Brain {
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

        this.char = this.game.add.spine(
            this.position.x,        // X positon
            this.position.y,        // Y position
            'FlyingBrain'     // the key of the object in cache
        );
        this.char.setAnimationByName(0, 'Idle', true);
    }
    Win() {
        this.char.setAnimationByName(0, 'Win', false);
        this.char.addAnimationByName(0, 'Idle', true);
    }
    Up(callback) {
        let anim = this.char.setAnimationByName(0, 'Win2', false);
        this.game.time.events.add(anim.endTime * 1000, () => {
            if (typeof (callback) === 'function') {
                callback();
            }
        });
    }
}
