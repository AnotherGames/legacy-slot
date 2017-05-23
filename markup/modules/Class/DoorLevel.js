import { model } from 'modules/Model/Model';
import { request } from "../../../Info/Request";
import {view as bonusView} from "modules/States/Bonus/BonusView";
import {view as mainView} from "modules/States/Main/MainView";
import { controller as soundController } from '../../../Info/SoundController';

const config = [
    [ // level 0
        { x: 0.27, y: 0.55 },
        { x: 0.38, y: 0.55 },
        { x: 0.5, y: 0.55 },
        { x: 0.61, y: 0.55 },
        { x: 0.73, y: 0.55 }
    ],
    [ // level 1
        { x: 0.264, y: 0.545 },
        { x: 0.38, y: 0.55 },
        { x: 0.495, y: 0.55 },
        { x: 0.61, y: 0.55 },
        { x: 0.723, y: 0.547 }
    ],
    [ // level 2
        { x: 0.27, y: 0.55 },
        { x: 0.38, y: 0.55 },
        { x: 0.5, y: 0.55 },
        { x: 0.61, y: 0.55 },
        { x: 0.723, y: 0.553 }
    ],
    [ // level 3
        { x: 0.27, y: 0.55 },
        { x: 0.38, y: 0.55 },
        { x: 0.5, y: 0.55 },
        { x: 0.61, y: 0.55 },
        { x: 0.723, y: 0.553 }
    ],
    [ // level 4
        { x: 0.268, y: 0.6},
        { x: 0.38, y: 0.6},
        { x: 0.5, y: 0.6},
        { x: 0.617, y: 0.6},
        { x: 0.73, y: 0.6}
    ]
]

export default class DoorLevel {

    constructor({
        container,
        level
    }) {

        this.game = model.el('game')
        this.container = container;
        this.level = level;
        this.doors = [];

        // Выигрыш или проигрыш который за дверями
        if (this.level != 4) {
            this.bg = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, `bgDoors_${level}`, null, container);
            this.bg.anchor.set(0.5);
            if (model.desktop) {
                this.bg.scale.set(1.5);
            }

            // все двери кроме последней
            this.addDoors(level);
        }


        // Заставка этого уровня дверей
        this.fg = this.game.add.sprite(0, 0, `fgDoors_${level}`, null, container);
        if (model.desktop) {
            this.fg.scale.set(1.5);
        }

        if (level == 4) {
            // Последние двери
            this.addDoors(level);
        }

        // Затемнение
        this.game.camera.flash(0x000000, 500);

    }

    addDoors(level) {
        for (let i = 0; i < 5; i++) {
            this.doors.push(
                new Door({
                    container: this.container,
                    level,
                    index: i,
                    parentLevel: this
                })
            );
        }
    }

    setResult(result, x = 0, y = 0) {

        if (this.level != 4) {
            this.bg.frameName = `bgDoors_${this.level}_${result}.png`;
        } else {
            if (result == 'fail') {
                let fly = this.game.add.sprite(x, y, 'fly', null, this.container);
                this.game.add.tween(fly).to({x: fly.x + this.game.rnd.integerInRange(-50, 50), y: fly.y - 500}, 1000, 'Linear', true);
            }
        }

    }

    showLastWin(x, y) {
        this.gold = new Gold({
            container: this.container,
            x: x,
            y: y
        });
        setTimeout(() => {
            this.gold.start();
        }, 300)
    }

    showMulti(amount) {

        this.multiX = this.game.add.bitmapText(this.game.world.centerX - 30, this.game.world.centerY + 135, 'numbersFont', 'x', 12, this.container);
        this.multiX.anchor.set(0.5);
        this.multiX.scale.set(0);

        this.multi = this.game.add.bitmapText(this.game.world.centerX + 50, this.game.world.centerY + 150, 'numbersFont', '' + amount, 20, this.container);
        this.multi.anchor.set(0.5);
        this.multi.scale.set(0);

        this.game.add.tween(this.multi.scale).to({x: 1.5, y: 1.5}, 1500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(this.multiX.scale).to({x: 1.5, y: 1.5}, 1500, Phaser.Easing.Bounce.Out, true);

    }

}

export class Gold {

    constructor({
        container,
        x = 0,
        y = 0
    }) {

        this.game = model.el('game');

        this.container = this.game.add.group();
        container.add(this.container);

        this.light = this.game.add.sprite(x, y, 'bigLight', null, this.container);
        this.light.anchor.set(0.5);
        this.light.y = this.light.y - this.light.height * 0.5;

        this.gold = this.game.add.sprite(x + 10, y + this.light.height * 0.5, 'gold', null, this.container);
        this.gold.anchor.set(0.5);
        this.gold.alpha = 0;
        this.light.alpha = 0;

        if (model.desktop) {
            this.light.scale.set(1.5);
            this.gold.scale.set(1.5);
        }

        // Добавить маску в контейнер
        let mask = this.game.add.graphics(0, 0, this.container);
        mask.beginFill(0xffffff).drawRect(x - this.light.width * 0.5, y - this.light.height, this.light.width, this.light.height);
        this.container.mask = mask;

    }

