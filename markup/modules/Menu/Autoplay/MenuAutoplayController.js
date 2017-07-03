import { model } from 'modules/Model/Model';
import { view } from 'modules/Menu/Autoplay/MenuAutoplayView';

import { controller as soundController } from '../../../../Info/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';

export let controller = (() => {
    let autoplayButtons = [];

    let handle = {
        openPanel: function () {
            if (model.state('autoplayPanel') === 'open'
            || model.state('roll:progress')) {
                return;
            }

            model.state('autoplayPanel', 'open');

            view.show.Panel({})
                .onComplete.add(enableInput);
            view.show.Overlay({});
        },
        closePanel: function () {
            if (model.state('autoplayPanel') === 'close') {
                return;
            }

            soundController.sound.playSound({sound: 'buttonClick'});
            if (model.state('autoplayPanel') === 'open') {
	            disableInput();
                view.hide.Panel({});
            }

            view.hide.Overlay({});
            model.state('autoplayPanel', 'close');
        },
        initAuto: function (amount) {
            if (model.state('autoplayPanel') === 'close') {
                return;
            }

            handle.closePanel();
            autoplayController.start(amount);
        }
    };

    function init() {

        let overlay = view.draw.Overlay({});
        overlay.inputEnabled = true;
        overlay.input.priorityID = 10;
        overlay.events.onInputDown.add(handle.closePanel);

        view.draw.Container({});

        let bg = view.draw.BG({});
        bg.inputEnabled = true;
        bg.input.priorityID = 11;

        view.draw.Border({});
        view.draw.Title({});

        let button10 = view.draw.Button({
            container: model.el('autoplayContainer'),
            heightPercentage: 0.2,
            text: '10',
            side: 'left'});
        button10.inputEnabled = true;
        button10.input.priorityID = 12;
        button10.events.onInputDown.add(handle.initAuto.bind(null, 10));
        autoplayButtons.push(button10);

        let button25 = view.draw.Button({
            container: model.el('autoplayContainer'),
            heightPercentage: 0.2,
            text: '25',
            side: 'right'});
        button25.inputEnabled = true;
        button25.input.priorityID = 12;
        button25.events.onInputDown.add(handle.initAuto.bind(null, 25));
	    autoplayButtons.push(button25);

        let button50 = view.draw.Button({
            container: model.el('autoplayContainer'),
            heightPercentage: 0.45,
            text: '50',
            side: 'left'});
        button50.inputEnabled = true;
        button50.input.priorityID = 12;
        button50.events.onInputDown.add(handle.initAuto.bind(null, 50));
	    autoplayButtons.push(button50);

        let button100 = view.draw.Button({
            container: model.el('autoplayContainer'),
            heightPercentage: 0.45,
            text: '100',
            side: 'right'});
        button100.inputEnabled = true;
        button100.input.priorityID = 12;
        button100.events.onInputDown.add(handle.initAuto.bind(null, 100));
	    autoplayButtons.push(button100);

        let button250 = view.draw.Button({
            container: model.el('autoplayContainer'),
            heightPercentage: 0.70,
            text: '250',
            side: 'left'});
        button250.inputEnabled = true;
        button250.input.priorityID = 12;
        button250.events.onInputDown.add(handle.initAuto.bind(null, 250));
	    autoplayButtons.push(button250);

        let button500 = view.draw.Button({
            container: model.el('autoplayContainer'),
            heightPercentage: 0.70,
            text: '500',
            side: 'right'});
        button500.inputEnabled = true;
        button500.input.priorityID = 12;
        button500.events.onInputDown.add(handle.initAuto.bind(null, 500));
	    autoplayButtons.push(button500);

        let backButton = view.draw.BackButton({});
        backButton.inputEnabled = true;
        backButton.input.priorityID = 12;
        backButton.events.onInputDown.add(handle.closePanel);
	    autoplayButtons.push(backButton);

	    disableInput();

	    model.el('autoplayButtons', autoplayButtons);
        model.state('autoplayPanel', 'close');
    }

	function disableInput() {
		autoplayButtons.forEach((el) => {
			el.input.enabled = false;
		})
	}

	function enableInput () {
		autoplayButtons.forEach((el) => {
			el.input.enabled = true;
		})
	}

    return {
        init,
        handle
    };
})();
