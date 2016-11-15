import { model } from 'modules/Model/Model';

export let sound = {
    sounds: {},
    music: {},

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
        this.music.fon.mute = !music;
        this.music.fsFon = game.add.audio('fsFon', 1, true);
        this.music.fsFon.mute = !music;
        this.music.startPerehod = game.add.audio('startPerehod', 1, true);
        this.music.startPerehod.mute = !music;
        this.music.finishPerehod = game.add.audio('finishPerehod', 1, true);
        this.music.finishPerehod.mute = !music;
        // Sound
        this.sounds.button = game.add.audio('buttonClick');
        this.sounds.button.mute = !sound;
        this.sounds.baraban = game.add.audio('baraban');
        this.sounds.baraban.mute = !sound;
        this.sounds.lineWin = game.add.audio('lineWin');
        this.sounds.lineWin.mute = !sound;
        this.sounds.lineWin2 = game.add.audio('lineWin2');
        this.sounds.lineWin2.mute = !sound;

        model.state('volume', volume);
        model.state('sound', sound);
        model.state('music', music);
    }
};
