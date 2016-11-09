import { model } from 'modules/Model/Model';
import { view } from 'modules/MobileSettings/View';
import { sound } from 'modules/Sound/Sound';
import { controller as globalController } from 'modules/Controller/Controller';

export let controller = (() => {
    let game;
    let overlay;
    let container;

    let _clickEvent = {
        BackButton: function () {
            sound.sounds.button.play();
            globalController.mobile.settings.close();
        },
        Overlay: function () {
            globalController.mobile.settings.close();
        }
    };

    function init() {
        game = model.el('game');

        overlay = view.drawOverlay({});
        container = view.drawContainer({});
        view.drawBG({});
        view.drawBorder({});
        view.drawTitle({});
        const backButton = view.drawBackButton({});

        backButton.inputEnabled = true;
        backButton.input.priorityID = 12;
        backButton.events.onInputDown.add(_clickEvent.BackButton);

        overlay.inputEnabled = true;
        overlay.input.priorityID = 10;
        overlay.events.onInputDown.add(_clickEvent.Overlay);

        if (model.state('side') === 'left') {
            container.x = game.world.width;
        } else {
            container.x = -container.x;
        }

        model.state('settings', 'close');
    }

    function open({
        time = 700,
        callback = function () {}
    }) {
        if (model.state('side') === 'left') {
            container.x = game.world.width;
            game.add.tween(container).to( { x: game.world.width - container.width }, time, 'Quart.easeOut', true);
        } else {
            container.x = -container.width;
            game.add.tween(container).to( { x: 0 }, time, 'Quart.easeOut', true);
        }

        overlay.alpha = 0;
        overlay.visible = true;
        console.log(overlay);
        game.add.tween(overlay).to( { alpha: 0.5 }, time, 'Quart.easeOut', true)
        .onComplete.add(() => {
            model.state('settings', 'open');
            callback();
        });
    }

    function close({
        time = 700,
        callback = function () {}
    }) {
        if (model.state('side') === 'left') {
            game.add.tween(container).to( { x: game.world.width }, time, 'Quart.easeOut', true);
        } else {
            game.add.tween(container).to( { x: -container.width }, time, 'Quart.easeOut', true);
        }

        game.add.tween(overlay).to( { alpha: 0 }, time, 'Quart.easeOut', true)
        .onComplete.add(() => {
            model.state('settings', 'close');
            overlay.visible = false;
            callback();
        });
    }

    return {
        init,
        open,
        close
    };
})();
