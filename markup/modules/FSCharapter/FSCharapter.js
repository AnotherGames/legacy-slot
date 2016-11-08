export class FSCharapter {
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

        this.game = param.game;
        this.position = param.position;

        let animBG = this.game.add.spine(
            this.position.x,        // X positon
            this.position.y,        // Y position
            'FSCharapter'     // the key of the object in cache
        );
        animBG.setAnimationByName(
            0,          // Track index
            '1',     // Animation's name
            true        // If the animation should loop or not
        );
    }
}
