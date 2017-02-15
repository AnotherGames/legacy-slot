import { model } from 'modules/Model/Model';

export let controller = (() => {

    const volume = {

        changeVolume: function ( value ) {
            let game = model.el('game');
            game.sound.volume = value / 100;
        },

        switchVolume: function () {
            let game = model.el('game');
            if (game.sound.volume > 0) {
                game.sound.volume = 0;
                model.state('globalSound', false);
                model.cookie('globalSound', false);
            } else {
                game.sound.volume = volume.getVolume();
                model.state('globalSound', true);
                model.cookie('globalSound', true);
            }
        },

        getVolume: function () {
            return this.value || 1;
        },

        setVolume: function ( value ) {
            this.value = value / 100;
        }
    };

    const sound = {

        playSound: function ({
            currentSound,
            duration = 0,
            fade = 0,
            soundVolume = 1,
            // loop добавлен на будущее
            // loop = false
        }) {
            let game = model.el('game');
            if (!model.sound(currentSound)) {
                model.sound(currentSound, game.add.audio(currentSound, soundVolume, false));
            }

            if (!model.state('sound')) return;
            // this will remove multiplier clicking sounds
            // if(!model.sound(currentSound).isPlaying){
            //     model.sound(currentSound).play();
            // };
            if (fade > 0) {
                model.sound(currentSound).fadeIn(fade);
            } else {
                model.sound(currentSound).play();
            }

            if (duration > 0) {
                setTimeout(() => {
                    model.sound(currentSound).stop();
                }, duration);
            }
        },

        stopSound: function ( currentSound ) {
            if (!model.state('sound') || typeof model.sound(currentSound) == 'undefined') return;
            model.sound(currentSound).stop();
        },

        changeSoundVolume: function ( currentSound, value ) {
            model.sound(currentSound).volume = value / 100;
        }

    };

    const music = {

        playMusic: function ( currentMusic ) {
            let game = model.el('game');
            if (!model.sound(currentMusic)) {
                model.sound(currentMusic, game.add.audio(currentMusic, 1, true));
            }

            if (!model.state('music')) return;
            let currMusic = model.sound(currentMusic);
            // if(currMusic.paused){
            if (currMusic.mute) {
                model.sound(currentMusic).mute = false;
                // currMusic.restart();
            } else {
                if (currMusic.isDecoded) {
                    currMusic.fadeIn(3000, true);
                } else {
                    currMusic.onDecoded.add(() => {
                        currMusic.fadeIn(3000, true);
                    });
                }
            }
        },

        stopMusic: function ( currentMusic ) {
            if (!model.state('music') || typeof model.sound(currentMusic) == 'undefined') return;
            model.sound(currentMusic).fadeOut(2000);
        },

        pauseMusic: function ( currentMusic ) {
            // model.sound(currentMusic).pause();
            model.sound(currentMusic).mute = true;
        },

        changeMusicVolume: function ( currentMusic, value ) {
            model.sound(currentMusic).volume = value;
        }
    };

    return {
        sound,
        music,
        volume
    };

})();
