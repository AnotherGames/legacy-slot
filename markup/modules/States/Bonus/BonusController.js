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
        }, this.deltaTime);
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

    lightBlinking() {
        if (!this.destroyed) {
            this.game.add.tween(this.light).to({alpha: 0.6}, 800, 'Linear', true, 0, -1, true);
        }
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
        bonusView.draw.mainBG({});

        for (let i = 0; i < 5; i++) {
            this.doors.push(new Door(config.illuminatorsCoords[i].x, config.illuminatorsCoords[i].y, this.doors, i + 1));
        }

        mainView.draw.addBubbles({});
        mainView.draw.addFishes({y1: (model.desktop) ? 650 : 400, y2: (model.desktop) ? 900 : 700});
        bonusView.draw.bigFish({});
        bonusView.draw.addLight({});
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
