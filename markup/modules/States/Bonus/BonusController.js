import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { config } from 'modules/Util/Config';

import Footer from '../../../../Info/Footer';

import { view as balanceView } from 'modules/Balance/BalanceView';
import { view as bonusView } from 'modules/States/Bonus/BonusView';
import { view as mainView } from 'modules/States/Main/MainView';
import { controller as soundController } from '../../../../Info/SoundController';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/MenuSetBetController';

class Door {
    constructor(x, y, arr, index) {
        this.game = model.el('game');

        this.x = (model.desktop) ? x : x * 2 / 3;
        this.y = (model.desktop) ? y : y * 2 / 3;
        this.doors = arr;
        this.deltaTime = 100 * index;

        this.destroyed = false;
        this.isWinPlayed = false;

        this.sprite = this.game.add.sprite(this.x, this.y, 'doors', `${index}.png`);
        this.sprite.anchor.set(0.5);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(handleDoorClick, this);
        this.sprite.events.onInputOver.add(handleDoorHover, this);
        this.sprite.alpha = 0.01;
        model.group('bg').add(this.sprite);

    }

    showHover() {
        if (this.destroyed == true) return;
        let number = parseInt(this.sprite.frameName, 10);
        bonusView.draw.changeAnim({number: number, anim: 'target'});

        if (model.el('targetTimer')) {
            let targetTimer = model.el('targetTimer');
            this.game.time.events.remove(targetTimer);
        }

        let newTimer = this.game.time.events.add(4000, () => {
            bonusView.draw.targetAnim({});
        });
        model.el('targetTimer', newTimer);
    }

    win(sprite) {

        this.destroyed = true;

        let rnd = this.game.rnd.integerInRange(1, 3);
        // soundController.sound.playSound({ sound: `illumBreak${rnd}` });
        // soundController.sound.playSound({ sound: 'sea', duration: 500 });

        let number = parseInt(sprite.frameName, 10);
        bonusView.draw.showWinAnim({number: number});

        let numberMulti = parseInt(this.data.CurrentValue, 10);
        this.multi = this.game.add.sprite(this.x, this.y, 'multi', `x${numberMulti}.png`, model.group('bg'));
        this.multi.anchor.set(0.6, 0.8);
        this.multi.anchor.set(0.5);
        this.multi.alpha = 0;
        this.multi.scale.set(0.1);

        this.game.add.tween(this.multi).to({alpha: 1}, 500, 'Linear', true);
        this.game.add.tween(this.multi.scale).to({x: 2.0, y: 2.0}, 700, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                this.game.add.tween(this.multi.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true)
            });
    }

    fail(sprite) {
        this.destroyed = true;
        let number = parseInt(sprite.frameName, 10);
        bonusView.draw.changeAnim({number: number, anim: 'open'});
        bonusView.draw.showFailBubbles({x: this.x, y: this.y, number: number});
        soundController.sound.playSound({ sound: 'bubbleFail', soundVolume: 3 });
    }

}

export class Bonus {

    init() {
        this.game = model.el('game');
        this.game.winAnims = [];
        this.doors = [];

        this.game.frameAnims = [];
        this.game.spriteAnims = [];

        model.data('bonusWinCoins', 0);
        model.state('bonus', true);
        model.state('bonusReady', true);

        bonusView.create.groups({});

    }

    create() {
        let footer = new Footer({model, soundController, request});
        model.el('footer', footer);
        soundController.music.stopMusic('startPerehod');
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('bonusFon');

        bonusView.draw.mainBG({});
        bonusView.draw.doorsElements({});

        for (let i = 0; i < 5; i++) {
            this.doors.push(new Door(config.illuminatorsCoords[i].x, config.illuminatorsCoords[i].y, this.doors, i + 1));
        }

        model.el('doors', this.doors);

        if (model.desktop) {
            mainView.draw.addBubbles({container: model.group('bg'), x: this.game.world.centerX});
            // mainView.draw.addFishes({ y1: 650, y2: 900 });
            bonusView.draw.addLight({});
            bonusView.draw.upperBG({});
            footer.initFsDesktop();
            footer.addTopFooter();
            balanceView.draw.FSMobileBalance({});
        } else {
            footer.initMobile();
            mobileSetBetController.init({});
            balanceView.draw.FSMobileBalance({});
        }
        balanceView.draw.CashBalance({});
        model.updateBalance({ startBonus: true });

        if (model.data('savedFS')) {
            this.drawRecoveredPanel();
        }

    }

    update() {
        let game = model.el('game');

        model.el('footer').update();
        game.winAnims.forEach((anim) => {
            anim();
        });

        if (model.mobile && !game.device.iOS) {
            (game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
        }
    }

    drawRecoveredPanel() {
        let saved = model.data('savedFS').doorsValue;
        for(let i = 0; i < saved.length; i++) {
            let door = this.doors[i];
            door.destroyed = true;
            door._playGold();
            door._playGlassBoom();
            door._playTable(+saved[i].substring(1));
        }
        model.data('savedFS', null);
    }

}

function handleDoorHover() {
    if (model.state('hoverBonus') == false) return;
    this.showHover();

}

function handleDoorClick() {
    if (this.destroyed || model.state('doorFinish') || !model.state('bonusReady')) return;
    request.send('Roll')
        .then((data) => {
            model.state('bonusReady', false);
            this.data = data;
            model.data('bonusRollResponse', data);
            if (data.ErrorCode) {
                mainView.draw.showPopup({message: data.ErrorMessage});
                return;
            }
            model.data('bonusWinCoins', model.data('bonusWinCoins') + data.Balance.TotalWinCoins);
            console.log(data);
        })
        .then(() => {
            return request.send('Ready');
        })
        .then((readyData) => {
            if (readyData.ErrorCode) {
                mainView.draw.showPopup({message: readyData.ErrorMessage});
                return;
            }

            model.state('bonusReady', true);
        })
        .then(() => {
            model.updateBalance({ startBonusRoll: true });
            if (!this.isWinPlayed) {
                // this.showAnim();
                if (this.data.CurrentValue != 'Exit') {
                    this.win(this.sprite);
                    this.isWinPlayed = true;
                    if (this.data.BonusEnd) {
                        // Переходной экран Big Win
                        // soundController.sound.playSound({ sound: 'illumWin' });
                        bonusView.draw.showWin({ winTextFrame: 'bigW.png' });
                        soundController.sound.playSound({ sound: 'win' });
                        soundController.music.stopMusic('bonusFon');
                        soundController.music.stopMusic('sea');
                        setTimeout(() => {
                            endBonus();
                        }, 4500);
                    }
                } else {
                    model.state('doorFinish', true);
                    this.fail(this.sprite);
                    this.isWinPlayed = true;
                    // Переходной экран Total Win
                    bonusView.draw.showWin({});
                    soundController.sound.playSound({ sound: 'win' });
                    soundController.music.stopMusic('bonusFon');
                    setTimeout(() => {
                        endBonus();
                    }, 4500);
                }
            }
        })
        .catch((err) => {
            if (err.status) {
                mainView.draw.showPopup({message: 'Connection problem. Click to restart'});
            }
            console.error(err);
        });
}


function endBonus() {
    model.updateBalance({ endBonus: true });
    model.state('buttons:locked', false);
    model.state('bonus', false);
    model.state('doorFinish', false);
    model.el('game').state.start('Main');
}
