import { sound } from '../../modules/Sound/Sound';
import { events } from 'modules/Events/Events';
import { model } from 'modules/Model/Model';
import { controller } from 'modules/Controller/Controller';

export let mobileSettings = {
    game: null,
    container: null,
    infoRules: null,
    overlay: null,
    _deltaX: null,
    _deltaY: 20,

    _drawBackground: function (game) {
        const menuBG = game.add.graphics(0, 0, this.container);
        menuBG.beginFill(0x000000).drawRect(0, 0, game.world.width * 0.22, game.world.height);
        menuBG.inputEnabled = true;
        menuBG.input.priorityID = 1;

        const menuBorder = game.add.graphics(0, 0, this.container);
        menuBorder.beginFill(0xffffff, 0.3).drawRect(0, 0, game.world.width * 0.002, game.world.height);
    },
    _drawTitle: function (game) {
        const settingsTitle = game.add.text(
            this.container.width / 2,
            game.world.height * 0.07,
            'SETTINGS',
            {font: 'bold 40px Arial', fill: '#fff', align: 'center'},
            this.container);
        settingsTitle.anchor.set(0.5);
    },
    _drawSoundButton: function (game) {
        this.soundButton = game.add.sprite(
            0,
            game.world.height * 0.2,
            'menuButtons',
            null,
            this.container);
        if (!sound.isSound) {
            this.soundButton.frameName = 'soundOff.png';
        } else {
            this.soundButton.frameName = 'soundOn.png';
        }
        this.soundButton.anchor.set(0.5);

        this._deltaX = (this.container.width - this.soundButton.width * 2.5) / 3;
        this.soundButton.x = this._deltaX + this.soundButton.width / 2;

        this.soundButton.inputEnabled = true;
        this.soundButton.input.priorityID = 2;
        let _this = this;
        this.soundButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            let menuButtonSound = model.el('soundButton');

            events.trigger('buttons:changeSoundButton');
            if (sound.isSound) {
                _this.soundButton.frameName = 'soundOff.png';
                sound.isSound = false;
                if (!sound.isMusic) {
                    menuButtonSound.frameName = 'soundOut.png';
                }
            } else {
                _this.soundButton.frameName = 'soundOn.png';
                sound.isSound = true;
                menuButtonSound.frameName = 'sound.png';
                sound.sounds.button.play();
            }
        });

        const soundText = game.add.sprite(
            this.soundButton.x,
            this.soundButton.y + this.soundButton.height / 2 + this._deltaY,
            'menuButtons',
            'soundText.png',
            this.container);
        soundText.anchor.set(0.5);

        model.el('settingsButtonSound', this.soundButton);
    },
    _drawMusicButton: function (game) {
        this.musicButton = game.add.sprite(
            2 * this._deltaX + 1.5 * this.soundButton.width,
            game.world.height * 0.2,
            'menuButtons',
            null,
            this.container);
        if (!sound.isMusic) {
            this.musicButton.frameName = 'musicOff.png';
        } else {
            this.musicButton.frameName = 'musicOn.png';
        }
        this.musicButton.anchor.set(0.5);

        this.musicButton.inputEnabled = true;
        this.musicButton.input.priorityID = 2;
        let _this = this;
        this.musicButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            let menuButtonSound = model.el('soundButton');

            sound.sounds.button.play();
            if (sound.isMusic) {
                _this.musicButton.frameName = 'musicOff.png';
                sound.isMusic = false;
                if (!sound.isMusic) {
                    menuButtonSound.frameName = 'soundOut.png';
                }
            } else {
                _this.musicButton.frameName = 'musicOn.png';
                sound.isMusic = true;
                menuButtonSound.frameName = 'sound.png';
            }
        });

        const musicText = game.add.sprite(
            this.musicButton.x,
            this.musicButton.y + this.musicButton.height / 2 + this._deltaY,
            'menuButtons',
            'musicText.png',
            this.container);
        musicText.anchor.set(0.5);

        model.el('settingsButtonMusic', this.musicButton);
    },
    _drawFastSpinButton: function (game) {
        const fastSpinButton = game.add.sprite(
            this.soundButton.x,
            game.world.height * 0.45,
            'menuButtons',
            null,
            this.container);
        if (model.state('fastRoll') === false) {
            fastSpinButton.frameName = 'fastSpinOff.png';
        } else {
            fastSpinButton.frameName = 'fastSpinOn.png';
        }
        fastSpinButton.anchor.set(0.5);

        fastSpinButton.inputEnabled = true;
        fastSpinButton.input.priorityID = 2;
        fastSpinButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            sound.sounds.button.play();
            if (model.state('fastRoll') === true) {
                model.state('fastRoll', false);
                fastSpinButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                fastSpinButton.frameName = 'fastSpinOn.png';
            }
        });

        const fastSpinText = game.add.sprite(
            fastSpinButton.x,
            fastSpinButton.y + fastSpinButton.height / 2 + this._deltaY,
            'menuButtons',
            'fastSpinText.png',
            this.container);
        fastSpinText.anchor.set(0.5);
    },
    _drawHandModeButton: function (game) {
        this.handModeButton = game.add.sprite(
            this.musicButton.x,
            game.world.height * 0.45,
            'menuButtons',
            null,
            this.container);
        if (model.state('side') === 'left') {
            this.handModeButton.frameName = 'handModeOff.png';
        } else {
            this.handModeButton.frameName = 'handModeOn.png';
        }
        this.handModeButton.anchor.set(0.5);

        this.handModeButton.inputEnabled = true;
        this.handModeButton.input.priorityID = 2;
        let _this = this;
        this.handModeButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            sound.sounds.button.play();
            controller.mobile.settings.handleChangeSide();
        });

        const handModeText = game.add.sprite(
            this.handModeButton.x,
            this.handModeButton.y + this.handModeButton.height / 2 + this._deltaY,
            'menuButtons',
            'handModeText.png',
            this.container);
        handModeText.anchor.set(0.5);
    },
    _drawRulesButton: function (game) {
        const rulesButton = game.add.sprite(
            this.soundButton.x,
            game.world.height * 0.7,
            'menuButtons',
            'infoOn.png',
            this.container);
        rulesButton.anchor.set(0.5);

        rulesButton.inputEnabled = true;
        rulesButton.input.priorityID = 2;
        rulesButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            sound.sounds.button.play();
            controller.mobile.rules.open();
        });

        const rulesText = game.add.sprite(
            rulesButton.x,
            rulesButton.y + rulesButton.height / 2 + this._deltaY,
            'menuButtons',
            'infoText.png',
            this.container);
        rulesText.anchor.set(0.5);
    },
    _drawHistoryButton: function (game) {
        const historyButton = game.add.sprite(
            this.musicButton.x,
            game.world.height * 0.7,
            'menuButtons',
            'historyOn.png',
            this.container);
        historyButton.anchor.set(0.5);

        historyButton.inputEnabled = true;
        historyButton.input.priorityID = 2;
        historyButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            sound.sounds.button.play();
            $('.history').removeClass('closed');
        });

        const historyText = game.add.sprite(
            historyButton.x,
            historyButton.y + historyButton.height / 2 + this._deltaY,
            'menuButtons',
            'historyText.png',
            this.container);
        historyText.anchor.set(0.5);
    },
    _drawBackButton: function (game) {
        const backButton = game.add.sprite(this.container.width / 2, game.world.height * 0.9, 'mobileButtons', 'return.png', this.container);
        backButton.anchor.set(0.5);
        backButton.inputEnabled = true;
        backButton.input.priorityID = 2;
        backButton.events.onInputDown.add(function () {
            if (controller.isEvent) return;
            sound.sounds.button.play();
            controller.mobile.settings.close();
        });
    },
    _overlaySettingsEvent: function () {
        controller.mobile.settings.close();
    },
    _overlayRulesEvent: function () {
        controller.mobile.rules.close();
    },
    _drawOverlay: function (game) {
        this.overlay = game.add.graphics(0, 0, model.el('buttonsContainer')).beginFill(0x000000, 0.5).drawRect(0, 0, game.world.width, game.world.height);
        this.overlay.visible = false;
        let tween = game.add.tween(this.overlay).to( { alpha: 1 }, 1000, 'Quart.easeOut');
        tween.start();
        this.overlay.inputEnabled = true;
        this.overlay.input.priorityID = 0;
    },
    _drawRulesScreen: function (game) {
        this.infoRules = game.add.sprite(game.world.centerX, game.world.centerY, 'infoRules');
        this.infoRules.anchor.set(0.5);
        this.infoRules.visible = false;
        this.infoRules.inputEnabled = true;
        this.infoRules.events.onInputDown.add(function () {
            controller.mobile.rules.close();
        });
    },

    draw: function (game) {
        console.log('draw mobie settings');
        this.game = game;
        this.container = game.add.group();

        this._drawBackground(game);
        this._drawTitle(game);
        this._drawSoundButton(game);
        this._drawMusicButton(game);
        this._drawFastSpinButton(game);
        this._drawHandModeButton(game);
        this._drawRulesButton(game);
        this._drawHistoryButton(game);
        this._drawBackButton(game);
        this._drawOverlay(game);
        this._drawRulesScreen(game);

        if (model.state('side') === 'left') {
            this.container.x = game.world.width;
        } else {
            this.container.x = -this.container.x;
        }
    }
};
