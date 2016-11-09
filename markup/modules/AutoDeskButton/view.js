import { model } from 'modules/Model/Model';

export let view = (() => {

    const game = model.el('game');
    console.log(game);

    function drawAutoButton({
        x = 200,
        y = 200,
        container = model.el('buttonsContainer')
    }) {
        const game = model.el('game');
        let autoButton = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
        model.el('autoButton:desktop', autoButton);
        return autoButton;
    }

    function openAutoButton({
        xFinal = model.el('autoButton:desktop').x - 200,
        time = 700
    }) {
        const game = model.el('game');
        let autoButton = model.el('autoButton:desktop');
        return game.add.tween(autoButton).to({x: xFinal}, time, 'Linear', true);
    }

    function closeAutoButton({
        xFinal = model.el('autoButton:desktop').x + 200,
        time = 700
    }) {
        const game = model.el('game');
        let autoButton = model.el('autoButton:desktop');
        return game.add.tween(autoButton).to({x: xFinal}, time, 'Linear', true);
    }

    function showEmptyAutoButton({
        emptyFrame = 'autoEmpty.png'
    }) {
        let autoButton = model.el('autoButton:desktop');
        autoButton.frameName = emptyFrame;
        return autoButton;
    }

    function showNormalAutoButton({
        normalFrame = 'auto.png'
    }) {
        let autoButton = model.el('autoButton:desktop');
        autoButton.frameName = normalFrame;
        return autoButton;
    }

    return {
        drawAutoButton,
        openAutoButton,
        closeAutoButton,
        showEmptyAutoButton,
        showNormalAutoButton
    }
})();
