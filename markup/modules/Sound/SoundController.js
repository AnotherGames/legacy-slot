import { model } from 'modules/Model/Model';

export let controller = (() => {

    const volume = {

          changeVolume: function(value){
              let game = model.el('game');
              game.sound.volume = value / 100;
          },

          switchVolume: function(){
              let game = model.el('game');
              if(game.sound.volume > 0){
                  game.sound.volume = 0;
                  model.state('globalSound', false);
                  model.cookie('globalSound', false);
              } else {
                  game.sound.volume = volume.getVolume();
                  model.state('globalSound', true);
                  model.cookie('globalSound', true);
              }
          },

          getVolume: function(){
            return this.value || 1;
          },

          setVolume: function(value){
            this.value = value / 100;
          }
    };

    const sounds = {

        playSound: function(sound, duration = 0){
            let game = model.el('game');
            if(!model.sound(sound)){
                model.sound(sound, game.add.audio(sound));
            };

            if(!model.state('sound')) return;
            // this will remove multiplier clicking sounds
            // if(!model.sound(sound).isPlaying){
            //     model.sound(sound).play();
            // };
            model.sound(sound).play();

            if(duration > 0){
                setTimeout(() => {
                    model.sound(sound).stop();
                }, duration)
            };
        },

        stopSound: function(sound){
            if(!model.state('sound')) return;
            model.sound(sound).stop();
        },

        changeSoundVolume: function(sound, value){
            model.sound(sound).volume = value / 100;
        }

    };

    const music = {

        playMusic: function(music){
            let game = model.el('game');
            if(!model.sound(music)){
                model.sound(music, game.add.audio(music, 1, true));
            };

            if (!model.state('music')) return;
            let currMusic = model.sound(music);
            if(currMusic.paused){
                currMusic.resume();
            } else {
                if (currMusic.isDecoded){
                    currMusic.play();
                } else {
                    currMusic.onDecoded.add(() => {
                        currMusic.fadeIn(2000, true)
                    });
                }
            }
        },

        stopMusic: function(music){
            model.sound(music).stop();
        },

        pauseMusic: function(music){
            model.sound(music).pause();
        },

        changeMusicVolume: function(music, value){
            model.sound(music).volume = value;
        }
    };

    return {
        sounds,
        music,
        volume
    }

})();
