import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { config } from 'modules/Util/Config';

import { controller as footerController } from 'modules/Footer/FooterController';

import { view as footerView } from 'modules/Footer/FooterView';
import { view as balanceView } from 'modules/Balance/BalanceView';
import { view as bonusView } from 'modules/States/Bonus/BonusView';
import { view as mainView } from 'modules/States/Main/MainView';
import { controller as soundController } from 'modules/Sound/SoundController';

class Door {
    constructor(x, y, arr, index) {
        this.game = model.el('game');

        this.x = (model.desktop) ? x : x * 2 / 3;
        this.y = (model.desktop) ? y : y * 2 / 3;
        this.doors = arr;
        this.deltaTime = 100 * index;

        this.destroyed = false;
        this.isWinPlayed = false;

        this.light = this.game.add.sprite(this.x, this.y, 'light');
        this.light.anchor.set(0.5);
        this.light.alpha = 0;
        model.group('bg').add(this.light);

        this.sprite = this.game.add.sprite(this.x, this.y, 'illuminators', `${index}.png`);
        this.sprite.anchor.set(0.5);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(handleDoorClick, this);
        model.group('bg').add(this.sprite);

        setTimeout(() => {
            this.lightBlinking();
        }, this.deltaTime + 1000);
    }

    win() {
        let rnd = this.game.rnd.integerInRange(1, 3);
        soundController.sound.playSound({ sound: `illumBreak${rnd}` });
        soundController.sound.playSound({ sound: 'illumWin', duration: 1200 });

        this.destroyed = true;
        this.game.add.tween(this.sprite)
            .to({ alpha: 0 }, 300, 'Linear', true);
        this.table = this.game.add.sprite(this.x, this.y, 'bonusNumber', `x${parseInt(this.data.CurrentValue, 10)}.png`);
        this.table.anchor.set(0.6, 0.8);
        this.table.alpha = 0;
        this.table.angle = this.game.rnd.integerInRange(-15, 15);

        this.gold = this.game.add.spine(this.x, this.y, 'gold');
        this.gold.setAnimationByName(1, '1', false);
        this.gold.alpha = 0;

        if (model.mobile) {
            this.table.scale.set(0.66);
            this.gold.scale.set(0.66);
        }

        this.game.add.tween(this.gold)
            .to({ alpha: 1 }, 500, 'Linear', true);
        this.game.add.tween(this.table)
            .to({ alpha: 1 }, 500, 'Linear', true);
        this.game.add.tween(this.table)
            .from({ y: this.table.y + 50 }, 400, 'Linear', true);
        model.group('bg').add(this.table);
        model.group('bg').add(this.gold);
    }

    fail() {
        this.destroyed = true;

        soundController.sound.playSound({ sound: 'illumFail' });

        this.doors.forEach((door) => {
            door.tentacle = this.game.add.sprite(door.x - 50, door.y + 5, 'tentacles');
            door.tentacle.anchor.set(0.5);
            door.tentacle.angle = this.game.rnd.integerInRange(-40, 40);
            console.log(door.tentacle.angle);
            if (model.mobile) {
                door.tentacle.scale.set(0.66);
                door.tentacle.angle = this.game.rnd.integerInRange(-30, 30);
            }
            model.group('bg').add(door.tentacle);

            let tentacleShow = door.tentacle.animations.add('show', Phaser.Animation.generateFrameNames('tc1_', 0, 16, '.png', 2), 20, false);
            door.tentacle.animations.add('move', Phaser.Animation.generateFrameNames('tc2_', 0, 16, '.png', 2), 20, true);
            door.tentacle.animations.play('show');
            tentacleShow.onComplete.add(() => {
                door.tentacle.animations.play('move');
            }, door);

            this.game.add.tween(door.sprite)
                .to({ alpha: 0 }, 500, 'Linear', true);
            if (door.table) {
                this.game.add.tween(door.table)
                    .to({ alpha: 0 }, 300, 'Linear', true);
            }
        });

    }

    lightBlinking() {
        if (!this.destroyed) {
            this.game.add.tween(this.light).to({ alpha: 0.6 }, 500, 'Linear', true, 0, 0, true);
            setTimeout(() => {
                this.lightBlinking();
            }, 4000);
        }
    }

}

export class Bonus {

    init() {
        this.game = model.el('game');
        this.game.winAnims = [];
        this.doors = [];
        model.data('bonusWinCoins', 0);
        model.state('bonus', true);
        model.state('bonusReady', true);

        bonusView.create.groups({});
        model.updateBalance({ startBonus: true });

    }

    create() {
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('bonusFon');

        bonusView.draw.mainBG({});

        for (let i = 0; i < 5; i++) {
            this.doors.push(new Door(config.illuminatorsCoords[i].x, config.illuminatorsCoords[i].y, this.doors, i + 1));
        }

        mainView.draw.addBubbles({});
        mainView.draw.addFishes({ y1: (model.desktop) ? 650 : 400, y2: (model.desktop) ? 900 : 700 });
        bonusView.draw.bigFish({});
        bonusView.draw.addLight({});
        bonusView.draw.upperBG({});

        if (model.desktop) {
            footerController.initDesktop();
            footerView.draw.TopFooter({});
            balanceView.draw.FSMobileBalance({});
        } else {
            footerController.initMobile();
            balanceView.draw.FSMobileBalance({});
        }
        balanceView.draw.CashBalance({});
    }

    update() {
        let game = model.el('game');

        footerController.updateTime({});
        game.winAnims.forEach((anim) => {
            anim();
        });

        if (model.desktop) {
            let fullScreeButton = model.el('fullScreeButton');
            fullScreeButton.frameName = (this.game.scale.isFullScreen || window.innerHeight == screen.height) ? 'fullscreenOff.png' : 'fullscreen.png';
        }
    }

}
function handleDoorClick() {
    if (this.destroyed || model.state('doorFinish')|| !model.state('bonusReady')) return;
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

                if (this.data.CurrentValue != 'Exit') {
                    this.win();
                    this.isWinPlayed = true;
                    if (this.data.BonusEnd) {
                        // Переходной экран Big Win
                        soundController.sound.playSound({ sound: 'illumWin' });
                        this.doors.forEach((door) => {
                            this.finalGold = this.game.add.spine(door.x, door.y, 'gold');
                            if (model.mobile) {
                                this.finalGold.scale.set(0.66);
                            }
                            model.group('bg').add(this.finalGold);
                            this.finalGold.setAnimationByName(1, '2', false);
                        });
                        soundController.sound.playSound({ sound: 'win' });
                        bonusView.draw.showWin({ winTextFrame: 'bigW.png' });
                        soundController.music.stopMusic('bonusFon');
                        setTimeout(() => {
                            endBonus();
                        }, 4500);
                    }
                } else {
                    model.state('doorFinish', true);
                    this.fail();
                    this.isWinPlayed = true;
                    bonusView.draw.showOctopus({});
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
            if (err.status == 404) mainView.draw.showPopup({message: 'Connection problem. Click to restart'});
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