    start() {
        this.gold.alpha = 1;
        this.game.add.tween(this.gold).to({ y: this.gold.y - this.light.height - this.gold.height, alpha: 0 }, 1500, Phaser.Easing.Out, true);
        this.game.add.tween(this.light).to({ alpha: 1 }, 600, Phaser.Easing.Out, true);
        this.game.add.tween(this.light).to({ alpha: 0 }, 1500, Phaser.Easing.Out, true, 600);

    }

}

export class Door {

    constructor({
        container,
        level,
        index,
        parentLevel
    }) {

        this.game = model.el('game');
        this.parent = parentLevel;
        this.container = container;

        let spriteName = (level == 0) ? `door_${level}_${index}.png` : null;

        let sprite;
        if (level == 4) {
            if (index == 0 || index == 1) {
                sprite = 'door_4_1';
            } else if (index == 2) {
                sprite = 'door_4_2';
            } else {
                sprite = 'door_4_3';
            }
        } else {
            sprite = `door_${level}`;
        }

        if (level == 0) {
            let width = (model.desktop) ? 205 : 137;
            let height = (model.desktop) ? 525 : 312;
            this.bg = this.game.add.graphics(this.game.width * config[level][index].x - width / 2,  // magic number - this.sprite.width
                this.game.height * config[level][index].y - height / 2, // magic number - this.sprite.height
                this.container
            ).beginFill(0x000000, 1.0).drawRect(0, 0, width, height);
        }

        this.sprite = this.game.add.sprite(this.game.width * config[level][index].x, this.game.height * config[level][index].y, sprite, spriteName, this.container);
        this.sprite.anchor.set(0.5);
        if (model.desktop) {
            this.sprite.scale.set(1.5);
        }

        if (level != 0 && level != 4) {
            this.sprite.frame = index;
        }

        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(() => {
            if (model.state(`doors:${level}:open`)) return;

            this.sendRoll(index)
                .then((data) => {
                    model.data(`doors:${level}:data`, data);
                    model.data('bonusRollResponse', data);
                    if (data.ErrorCode) {
	                    model.el('popup').showReloadPopup();
	                    return;
                    }
                    model.data('bonusWinCoins', data.CurrentValue.TotalWinCoins);

                    console.log(data);

                    request.send('Ready');

                    soundController.sound.playSound({sound: `door${level + 1}`});

                    if (data.CurrentValue.Multi !== 'Exit' && data.BonusEnd !== true) {

                        // Изменить бекграунд уровня дверей
                        this.parent.setResult('win');
                        // Отрисовать множитель
                        this.parent.showMulti(
                            parseInt(data.CurrentValue.Multi)
                        );
                        // Через определенный таймер сделать затемнение убрать все спрайты из контейнера
                        setTimeout(() => {
                            this.container.removeAll();
                            this.game.camera.flash(0x000000, 500);
                        }, 2000);
                        // И отрисовать новый уровень
                        setTimeout(() => {
                            new DoorLevel({container: model.group('main'), level: ++level});
                        }, 2500)
                        // Заполнить поля баланса
                        model.updateBalance({startBonusRoll: true});

                    }

                    if (data.CurrentValue.Multi === 'Exit' && data.BonusEnd === true) {

                        // Обычный выход Total Win
                        this.parent.setResult('fail', this.sprite.x, this.sprite.y);
                        if (level == 2) {
                            soundController.sound.playSound({sound: 'laugh'});
                        }
                        if (level == 4) {
                            soundController.sound.playSound({sound: 'fly'});
                        }
                        bonusView.draw.showWin({});
                        setTimeout(() => {
                            this.container.removeAll();
                            this.game.camera.flash(0x000000, 500);
                        }, 3000);
                        setTimeout(() => {
                            this.endBonus();
                        }, 3500)

                    }

                    if (data.CurrentValue.Multi !== 'Exit' && data.BonusEnd === true) {

                        // выход с последнего уровня Big Win
                        this.parent.showMulti(
                            parseInt(data.CurrentValue.Multi)
                        );
                        this.parent.showLastWin(this.sprite.x, this.sprite.y);
                        soundController.sound.playSound({sound: 'coins'});
                        bonusView.draw.showWin({winTextFrame: 'bigW.png'});
                        setTimeout(() => {
                            this.container.removeAll();
                            this.game.camera.flash(0x000000, 500);
                        }, 3000);
                        setTimeout(() => {
                            this.endBonus();
                        }, 3500)

                    }

                        // либо показать заставку последнего экрана если человек проиграл

                    this.open(level);
                    model.state(`doors:${level}:open`, true);
                })

        }, this);

    }

    open(level) {

        // play open animation
        if (level == 0) {
            this.game.add.tween(this.bg).to({alpha: 0}, 300, 'Linear', true);
            this.game.add.tween(this.sprite).to({y: -600}, 300, 'Linear', true);
        } else {
            this.sprite.animations.add('open');
            this.sprite.animations.play('open', 20, false);
        }

    }

    sendRoll(doorIndex) {

        return request.send('Roll', null, doorIndex)

    }

    endBonus() {
        model.updateBalance({endBonus: true});
        model.state('buttons:locked', false);
        model.state('bonus', false);
        model.state('doorFinish', false);
        // soundController.music.stopMusic('bonusFon');

        model.state(`doors:0:open`, false);
        model.state(`doors:1:open`, false);
        model.state(`doors:2:open`, false);
        model.state(`doors:3:open`, false);
        model.state(`doors:4:open`, false);

        model.el('game').state.start('Main');
    }

}
