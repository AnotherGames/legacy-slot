import { mobileSettings } from '../../modules/Menu/MobileSettings';
import { model } from 'modules/Model/Model';

export let controller = {
    _isEvent: false,
    get isEvent() {
        return this._isEvent;
    },

    mobile: {
        time: 1000,
        settings: {
            open: function () {
                if (this._isEvent) return;
                let _this = this;

                this._isEvent = true;
                let settings = mobileSettings;

                if (model.state('side') === 'left') {
                    settings.container.x = settings.game.world.width;
                    settings.game.add.tween(settings.container).to( { x: settings.game.world.width - settings.container.width }, this.time, 'Quart.easeOut', true);
                } else {
                    settings.container.x = -settings.container.width;
                    settings.game.add.tween(settings.container).to( { x: 0 }, this.time, 'Quart.easeOut', true);
                }

                settings.overlay.alpha = 0;
                settings.overlay.visible = true;
                settings.game.add.tween(settings.overlay).to( { alpha: 0.5 }, this.time, 'Quart.easeOut', true)
                .onComplete.add(() => {
                    model.state('menu', 'open');
                    _this._isEvent = false;
                }, this);
            },
            close: function () {
                if (this._isEvent) return;
                let _this = this;

                this._isEvent = true;
                let settings = mobileSettings;

                if (model.state('side') === 'left') {
                    settings.game.add.tween(settings.container).to( { x: settings.game.world.width }, this.time, 'Quart.easeOut', true);
                } else {
                    settings.game.add.tween(settings.container).to( { x: -settings.container.width }, this.time, 'Quart.easeOut', true);
                }

                settings.game.add.tween(settings.overlay).to( { alpha: 0 }, this.time, 'Quart.easeOut', true)
                .onComplete.add(() => {
                    model.state('menu', 'close');
                    settings.overlay.visible = false;
                    _this._isEvent = false;
                }, this);
            },
            handleChangeSide() {
                if (this._isEvent) return;
                this.close();
                let settings = mobileSettings;

                const mainContainer = model.el('mainContainer');
                const mask = model.el('mask');
                let xSide;
                if (model.state('side') === 'left') {
                    model.state('side', 'right');
                    settings.handModeButton.frameName = 'handModeOn.png';
                    xSide = model.data('buttonsXLeft');
                    mainContainer.x = model.data('mainXRight');
                    mask.x = model.data('mainXRight') - model.data('mainXLeft');
                } else {
                    model.state('side', 'left');
                    settings.handModeButton.frameName = 'handModeOff.png';
                    xSide = model.data('buttonsXRight');
                    mainContainer.x = model.data('mainXLeft');
                    mask.x = 0;
                }
                // Change Side Buttons
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
            }
        },
        rules: {
            open: function () {
                let _this = this;

                this._isEvent = true;
                let settings = mobileSettings;

                settings.overlay.events.onInputDown.removeAll();
                settings.overlay.events.onInputDown.add(settings._overlaySettingsEvent);
                console.log(settings.overlay.alpha);

                if (model.state('side') === 'left') {
                    settings.game.add.tween(settings.container).to( { x: settings.game.world.width }, this.time, 'Quart.easeOut', true);
                } else {
                    settings.game.add.tween(settings.container).to( { x: -settings.container.width }, this.time, 'Quart.easeOut', true);
                }

                settings.infoRules.alpha = 0;
                settings.infoRules.visible = true;
                settings.game.add.tween(settings.infoRules).to( { alpha: 1 }, this.time, 'Quart.easeOut', true)
                .onComplete.add(() => {
                    _this._isEvent = false;
                }, this);
            },
            close: function () {
                let _this = this;

                this._isEvent = true;
                let settings = mobileSettings;

                settings.overlay.events.onInputDown.removeAll();
                settings.overlay.events.onInputDown.add(settings._overlayRulesEvent);

                settings.game.add.tween(settings.infoRules).to( { alpha: 0 }, this.time, 'Quart.easeOut', true);

                settings.game.add.tween(settings.overlay).to( { alpha: 0 }, this.time, 'Quart.easeOut', true)
                .onComplete.add(() => {
                    model.state('menu', 'close');
                    settings.overlay.visible = false;
                    _this._isEvent = false;
                }, this);
            }
        }
    }
};
