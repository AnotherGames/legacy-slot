import { model } from 'modules/Model/Model';
import { controller as panelController} from 'modules/Panel/PanelController';
import { view as transitionView} from 'modules/Transition/TransitionView';

export let controller = (() => {

    function initMainKeys() {
        let game = model.el('game');

        let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onUp.add(() => {
            if ( model.state('transitionScreen') ) {
                transitionView.transitionInFs();
            } else {
                panelController.handle.spin();
            }
        });

        let up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onUp.add(() => {
            if ( !model.state('transitionScreen') ) {
                model.changeCoin({up: true});
            }
        });

        let down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onUp.add(() => {
            if ( !model.state('transitionScreen') ) {
                model.changeCoin({down: true});
            }
        });

        let right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onUp.add(() => {
            if ( !model.state('transitionScreen') ) {
                model.changeBet({up: true});
            }
        });

        let left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onUp.add(() => {
            if ( !model.state('transitionScreen') ) {
                model.changeBet({down: true});
            }
        });

    }

    function initFsKeys() {
      let game = model.el('game');
        let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onUp.add(transitionView.transitionOutFs);
    }

    function initInitKeys() {
      let game = model.el('game');
        let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onUp.add(()=>{
          game.camera.onFadeComplete.add(()=>{
              game.state.start('Main');
          })

          game.camera.fade(0x000000, 500)
        });
    }

    return {
        initMainKeys,
        initFsKeys,
        initInitKeys
    }

})();
