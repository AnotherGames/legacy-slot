import { model } from 'modules/Model/Model';

export let popup = {
    showPopup: function ({
        game = model.el('game'),
        container = model.group('popup'),
        message = 'popup',
        font = 'normal 54px Arial',
        color = '#e8b075',
        onClick = true
    }) {

        let overlay = game.add.graphics(0, 0, container).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
        let popup = game.add.sprite(game.width / 2, game.height / 2, 'popup', null, container);
            popup.anchor.set(0.5);
            popup.inputEnabled = true;
            popup.input.priorityID = 3;
        model.el('popup', popup);
        let popupText = game.add.text(game.width / 2, game.height / 2, message, {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: popup.width - 80}, container);
            popupText.anchor.set(0.5);
        if (onClick) {
            popup.events.onInputDown.add(() => {
                container.removeAll();
                if(message === 'Your session is closed. Please click to restart'
                || message === 'The connection failed. Please click to restart') {
                    window.location.reload();
                }
            });
            overlay.events.onInputDown.add(() => {
                container.removeAll();
                if(message === 'Your session is closed. Please click to restart'
                || message === 'The connection failed. Please click to restart') {
                    window.location.reload();
                }
            });
        }

        container.delete = function() {container.removeAll()};
        return container;
    }
};
