import { mobileSettings } from '../../modules/Menu/MobileSettings';
import { model } from 'modules/Model/Model';
import { controller as mobileSettingsController } from 'modules/MobileSettings/controller';

export let controller = {
    _isEvent: false,
    get isEvent() {
        return this._isEvent;
    },
    set isEvent(val) {
        this._isEvent = val;
    },

    mobile: {
        animationTime: 1000,
        settings: {
            init: function () {
                mobileSettingsController.init();
            },
            open: function () {
                if (this.isEvent) return;
                this.isEvent = true;
                mobileSettingsController.open({
                    time: this.animationTime,
                    callback: () => {
                        this.isEvent = false;
                    }
                });
            },
            close: function () {
                if (this.isEvent) return;
                this.isEvent = true;
                mobileSettingsController.close({
                    time: this.animationTime,
                    callback: () => {
                        this.isEvent = false;
                    }
                });
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
                    settings.game.add.tween(settings.container).to( { x: settings.game.world.width }, this.animationTime, 'Quart.easeOut', true);
                } else {
                    settings.game.add.tween(settings.container).to( { x: -settings.container.width }, this.animationTime, 'Quart.easeOut', true);
                }

                settings.infoRules.alpha = 0;
                settings.infoRules.visible = true;
                settings.game.add.tween(settings.infoRules).to( { alpha: 1 }, this.animationTime, 'Quart.easeOut', true)
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

                settings.game.add.tween(settings.infoRules).to( { alpha: 0 }, this.animationTime, 'Quart.easeOut', true);

                settings.game.add.tween(settings.overlay).to( { alpha: 0 }, this.animationTime, 'Quart.easeOut', true)
                .onComplete.add(() => {
                    model.state('menu', 'close');
                    settings.overlay.visible = false;
                    _this._isEvent = false;
                }, this);
            }
        }
    }
};
