import { model } from 'modules/Model/Model';
import { motionPath } from 'modules/Util/Motion';

import { view as transitionView } from 'modules/Transition/TransitionView';
import { view as winView } from 'modules/Win/WinView';
import { view as mainView } from 'modules/States/Main/mainView';

import { controller as soundController } from '../../../../Info/SoundController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';

export let controller = (() => {

    function stop() {
        transitionView.fsFinish();
    }

    function changeToMain() {
        let game = model.el('game');
        if (model.mobile) {
            buttonsController.unlockButtons();
        }
        panelController.drawMainPanel();
        soundController.music.stopMusic('fsFon');
        soundController.music.playMusic('fon');

        model.state('fs:end', true);
        model.state('fs', false);
        model.updateBalance({endFS: true});
        model.state('buttons:locked', false);

        game.input.keyboard.enabled = true;

    }

    function next() {
        let rollData = model.data('rollResponse');

        if (!model.state('fs:end')
        && rollData.NextMode !== 'root') {
            controller.count({start: true});
            rollController.startRoll();
        }

        if (rollData.NextMode === 'root') {
            stop();
        }
    }

    function init(amount) {
        if (model.state('fs:end') === false) {
            return;
        }

        model.state('fs:end', false);
        model.data('fs:count', amount);
        model.updateBalance({startFS: true});

        next();
    }

    function count({
        start,
        end
    }) {
        if (start) {
            let newFsCount = model.data('fs:count');
            newFsCount--;
            model.data('fs:count', newFsCount);
            model.el('fs:count').text = newFsCount;
        }
        if (end) {
            model.data('fs:count', model.data('rollResponse').FreeSpinsLeft);
            model.el('fs:count').text = model.data('rollResponse').FreeSpinsLeft;
        }
    }

    return {
        init,
        next,
        count,
        stop,
        changeToMain
    };
})();
