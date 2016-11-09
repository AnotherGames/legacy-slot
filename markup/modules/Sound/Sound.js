import { model } from 'modules/Sound/Sound';

export let sound = {
    game: undefined,
    sounds: {},
    music: {
        fon: undefined
    },

    _volume: 1,
    get volume() {
        return this._volume;
    },
    /* val: Number (0 - 100) */
    set volume(val) {
        let _val = +val / 100;
        if (_val < 0) _val = 0;
        if (_val > 1) _val = 1;
        if (_val === this._volume) return;

        this._volume = _val;
        this.game.sound.volume = _val;
    },

    _isMusic: true,
    get isMusic() {
        return this._isMusic;
    },
    set isMusic(val) {
        if (typeof (val) !== 'boolean') {
            console.error('set isMusic: Input parameter is not boolean.', val);
            return;
        }
        if (val === this._isMusic) return;

        this._isMusic = val;

        let keys = Object.keys(this.music);
        keys.forEach((key) => {
            this.music[key].mute = !val;
        });
    },

    _isSound: true,
    get isSound() {
        return this._isSound;
    },
    set isSound(val) {
        if (typeof (val) !== 'boolean') {
            console.error('set isSound: Input parameter is not boolean.', val);
            return;
        }
        if (val === this._isSound) return;

        this._isSound = val;

        model.state('sound', val);

        let keys = Object.keys(this.sounds);
        keys.forEach((key) => {
            this.sounds[key].mute = !val;
        });
    },

    init: function (game) {
        this.game = game;
        // Fon
        this.music.fon = this.game.add.audio('fon', 1, true);
        // Sound
        //
        this.sounds.button = this.game.add.audio('buttonClick');
        this.sounds.baraban = this.game.add.audio('baraban');
        this.sounds.lineWin = game.add.audio('lineWin');
        this.sounds.lineWin2 = game.add.audio('lineWin2');
    }
};
