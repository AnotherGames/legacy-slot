import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { config } from 'modules/Util/Config';
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

        this.light = this.game.add.sprite(this.x, this.y, 'light')
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
        soundController.sound.playSound({sound: `illumBreak${rnd}`});
        soundController.sound.playSound({sound: 'illumWin', duration: 1200});

        this.destroyed = true;
        this.game.add.tween(this.sprite)
            .to({alpha: 0}, 300, 'Linear', true);
        this.table = this.game.add.sprite(this.x, this.y, 'bonusNumber', `x${parseInt(this.data.CurrentValue)}.png`);
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
            .to({alpha: 1}, 500, 'Linear', true);
        this.game.add.tween(this.table)
            .to({alpha: 1}, 500, 'Linear', true);
        this.game.add.tween(this.table)
            .from({y: this.table.y + 50}, 400, 'Linear', true);
        model.group('bg').add(this.table);
        model.group('bg').add(this.gold);
    }

    fail() {
        this.destroyed = true;

        soundController.sound.playSound({sound: 'illumFail'});

        this.doors.forEach((door) => {
            this.tentacle = this.game.add.sprite(door.x - 50, door.y + 5, 'tentacles');
            this.tentacle.anchor.set(0.5);
            this.tentacle.angle = this.game.rnd.integerInRange(-40, 40);
            if (model.mobile) {
                this.tentacle.scale.set(0.66);
            }
            model.group('bg').add(this.tentacle);
            let tentacleShow = this.tentacle.animations.add('show', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 20, false);
            let tentacleMove = this.tentacle.animations.add('move', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 19, 18], 20, true);
            this.tentacle.animations.play('show');
            tentacleShow.onComplete.add(() =>{this.tentacle.animations.play('move')}, this);

            this.game.add.tween(door.sprite)
                .to({alpha: 0}, 500, 'Linear', true);
            if (door.table) {
                this.game.add.tween(door.table)
                    .to({alpha: 0}, 300, 'Linear', true);
            }
        });

    }

    lightBlinking() {
        if (!this.destroyed) {
            this.game.add.tween(this.light).to({alpha: 0.6}, 500, 'Linear', true, 0, 0, true);
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
        console.log('I am inited!');

        bonusView.create.groups({});

    }

    create() {
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('bonusFon');

        bonusView.draw.mainBG({});

        for (let i = 0; i < 5; i++) {
            this.doors.push(new Door(config.illuminatorsCoords[i].x, config.illuminatorsCoords[i].y, this.doors, i + 1));
            let blinkTimeout = this.game.rnd.integerInRange(2000, 3000);
        }

        mainView.draw.addBubbles({});
        mainView.draw.addFishes({y1: (model.desktop) ? 650 : 400, y2: (model.desktop) ? 900 : 700});
        bonusView.draw.bigFish({});
        bonusView.draw.addLight({});
        bonusView.draw.upperBG({});
    }

    update() {
        model.el('game').winAnims.forEach((anim) => {
            anim();
        });
    }

}
function handleDoorClick() {
    if (this.destroyed) return;
    if (!model.state('bonusReady')) return;
    request.send('Roll')
        .then((data) => {
            model.state('bonusReady', false);
            this.data = data;
            model.data('bonusWinCoins', model.data('bonusWinCoins') + data.Balance.TotalWinCoins);
            console.log(data);
        })
        .then(() => {
            return request.send('Ready');
        })
        .then((readyData) => {
            if (readyData.ErrorCode != 0) {
                throw new Error(readyData.ErrorMessage);
            }
            model.state('bonusReady', true);
        })
        .then(() => {
            if (!this.isWinPlayed) {

                if (this.data.CurrentValue != 'Exit') {
                    this.win();
                    this.isWinPlayed = true;
                    if (this.data.BonusEnd) {
                        // Переходной экран Big Win
                        soundController.sound.playSound({sound: 'illumWin'});
                        this.doors.forEach((door) => {
                            this.finalGold = this.game.add.spine(door.x, door.y, 'gold');
                            if (model.mobile) {
                                this.finalGold.scale.set(0.66);
                            }
                            model.group('bg').add(this.finalGold);
                            this.finalGold.setAnimationByName(1, '2', false);
                        });
                        soundController.sound.playSound({sound: 'win'});
                        bonusView.draw.showWin({winTextFrame: 'bigW.png'});
                        soundController.music.stopMusic('bonusFon');
                        setTimeout(() => {
                            model.state('buttons:locked', false);
                            model.state('bonus', false);
                            this.game.state.start('Main');
                        }, 4000);
                    }
                } else {
                    this.fail();
                    bonusView.draw.showOctopus({});
                    // Переходной экран Total Win
                    bonusView.draw.showWin({});
                    soundController.music.stopMusic('bonusFon');
                    setTimeout(() => {
                        model.state('buttons:locked', false);
                        model.state('bonus', false);
                        this.game.state.start('Main');
                    }, 4000);
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
}
