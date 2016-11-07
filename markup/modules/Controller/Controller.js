export let controller = (function () {
    let touch = {
        _isEvent: false,
        mobile: {
            menu: {
                open: function () {},
                close: function () {}
            }
        }
    };

    let sound = {
        game: undefined,
        sounds: [],
        music: [],
        _voice: 1,
        get voice() {
            return this._voice;
        },
        /* val: Number (0 - 100) */
        set voice(val) {
            let _val = val / 100;
            if (_val < 0) _val = 0;
            if (_val > 1) _val = 1;
            this._voice = _val;
        },
        init: function (game) {}
    };

    return {
        touch,
        sound
    };
})();
