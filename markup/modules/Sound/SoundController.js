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
                  model.state('globalSound', false)
                  localStorage['globalSound'] = false;
              } else {
                  game.sound.volume = volume.getVolume();
                  localStorage['globalSound'] = true;
                  model.state('globalSound', true)
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
            if(!model.el(sound)){
                model.el(sound, game.add.audio(sound));
            };

            if(!model.state('sound')) return;
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
        }

    };

    const music = {

        playMusic: function(music){
            let game = model.el('game');
            if(!model.el(music)){
                model.el(music, game.add.audio(music, 1, true));
            };

            if (!model.state('music')) return;
            if(model.el(music).paused){
                model.el(music).resume();
            } else {
                model.el(music).play();
                // model.el(music).fadeIn(2000)
            }
        },

        stopMusic: function(music){
            model.el(music).stop();
        },

        pauseMusic: function(music){
            model.el(music).pause();
        },

        changeMusicVolume: function(music, value){
            model.el(music).volume = value;
        }
    };

    return {
        sounds,
        music,
        volume
    }

})();
