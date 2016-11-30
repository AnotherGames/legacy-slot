import { model } from 'modules/Model/Model';

export let controller = {
    sounds: {},
    music: {},

    _lastVolume: 100,
    get lastVolume() {
        return this._lastVolume;
    },
    set lastVolume(val) {
        if (val == 0) {
            this._lastVolume = 1;
        } else {
            this._lastVolume = val;
        }
    },

    get volume() {
        return model.state('volume');
    },
    /* val: Number (0 - 100) */
    set volume(val) {
        let _val = +val / 100;
        if (_val < 0) _val = 0;
        if (_val > 1) _val = 1;
        if (_val === this.volume) return;

        model.state('volume', _val);

        this.game.sound.volume = _val;
    },

    get isMusic() {
        return model.state('music');
    },
    set isMusic(val) {
        if (typeof (val) !== 'boolean') {
            console.error('set isMusic: Input parameter is not boolean.', val);
            return;
        }
        if (val === this.isMusic) return;

        model.state('music', val);

        let keys = Object.keys(this.music);
        keys.forEach((key) => {
            this.music[key].mute = !val;
        });
    },

    get isSound() {
        return model.state('sound');
    },
    set isSound(val) {
        if (typeof (val) !== 'boolean') {
            console.error('set isSound: Input parameter is not boolean.', val);
            return;
        }
        if (val === this.isSound) return;

        model.state('sound', val);

        let keys = Object.keys(this.sounds);
        keys.forEach((key) => {
            this.sounds[key].mute = !val;
        });
    },

    init: function ({
        volume = 1,
        sound = true,
        music = true
    }) {
        // model.data('soundModule', sound);

        if (this.game) {
            let keys = Object.keys(this.sounds);
            keys.forEach((key) => {
                this.sounds[key].stop();
            });
            keys = Object.keys(this.music);
            keys.forEach((key) => {
                this.music[key].stop();
            });
        }

        const game = model.el('game');
        this.game = game;
        // Fon
        this.music.fon = game.add.audio('fon', 1, true);
        this.music.fsFon = game.add.audio('fsFon', 1, true);
        this.music.startPerehod = game.add.audio('startPerehod', 1, true);
        this.music.finishPerehod = game.add.audio('finishPerehod', 1, true);
        // Sound
        this.sounds.button = game.add.audio('buttonClick');
        this.sounds.baraban = game.add.audio('baraban');
        this.sounds.lineWin = game.add.audio('lineWin');
        this.sounds.lineWin2 = game.add.audio('lineWin2');
        this.sounds.brain1 = game.add.audio('mozgi1');
        this.sounds.brain2 = game.add.audio('mozgi2');
        this.sounds.zombie1 = game.add.audio('zombie1');
        this.sounds.zombie2 = game.add.audio('zombie2');

        let keys = Object.keys(this.sounds);
        keys.forEach((key) => {
            this.sounds[key].mute = !sound;
        });
        keys = Object.keys(this.music);
        keys.forEach((key) => {
            this.music[key].mute = !music;
            this.music[key].volume = 0.6;
        });

        this.volume = volume * 100;

        model.state('volume', volume);
        model.state('sound', sound);
        model.state('music', music);
    }
};
