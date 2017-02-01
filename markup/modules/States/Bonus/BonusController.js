import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { config } from 'modules/Util/Config';
import { view as bonusView } from 'modules/States/Bonus/BonusView';
import { view as mainView } from 'modules/States/Main/MainView';

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
        this.destroyed = true;
        this.game.add.tween(this.sprite)
            .to({alpha: 0}, 300, 'Linear', true);
        this.table = this.game.add.sprite(this.x, this.y, 'bonusNumber', `x${parseInt(this.data.CurrentValue)}.png`);
        this.table.anchor.set(0.6, 0.8);
        this.table.alpha = 0;
        this.table.angle = this.game.rnd.integerInRange(-15, 15);

        if (model.mobile) {
            this.table.scale.set(0.66);
        }
        this.game.add.tween(this.table)
            .to({alpha: 1}, 500, 'Linear', true);
        this.game.add.tween(this.table)
            .from({y: this.table.y + 50}, 400, 'Linear', true);
        model.group('bg').add(this.table);
    }

    fail() {
        this.destroyed = true;
        this.doors.forEach((door) => {
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
        this.doors = [];
        model.data('bonusWinCoins', 0);
        model.state('bonus', true);
        console.log('I am inited!');

        bonusView.create.groups({});
    }

    create() {
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
        model.el('game').frameAnims.forEach((anim) => {
            anim();
        });
    }

}
function handleDoorClick() {
    if (this.destroyed) return;
    request.send('Roll')
        .then((data) => {
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
        })
        .then(() => {
            if (!this.isWinPlayed) {

                if (this.data.CurrentValue != 'Exit') {
                    this.win();
                    this.isWinPlayed = true;
                    if (this.data.BonusEnd) {
                        // Переходной экран Big Win
                        bonusView.draw.showWin({winTextFrame: 'bigW.png'});
                        setTimeout(() => {
                            model.state('buttons:locked', false);
                            model.state('bonus', false);
                            this.game.state.start('Main');
                        }, 4000);
                    }
                } else {
                    this.doors.forEach((door) => {
                        door.fail();
                    });
                    bonusView.draw.showOctopus({});
                    // Переходной экран Total Win
                    bonusView.draw.showWin({});
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
