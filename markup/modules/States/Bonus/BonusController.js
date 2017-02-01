import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { view as bonusView } from 'modules/States/Bonus/BonusView';
import { view as mainView } from 'modules/States/Main/MainView';

class Door {
    constructor(x, y, arr) {
        this.game = model.el('game');

        this.x = x;
        this.y = y;
        this.doors = arr;

        this.destroyed = false;
        this.isWinPlayed = false;

        this.sprite = this.game.add.graphics(x, y);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(handleDoorClick, this);

        this.sprite.beginFill(0xFF0000);
        this.sprite.drawRect(0, 0, 50, 50);

    }

    win() {
        this.destroyed = true;
        this.game.add.tween(this.sprite)
            .to({alpha: 0}, 500, 'Linear', true);
    }
    fail() {
        this.destroyed = true;
        this.game.add.tween(this.sprite)
            .to({alpha: 1}, 500, 'Linear', true);
        this.game.add.tween(this.sprite.scale)
            .to({x: 1.8, y: 1.8}, 500, 'Linear', true);
        console.log('I am failed!', this);
    }
}

export class Bonus {

    init() {
        this.doors = [];
        console.log('I am inited!');

        bonusView.create.groups({});
    }

    create() {
        let game = model.el('game');
        for (let i = 0; i < 5; i++) {
            this.doors.push(new Door(100 * i, 150 * i, this.doors));
        }

        bonusView.draw.mainBG({});
        mainView.draw.addBubbles({});
        mainView.draw.addFishes({y1: (model.desktop) ? 650 : 400, y2: (model.desktop) ? 900 : 700});
        bonusView.draw.bigFish({});
        bonusView.draw.addLight({});
        bonusView.draw.addIllum({});
        bonusView.draw.upperBG({});
    }

}
function handleDoorClick() {
    if (this.destroyed) return;
    request.send('Roll')
        .then((data) => {
            this.data = data;
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
                        setTimeout(() => {
                            // Переходной экран Big Win
                            model.state('buttons:locked', false);
                            this.game.state.start('Main');
                        }, 1500);
                    }
                } else {
                    this.doors.forEach((door) => {
                        door.fail();
                    });
                    setTimeout(() => {
                        // Переходной экран Total Win
                        model.state('buttons:locked', false);
                        this.game.state.start('Main');
                    }, 1500);
                }

            }
        })
        .catch((err) => {
            console.error(err);
        });
}
