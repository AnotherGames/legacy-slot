import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { config } from 'modules/Util/Config';

import { controller as footerController } from 'modules/Footer/FooterController';

import { view as footerView } from 'modules/Footer/FooterView';
import { view as balanceView } from 'modules/Balance/BalanceView';
import { view as bonusView } from 'modules/States/Bonus/BonusView';
import { view as mainView } from 'modules/States/Main/MainView';
import { controller as soundController } from 'modules/Sound/SoundController';
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

    showAnim() {
        this.destroyed = true;
        let number = parseInt(this.sprite.frameName, 10);
        bonusView.draw.changeAnim({number: number, anim: 'open'});
    }

    showHover() {
        if (this.destroyed == true) return;
        let number = parseInt(this.sprite.frameName, 10);
        bonusView.draw.changeAnim({number: number, anim: 'target'});
    }

    win() {

        let rnd = this.game.rnd.integerInRange(1, 3);
        soundController.sound.playSound({ currentSound: `illumBreak${rnd}` });
        soundController.sound.playSound({ currentSound: 'illumWin', duration: 1200 });

        let number = parseInt(this.data.CurrentValue, 10);

        this.multi = this.game.add.sprite(this.x, this.y, 'multi', `x${number}.png`, model.group('bg'));
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
        let number = parseInt(sprite.frameName, 10);
        soundController.sound.playSound({ currentSound: 'illumFail', soundVolume: 3 });
        bonusView.draw.showFailBubbles({x: this.x, y: this.y, number: number});
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
            footerController.initFsDesktop();
            footerView.draw.TopFooter({});
            balanceView.draw.FSMobileBalance({});
        } else {
            footerController.initMobile();
            mobileSetBetController.init({});
            balanceView.draw.FSMobileBalance({});
        }
        balanceView.draw.CashBalance({});
        model.updateBalance({ startBonus: true });

        if(model.data('savedFS')){
            this.drawRecoveredPanel();
        }

    }

    update() {
        let game = model.el('game');

        footerController.updateTime({});
        game.winAnims.forEach((anim) => {
            anim();
        });

        if (model.desktop) {
            let fullScreeButton = model.el('fullScreeButton');
            fullScreeButton.frameName = (this.game.scale.isFullScreen || window.innerHeight == screen.height) ? 'fullScreenOff.png' : 'fullScreenOn.png';
        }

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
                this.showAnim();
                if (this.data.CurrentValue != 'Exit') {
                    // this.fail(this.sprite);
                    this.win();
                    this.isWinPlayed = true;
                    if (this.data.BonusEnd) {
                        // Переходной экран Big Win
                        soundController.sound.playSound({ currentSound: 'illumWin' });
                        soundController.sound.playSound({ currentSound: 'win' });
                        bonusView.draw.showWin({ winTextFrame: 'bigW.png' });
                        soundController.music.stopMusic('bonusFon');
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
