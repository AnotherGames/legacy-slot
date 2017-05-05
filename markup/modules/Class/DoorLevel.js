import model from '../Model/Model';
import { request } from "../../../Info/Request";

const config = [
    [ // level 0
        { x: 100, y: 200},
        { x: 200, y: 200},
        { x: 300, y: 200},
        { x: 400, y: 200},
        { x: 500, y: 200}
    ],
    [ // level 1
        { x: 100, y: 200},
        { x: 200, y: 200},
        { x: 300, y: 200},
        { x: 400, y: 200},
        { x: 500, y: 200}
    ],
    [ // level 2
        { x: 100, y: 200},
        { x: 200, y: 200},
        { x: 300, y: 200},
        { x: 400, y: 200},
        { x: 500, y: 200}
    ],
    [ // level 3
        { x: 100, y: 200},
        { x: 200, y: 200},
        { x: 300, y: 200},
        { x: 400, y: 200},
        { x: 500, y: 200}
    ],
    [ // level 4
        { x: 100, y: 200},
        { x: 200, y: 200},
        { x: 300, y: 200},
        { x: 400, y: 200},
        { x: 500, y: 200}
    ]
]

export default class DoorLevel {

    constructor({
        container,
        level
    }) {

        this.game = model.el('game')
        this.container = container;

        // Выигрыш или проигрыш который за дверями
        this.bg = this.game.add.sprite(0, 0, `bg_doors_${level}_win`, null, container);

        // все двери
        this.addDoors(level);

        // Заставка этого уровня дверей
        this.fg = this.game.add.sprite(0, 0, `fg_doors_${level}`, null, container);

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

        this.bg.frameName = `bg_doors_${this.level}_${result}`;

    }

    showMulti(amount) {

        this.multi = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, `multi_doors_${amount}`);
        this.multi.scale.set(0);

        // Добавить твин прыгающего появления

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

        this.sprite = this.game.add.sprite(config[level][index].x, config[level][index].y, `door_${level}_${index}`, null, container);

        this.sprite.inputEnabled = true;
        this.sprite.onInputDown.add(() => {
            if (model.state(`doors:${level}:open`)) return;

            this.sendRoll(index)
                .then((data) => {
                    model.data(`doors:${level}:data`, data);

                    // Изменить бекграунд уровня дверей
                    this.parent.setResult(data.Win);
                    // Отрисовать множитель
                    this.parent.showMulti(data.Multi);
                    // Заполнить поля баланса (это можно стырить из GS)
                    setTimeout(() => {
                        this.container.removeAll();
                        this.game.camera.flash(0x000000, 500);
                    }, 2000);
                    // Через определенный таймер (порядка 2-ух секунд) сделать затемнение убрать все спрайты из контейнера
                    //  и отрисовать новый уровень
                    // либо показать заставку последнего экрана если человек проиграл

                    this.open();
                    model.state(`doors:${level}:open`, true);
                })

        }, this);

    }

    open() {

        // play open animation

    }

    sendRoll(doorIndex) {

        return request.send('Roll', null, doorIndex)

    }

}
