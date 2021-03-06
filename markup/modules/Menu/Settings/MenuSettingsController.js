import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import Info from '../../../../Info/Info';

import { view } from 'modules/Menu/Settings/MenuSettingsView';
import { view as mainView } from 'modules/States/Main/MainView';

import { controller as soundController } from '../../../../Info/SoundController';

export let controller = (() => {

    let game;
    let info;
    let touchX = 0;
    let settingsButtons = [];

    let handle = {
        openSettings: function () {
            if(model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')
            || model.state('settings') === 'open') return;

            model.state('settings', 'open');
            view.show.Settings({})
	            .onComplete.add(enableInput);
            view.show.Overlay({});
        },
        closeSettings: function () {
            if (model.state('settings') === 'close') return;

            soundController.sound.playSound({sound : 'buttonClick'});
            if (model.state('settings') === 'rules') {
                view.hide.Rules({});
            }
            if (model.state('settings') === 'open') {
	            disableInput();
                view.hide.Settings({});
            }

            view.hide.Overlay({});
            model.state('settings', 'close');
        },
        handMode: function () {
            if (model.state('settings') === 'close') return;

            model.state('settings', 'close');
            const time = 700;

	        disableInput();
            view.hide.Settings({});
            view.hide.Overlay({});

            const mainContainer = model.group('main');
            let dragon =  model.group('dragon');
            let delta = model.data('mainXRight') - model.data('mainXLeft')
            let xSide;

            if (model.state('gameSideLeft')) {
                model.state('gameSideLeft', false);
                model.cookie('gameSideLeft', false);
                model.el('settingsHandModeButton').frameName = 'handModeOn.png';

                xSide = model.data('buttonsXLeft');
                game.add.tween(mainContainer).to( { x: model.data('mainXRight') }, time, 'Quart.easeOut', true);
                game.add.tween(dragon).to( { x: dragon.x + delta }, time, 'Quart.easeOut', true);
            } else {
                model.state('gameSideLeft', true);
                model.cookie('gameSideLeft', true);
                model.el('settingsHandModeButton').frameName = 'handModeOff.png';

                xSide = model.data('buttonsXRight');
                game.add.tween(mainContainer).to( { x: model.data('mainXLeft') }, time, 'Quart.easeOut', true);
                game.add.tween(dragon).to( { x: dragon.x - delta }, time, 'Quart.easeOut', true);
            }
            handle.changeSideButtons(xSide);

        },

        changeSideButtons: function(xSide) {
            let spinButton = model.el('spinButton');
            let autoButton = model.el('autoButton');
            let betButton = model.el('betButton');
            let menuButton = model.el('menuButton');
            let soundButton = model.el('soundButton');

            spinButton.x = xSide;
            autoButton.x = xSide;
            betButton.x = xSide;
            menuButton.x = xSide;
            soundButton.x = xSide;
        },

        changeSound: function () {
            let soundButton = model.el('settingsSoundButton');

            if (model.state('sound')) {
                soundButton.frameName = 'soundOff.png';
                model.state('sound', false)
                model.cookie('sound', false);
            } else {
                soundButton.frameName = 'soundOn.png';
                model.state('sound', true)
                model.cookie('sound', true);
            }

        },
        changeMusic: function () {
            let musicButton = model.el('settingsMusicButton');

            soundController.sound.playSound({sound : 'buttonClick'});
            if (model.state('music')) {
                musicButton.frameName = 'musicOff.png';
                model.state('music', false);
                model.cookie('music', false);
                soundController.music.pauseMusic('fon')
            } else {
                musicButton.frameName = 'musicOn.png';
                model.state('music', true);
                model.cookie('music', true);
                soundController.music.playMusic('fon')
            }
        },
        changeFastSpin: function () {
            let fastSpinButton = model.el('settingsFastSpinButton');
            soundController.sound.playSound({sound : 'buttonClick'});
            if (model.state('fastRoll') === true) {
                model.state('fastRoll', false);
                model.cookie('fastRoll', false);
                fastSpinButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                model.cookie('fastRoll', true);
                fastSpinButton.frameName = 'fastSpinOn.png';
            }
        },
        showHistory: function () {
            soundController.sound.playSound({sound : 'buttonClick'});
        },
        openRules: function () {
            if (model.state('settings') === 'rules') return;

            model.state('settings', 'rules');
	        disableInput();
            view.hide.Settings({});
            view.hide.Overlay({});
            info.open();
        }
    };

    function init() {
        game = model.el('game');

        let overlay = view.draw.Overlay({});
            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(handle.closeSettings);

        view.draw.Container({});

        let bg = view.draw.BG({});
            bg.inputEnabled = true;
            bg.input.priorityID = 11;

        view.draw.Border({});
        view.draw.Title({});

        // let infoContainer = game.add.group();
        // model.group('info', infoContainer);

        info = new Info({
            model,
            mobileBGScale: 0.7,
            mobileTableScale: 0.85,
            mobileCloseButtonMargin: 5
        });

        let soundButton = view.draw.SoundButton({});
	    soundButton.inputEnabled = true;
        soundButton.input.priorityID = 12;
        soundButton.events.onInputDown.add(handle.changeSound);
        view.draw.SoundButtonText({});
	    settingsButtons.push(soundButton);

        let musicButton = view.draw.MusicButton({});
	    musicButton.inputEnabled = true;
        musicButton.input.priorityID = 12;
        musicButton.events.onInputDown.add(handle.changeMusic);
        view.draw.MusicButtonText({});
	    settingsButtons.push(musicButton);

        let fastSpinButton = view.draw.FastSpinButton({});
	    fastSpinButton.inputEnabled = true;
        fastSpinButton.input.priorityID = 12;
        fastSpinButton.events.onInputDown.add(handle.changeFastSpin);
        view.draw.FastSpinButtonText({});
	    settingsButtons.push(fastSpinButton);

        let handModeButton = view.draw.HandModeButton({});
	    handModeButton.inputEnabled = true;
        handModeButton.input.priorityID = 12;
        handModeButton.events.onInputDown.add(handle.handMode);
        view.draw.HandModeButtonText({});
	    settingsButtons.push(handModeButton);

        let rulesButton = view.draw.RulesButton({});
	    rulesButton.inputEnabled = true;
        rulesButton.input.priorityID = 12;
        rulesButton.events.onInputDown.add(handle.openRules);
        view.draw.RulesButtonText({});
	    settingsButtons.push(rulesButton);

        let historyButton = view.draw.HistoryButton({});
	    historyButton.inputEnabled = true;
        historyButton.input.priorityID = 12;
        historyButton.events.onInputDown.add(handle.showHistory);
        view.draw.HistoryButtonText({});
	    settingsButtons.push(historyButton);

        let backButton = view.draw.BackButton({});
	    backButton.inputEnabled = true;
        backButton.input.priorityID = 12;
        backButton.events.onInputDown.add(handle.closeSettings);
	    settingsButtons.push(backButton);

        disableInput();
	    model.el('menuButtons', settingsButtons);

        model.state('settings', 'close');
    }

    function disableInput() {
        settingsButtons.forEach((el) => {
            el.input.enabled = false;
        })
    }

	function enableInput () {
		settingsButtons.forEach((el) => {
			el.input.enabled = true;
		})
    }

    return {
        init,
        handle
    };
})();
