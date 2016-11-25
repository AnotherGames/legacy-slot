import { model } from 'modules/Model/Model';

export let popup = {
    showPopup: function ({
        message = 'popup',
        container = model.group('popup'),
        font = 'normal 54px Arial',
        color = '#e8b075',
        onClick = true
    }) {
        console.log('i am showing popup');
        const game = model.el('game');
        const overlay = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
        container.add(overlay);
        const popup = game.add.sprite(game.width / 2, game.height / 2, 'popup', null, container);
        popup.anchor.set(0.5);
        model.el('popup', popup);
        const popupText = game.add.text(game.width / 2, game.height / 2, message, {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: popup.width - 80}, container);
        popupText.anchor.set(0.5);
        overlay.inputEnabled = true;
        popup.inputEnabled = true;
        if (onClick) {
            overlay.input.priorityID = 2;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart'
                || message === 'The connection failed. Please click to restart') {
                    window.location.reload();
                }
            });
            overlay.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart'
                || message === 'The connection failed. Please click to restart') {
                    window.location.reload();
                }
            });
        }

        container.delete = function() {container.removeAll()};
        return container;
    }
};
