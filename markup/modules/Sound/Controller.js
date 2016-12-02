import { model } from 'modules/Model/Model';

export let controller = (() => {
    // const init = {
    //     model.el('fon', game.add.audio('fon', 1, true));
    //     model.el('fsFon', game.add.audio('fsFon', 1, true));
    //     model.el('startPerehod', game.add.audio('startPerehod', 1, true));
    //     model.el('finishPerehod', game.add.audio('finishPerehod', 1, true));
    // }
    const sounds = {
        // this.music.startPerehod = game.add.audio('startPerehod', 1, true);
        // this.music.finishPerehod = game.add.audio('finishPerehod', 1, true);
        playSound: function(sound, duration = 0){
            if(!model.state('sound')) return;

            let game = model.el('game');
            if(!model.el(sound)){
                model.el(sound, game.add.audio(sound));
            };

            // this will remove multiplier clicking sounds
            // if(!model.el(sound).isPlaying){
            //     model.el(sound).play();
            // };
            model.el(sound).play();

            if(duration > 0){
                setTimeout(() => {
                    model.el(sound).stop();
                }, duration)
            };
        },

        stopSound: function(sound){
            if(!model.state('sound')) return;

            model.el(sound).stop();
        },

        changeVolume: function(value){
            let game = model.el('game');
            game.sound.volume = value / 100;
        },

        switchVolume: function(){
            let game = model.el('game');
            if(game.sound.volume > 0){
                game.sound.volume = 0;
                model.state('globalSound', false)
            } else {
                game.sound.volume = $('#volume').val();
                model.state('globalSound', true)
            }
        }
    };

    const music = {

        playMusic: function(music){
            let game = model.el('game');
            if(!model.el(music)){
                model.el(music, game.add.audio(music, 1, true));
            };

            if(model.el(music).paused){
                model.el(music).resume();
            } else {
                model.el(music).play();
            }
        },

        stopMusic: function(music){
            model.el(music).pause();
        },

        changeMusicVolume: function(music, value){
            console.log(music);
            model.el(music).volume = value;
        }
    };

    return {
        sounds,
        music
    }

})();
//
// export let controller = {
//     sounds: {},
//     music: {},
//
//     _lastVolume: 100,
//     get lastVolume() {
//         return this._lastVolume;
//     },
//     set lastVolume(val) {
//         if (val == 0) {
//             this._lastVolume = 1;
//         } else {
//             this._lastVolume = val;
//         }
//     },
//
//     get volume() {
//         return model.state('volume');
//     },
//     /* val: Number (0 - 100) */
//     set volume(val) {
//         let _val = +val / 100;
//         if (_val < 0) _val = 0;
//         if (_val > 1) _val = 1;
//         if (_val === this.volume) return;
//
//         model.state('volume', _val);
//
//         this.game.sound.volume = _val;
//     },
//
//     // get isMusic() {
//     //     return model.state('music');
//     // },
//     // set isMusic(val) {
//     //     if (typeof (val) !== 'boolean') {
//     //         console.error('set isMusic: Input parameter is not boolean.', val);
//     //         return;
//     //     }
//     //     if (val === this.isMusic) return;
//     //
//     //     model.state('music', val);
//     //
//     //     let keys = Object.keys(this.music);
//     //     keys.forEach((key) => {
//     //         this.music[key].mute = !val;
//     //     });
//     // },
//
//     init: function ({
//         volume = 1,
//         sound = true,
//         music = true
//     }) {
//         // model.data('soundModule', sound);
//
//         // if (this.game) {
//         //     let keys = Object.keys(this.sounds);
//         //     keys.forEach((key) => {
//         //         this.sounds[key].stop();
//         //     });
//         //     keys = Object.keys(this.music);
//         //     keys.forEach((key) => {
//         //         this.music[key].stop();
//         //     });
//         // }
//
//         const game = model.el('game');
//         this.game = game;
//         // Background Music
//         // this.music.fon = game.add.audio('fon', 1, true);
//         // this.music.fsFon = game.add.audio('fsFon', 1, true);
//         this.music.startPerehod = game.add.audio('startPerehod', 1, true);
//         this.music.finishPerehod = game.add.audio('finishPerehod', 1, true);
//         // model.el('fon', game.add.audio('fon', 1, true));
//         // model.el('fsFon', game.add.audio('fsFon', 1, true));
//         // model.el('startPerehod', game.add.audio('startPerehod', 1, true));
//         // model.el('finishPerehod', game.add.audio('finishPerehod', 1, true));
//         // //Sound
//         // model.el('buttonClick', game.add.audio('buttonClick'))
//         // model.el('baraban', game.add.audio('baraban'))
//         // model.el('lineWin', game.add.audio('lineWin'))
//         // model.el('lineWin2', game.add.audio('lineWin2'))
//         // model.el('mozgi1', game.add.audio('mozgi1'))
//         // model.el('mozgi2', game.add.audio('mozgi2'))
//         // model.el('zombie1', game.add.audio('zombie1'))
//         // model.el('zombie2', game.add.audio('zombie2'))
//
//         this.sounds.play = this.play;
//         this.sounds.stop = this.stop;
//         this.music.play = this.playMusic;
//         this.music.stop = this.playMusic;
//
//         // let keys = Object.keys(this.sounds);
//         // keys.forEach((key) => {
//         //     this.sounds[key].mute = !sound;
//         // });
//         // let keys = Object.keys(this.music);
//         // keys.forEach((key) => {
//         //     this.music[key].mute = !music;
//         //     this.music[key].volume = 0.6;
//         // });
//
//         this.volume = volume * 100;
//
//         model.state('volume', volume);
//         model.state('sound', sound);
//         model.state('music', music);
//     },
//
//     playMusic: function(music){
//         if(!model.state('music')) return;
//
//         let game = model.el('game');
//         if(!model.el(music)){
//             model.el(music, game.add.audio(music, 1, true));
//         };
//
//         model.el(music).play();
//     },
//
//     stopMusic: function(music){
//         model.el(music).stop();
//     },
//
//     play: function(sound, duration = 0){
//         if(!model.state('sound')) return;
//
//         let game = model.el('game');
//         if(!model.el(sound)){
//             model.el(sound, game.add.audio(sound));
//         };
//
//         // this will remove multiplier clicking sounds
//         // if(!model.el(sound).isPlaying){
//         //     model.el(sound).play();
//         // };
//         model.el(sound).play();
//
//         if(duration > 0){
//             setTimeout(() => {
//                 model.el(sound).stop();
//             }, duration)
//         };
//     },
//
//     stop: function(sound){
//         if(!model.state('sound')) return;
//
//         let gameSound = model.el(sound);
//
//         gameSound.stop()
//     }
//
// };
