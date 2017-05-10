import { model } from 'modules/Model/Model';
import { request } from "../../../Info/Request";

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
        { x: 0.27, y: 0.55},
        { x: 0.38, y: 0.55},
        { x: 0.5, y: 0.55},
        { x: 0.61, y: 0.55},
        { x: 0.73, y: 0.55}
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

        // Выигрыш или проигрыш который за дверями
        if (this.level != 4) {
            this.bg = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, `bgDoors_${level}`, null, container);
            this.bg.anchor.set(0.5);
            if (model.desktop) {
                this.bg.scale.set(1.5);
            }
        }

        // все двери
        this.addDoors(level);

        // Заставка этого уровня дверей
        this.fg = this.game.add.sprite(0, 0, `fgDoors_${level}`, null, container);
        if (model.desktop) {
            this.fg.scale.set(1.5);
        }

        // Затемнение
        this.game.camera.flash(0x000000, 500);

    }

    addDoors(level) {
        this.doors = [];
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

    setResult(result) {

        if (this.level != 4) {
            this.bg.frameName = `bgDoors_${this.level}_${result}.png`;
        }

    }

    showMulti(amount) {

        this.multi = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, 'numbersFont', 'x' + amount, 20, this.container);
        this.multi.anchor.set(0.5);
        this.multi.scale.set(0);

        this.game.add.tween(this.multi.scale).to({x: 1.5, y: 1.5}, 1500, Phaser.Easing.Bounce.Out, true);

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
            if (index == 0 && index == 1) {
                sprite = 'door_4_1';
            } else if (level == 2) {
                sprite = 'door_4_2';
            } else {
                sprite = 'door_4_3';
            }
        } else {
            sprite = `door_${level}`;
        }

        if (level == 0) {
            this.bg = this.game.add.graphics(this.game.width * config[level][index].x - 205 / 2,  // magic number - this.sprite.width
                this.game.height * config[level][index].y - 525 / 2, // magic number - this.sprite.height
                this.container
            ).beginFill(0x000000, 1.0).drawRect(0, 0, 205, 525);
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

                    console.log(data);

                    request.send('Ready');

                    // Изменить бекграунд уровня дверей
                    if (data.CurrentValue.Multi !== 'Exit') {
                        this.parent.setResult('win');
                        // Отрисовать множитель
                        this.parent.showMulti(
                            parseInt(data.CurrentValue.Multi)
                        );
                        // Через определенный таймер (порядка 2-ух секунд) сделать затемнение убрать все спрайты из контейнера
                        setTimeout(() => {
                            this.container.removeAll();
                            this.game.camera.flash(0x000000, 500);
                        }, 2000);
                        // И отрисовать новый уровень
                        setTimeout(() => {
                            new DoorLevel({container: model.group('main'), level: ++level});
                        }, 2500)
                        // Заполнить поля баланса (это можно стырить из GS)
                        model.updateBalance({startBonusRoll: true});
                        model.log();
                    } else {

                        // Если это последний уровень, то мы показываем Big Win и выходим с бонусного уровня

                        // Если это не последний уровень, то мы показываем Total Win и выходим с бонусного уровня

                        this.parent.setResult('fail');
                        setTimeout(() => {
                            this.container.removeAll();
                            this.game.camera.flash(0x000000, 500);
                            model.updateBalance({endBonus: true});
                        }, 2000);
                        // либо показать заставку последнего экрана если человек проиграл
                    }

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

}
